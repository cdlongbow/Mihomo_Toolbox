#!/usr/bin/env node
/**
 * to-yaml.js  （工作流① 核心）
 * ─────────────────────────────────────────────────────────
 * 读取 sources.yaml 中的脚本 URL 列表，逐一拉取并执行，
 * 输出完整 Mihomo 配置到 output/<name>.yaml
 *
 * 支持格式：
 *   type: js   → function main(config) { ... return config }
 *   type: yaml → Mihomo Party YAML patch（prepend-/append-/merge）
 *
 * 用法：
 *   node scripts/to-yaml.js              # 处理全部
 *   node scripts/to-yaml.js --only yanet # 只处理指定名称
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const https = require("https");
const http  = require("http");
const vm    = require("vm");
const yaml  = require("js-yaml");

// ─── CLI ──────────────────────────────────────────────────────
const args      = process.argv.slice(2);
const onlyIdx   = args.indexOf("--only");
const onlyName  = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

// ─── HTTP fetch（支持重定向）──────────────────────────────────
function fetch(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    if (redirects === 0) return reject(new Error("Too many redirects: " + url));
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, { timeout: 30_000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const next = new URL(res.headers.location, url).href;
        res.resume();
        return fetch(next, redirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} — ${url}`));
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout: " + url)); });
  });
}

// ─── 基础 Mihomo 配置骨架 ─────────────────────────────────────
function makeBaseConfig(providerDefs) {
  // 把 sources.yaml 里的 proxy_providers 列表转为 Mihomo 对象格式
  const providers = {};
  for (const p of (providerDefs || [])) {
    const def = {
      type:     p.type     || "http",
      url:      p.url,
      interval: p.interval || 86400,
      "health-check": p["health-check"] || {
        enable:   true,
        url:      "https://www.gstatic.com/generate_204",
        interval: 300,
      },
    };
    if (p.override) def.override = p.override;
    if (p.path)     def.path     = p.path;
    providers[p.name] = def;
  }

  return {
    "mixed-port":    7890,
    "allow-lan":     false,
    mode:            "rule",
    "log-level":     "info",
    ipv6:            false,
    "external-controller": "127.0.0.1:9090",
    dns: {
      enable:          true,
      ipv6:            false,
      "enhanced-mode": "fake-ip",
      "fake-ip-range": "198.18.0.0/15",
      "fake-ip-filter": ["*.lan", "*.local"],
      nameserver: [
        "https://doh.pub/dns-query",
        "https://dns.alidns.com/dns-query",
      ],
      fallback: [
        "https://1.0.0.1/dns-query",
        "https://8.8.4.4/dns-query",
      ],
      "fallback-filter": { geoip: true, "geoip-code": "CN", ipcidr: ["240.0.0.0/4"] },
    },
    tun: {
      enable: false,
      stack:  "system",
      "dns-hijack":            ["any:53"],
      "auto-route":            true,
      "auto-detect-interface": true,
    },
    "proxy-providers": providers,
    proxies:       [],
    "proxy-groups": [],
    rules:         [],
  };
}

// ─── JS 覆写脚本执行 ──────────────────────────────────────────
function runJs(code, base) {
  // 构造沙箱：给脚本提供最小化 module/exports/console 环境
  const sandbox = {
    module:  { exports: {} },
    exports: {},
    console: { log: () => {}, warn: () => {}, error: () => {} },
    require: () => ({}),
    // 部分脚本用 globalThis 访问工具
    globalThis: {},
  };
  vm.createContext(sandbox);

  try {
    vm.runInContext(code, sandbox, { timeout: 15_000 });
  } catch (e) {
    throw new Error("JS 执行出错: " + e.message);
  }

  // 寻找 main 函数（多种导出方式都支持）
  let fn =
    (typeof sandbox.module.exports === "function" ? sandbox.module.exports : null) ||
    sandbox.module.exports?.main ||
    sandbox.exports?.main ||
    sandbox.main;

  if (typeof fn !== "function") {
    // 最后兜底：用新 context 直接取全局 main
    try {
      const ctx = {};
      vm.createContext(ctx);
      vm.runInContext(code, ctx, { timeout: 15_000 });
      fn = ctx.main;
    } catch (_) {}
  }

  if (typeof fn !== "function") {
    throw new Error("找不到 main(config) 函数，请确认脚本格式");
  }

  const result = fn(JSON.parse(JSON.stringify(base)));
  if (!result || typeof result !== "object") {
    throw new Error("main(config) 未返回有效对象");
  }
  return result;
}

// ─── YAML patch 应用 ──────────────────────────────────────────
// 支持 Mihomo Party patch 语义:
//   key!  → 强制覆盖
//   +key  → 数组前置
//   key+  → 数组追加
//   key   → 递归合并
function applyPatch(base, patch) {
  if (typeof patch !== "object" || patch === null) return patch;
  const out = Array.isArray(base) ? [...base] : { ...base };

  for (const rawKey of Object.keys(patch)) {
    if (rawKey.endsWith("!")) {
      out[rawKey.slice(0, -1)] = patch[rawKey];
      continue;
    }
    if (rawKey.startsWith("+")) {
      const k = rawKey.slice(1);
      out[k] = [...(patch[rawKey] || []), ...(Array.isArray(out[k]) ? out[k] : [])];
      continue;
    }
    if (rawKey.endsWith("+")) {
      const k = rawKey.slice(0, -1);
      out[k] = [...(Array.isArray(out[k]) ? out[k] : []), ...(patch[rawKey] || [])];
      continue;
    }
    const val = patch[rawKey];
    if (
      typeof val === "object" && val !== null && !Array.isArray(val) &&
      typeof out[rawKey] === "object" && out[rawKey] !== null && !Array.isArray(out[rawKey])
    ) {
      out[rawKey] = applyPatch(out[rawKey], val);
    } else {
      out[rawKey] = val;
    }
  }
  return out;
}

// ─── 主流程 ───────────────────────────────────────────────────
async function main() {
  const root      = process.cwd();
  const srcFile   = path.join(root, "sources.yaml");
  const outputDir = path.join(root, "output");

  if (!fs.existsSync(srcFile)) {
    console.error("❌  找不到 sources.yaml");
    process.exit(1);
  }
  fs.mkdirSync(outputDir, { recursive: true });

  const sources = yaml.load(fs.readFileSync(srcFile, "utf8"));
  const scripts = (sources.scripts || []).filter(s =>
    !onlyName || s.name === onlyName
  );

  if (scripts.length === 0) {
    console.error(onlyName ? `❌  sources.yaml 中找不到 name=${onlyName}` : "❌  scripts 列表为空");
    process.exit(1);
  }

  let ok = 0, fail = 0;

  for (const entry of scripts) {
    const { name, type, url, description = "" } = entry;
    const tag = `[${name}]`;
    console.log(`\n▶  ${tag} type=${type}  ${description}`);
    console.log(`   URL: ${url}`);

    try {
      // 1. 拉取
      const code = await fetch(url);
      console.log(`   ✔ 拉取成功 (${(code.length / 1024).toFixed(1)} KB)`);

      // 2. 构建基础配置
      const base = makeBaseConfig(sources.proxy_providers);

      // 3. 执行覆写
      let result;
      if (type === "js") {
        result = runJs(code, base);
      } else if (type === "yaml") {
        const patch = yaml.load(code);
        if (!patch || typeof patch !== "object") throw new Error("YAML patch 为空或格式错误");
        result = applyPatch(base, patch);
      } else {
        throw new Error(`未知 type="${type}"，只支持 js / yaml`);
      }

      // 4. 确保 proxy-providers 不被脚本清空
      if (!result["proxy-providers"] || Object.keys(result["proxy-providers"]).length === 0) {
        result["proxy-providers"] = makeBaseConfig(sources.proxy_providers)["proxy-providers"];
        console.log(`   ⚠  proxy-providers 被脚本清空，已从 sources.yaml 补回`);
      }

      // 5. 写出
      const header =
        `# 由 to-yaml.js 自动生成 — ${new Date().toISOString()}\n` +
        `# 来源脚本: ${url}\n` +
        `# 说明: ${description}\n` +
        `# ⚠  proxy-providers 中的 url 请替换为真实订阅地址后使用\n\n`;

      const outPath = path.join(outputDir, `${name}.yaml`);
      fs.writeFileSync(outPath, header + yaml.dump(result, { lineWidth: 120, noRefs: true }));
      console.log(`   ✅  → output/${name}.yaml`);
      ok++;

    } catch (err) {
      console.error(`   ❌  失败: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n${"─".repeat(56)}`);
  console.log(`完成: ${ok} 成功 / ${fail} 失败 / ${scripts.length} 总计`);
  if (fail > 0) process.exit(1);
}

main();
