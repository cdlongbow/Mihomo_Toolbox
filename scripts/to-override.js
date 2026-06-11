#!/usr/bin/env node
/**
 * to-override.js  （工作流② 核心）
 * ─────────────────────────────────────────────────────────
 * 读取 input/<name>.yaml（完整 Mihomo 配置），
 * 生成通用覆写 JS 到 overrides/<name>.js
 *
 * 设计原则（避免 loop 的根本方案）：
 *   ① 分组原样保留 include-all/filter，不碰任何节点名
 *   ② 只剥离骨架字段和运行时无意义字段
 *   ③ 注入源 YAML 里 proxies 定义的静态节点（DNS劫持/直接连接等）
 *   ④ 生成的 JS 与 FlClash / Mihomo Party / CVR / Sparkle 完全兼容
 *      （v0.8.85+ 之后 FlClash 与其他客户端格式相同，无需单独适配）
 *
 * 用法：
 *   node scripts/to-override.js              # 处理全部 input/*.yaml
 *   node scripts/to-override.js --only name  # 只处理指定文件
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// ─── CLI ──────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const onlyIdx  = args.indexOf("--only");
const onlyName = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

// ─── 不写入覆写文件的骨架字段 ─────────────────────────────────
// 这些字段属于运行环境配置，应由用户自己管理，不应由覆写脚本强制覆盖
const SKIP_KEYS = new Set([
  "mixed-port",
  "port",
  "socks-port",
  "redir-port",
  "tproxy-port",
  "allow-lan",
  "bind-address",
  "mode",
  "log-level",
  "ipv6",
  // 管理面板（各客户端自己管理）
  "external-controller",
  "external-ui",
  "external-ui-url",
  "external-ui-name",
  "secret",
  // GEO（各客户端自己管理）
  "geodata-mode",
  "geodata-loader",
  "geo-auto-update",
  "geo-update-interval",
  "geox-url",
  // 认证（敏感信息不应写入覆写）
  "authentication",
  "skip-auth-prefixes",
]);

// ─── 生成覆写 JS 字符串 ───────────────────────────────────────
function renderOverrideJs(name, config, sourceFile) {
  // 1. 提取静态节点（proxies 数组里手动定义的节点，如 DNS劫持/直接连接）
  //    这些节点在订阅里不存在，必须在覆写脚本里重新注入
  const staticProxies = (config.proxies || []).filter(p => p && p.name);

  // 2. 提取 proxy-groups（原样保留，不做任何变换）
  const proxyGroups = config["proxy-groups"] || [];

  // 3. 提取其余需要覆写的字段（跳过骨架字段和分组/节点字段）
  const overrideFields = {};
  for (const [k, v] of Object.entries(config)) {
    if (SKIP_KEYS.has(k))       continue;
    if (k === "proxies")        continue; // 静态节点单独处理
    if (k === "proxy-groups")   continue; // 分组单独处理
    if (k === "proxy-providers") continue; // provider 由订阅提供
    overrideFields[k] = v;
  }

  // 4. 序列化各部分为 JSON（缩进4格，嵌入脚本后可读性好）
  const staticProxiesJson  = JSON.stringify(staticProxies,  null, 4);
  const proxyGroupsJson    = JSON.stringify(proxyGroups,    null, 4);
  const overrideFieldsJson = JSON.stringify(overrideFields, null, 4);

  // 5. 渲染脚本模板
  return `/**
 * 覆写脚本 — ${name}
 * 由 to-override.js 从 ${sourceFile} 自动生成
 * 生成时间: ${new Date().toISOString()}
 *
 * 兼容客户端:
 *   FlClash v0.8.85+  /  Mihomo Party  /  Clash Party
 *   Clash Verge Rev   /  Sparkle
 *
 * 覆写内容:
 *   ✔ proxy-groups  — 完整分组结构（include-all/filter 原样保留）
 *   ✔ rules         — 完整路由规则
 *   ✔ rule-providers — 规则集定义
 *   ✔ dns           — DNS 配置
 *   ✔ sniffer       — 嗅探配置
 *   ✔ tun           — TUN 配置（enable 默认 false，由客户端界面控制）
 *   ✔ 其他非骨架字段
 *   ✔ 静态节点注入  — ${staticProxies.map(p => p.name).join(" / ") || "无"}
 *
 * 不覆写的字段（由客户端/用户自己管理）:
 *   端口、allow-lan、mode、log-level、管理面板、GEO数据源、认证信息
 */

/** @param {Record<string, any>} config */
function main(config) {

  // ══════════════════════════════════════════════════════════════
  // § 1  注入静态节点
  //      源 YAML 里 proxies: 定义的节点（如 DNS劫持、直接连接）
  //      订阅里没有这些节点，需主动注入，否则分组引用会悬空
  // ══════════════════════════════════════════════════════════════

  const STATIC_PROXIES = ${staticProxiesJson};

  if (STATIC_PROXIES.length > 0) {
    const existingNames = new Set((config.proxies || []).map(p => p.name));
    config.proxies = config.proxies || [];
    for (const p of STATIC_PROXIES) {
      if (!existingNames.has(p.name)) {
        config.proxies.push(p);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // § 2  覆写 proxy-groups
  //      原样替换，分组里的 include-all + filter 由 Mihomo 内核
  //      在运行时自动从 proxy-providers 填充节点，无需硬编码节点名
  // ══════════════════════════════════════════════════════════════

  config["proxy-groups"] = ${proxyGroupsJson};

  // ══════════════════════════════════════════════════════════════
  // § 3  覆写其余字段（dns / rules / rule-providers / sniffer 等）
  // ══════════════════════════════════════════════════════════════

  const OVERRIDE = ${overrideFieldsJson};

  // tun: enable 强制 false，避免与客户端自身 TUN 管理冲突
  // 如需开启 TUN 请在客户端界面操作，或手动修改此脚本
  if (OVERRIDE.tun) {
    OVERRIDE.tun.enable = false;
  }

  Object.assign(config, OVERRIDE);

  return config;
}

if (typeof module !== "undefined") module.exports = main;
`;
}

// ─── 主流程 ───────────────────────────────────────────────────
function main() {
  const root        = process.cwd();
  const inputDir    = path.join(root, "input");
  const overrideDir = path.join(root, "overrides");

  // input/ 目录不存在则创建并提示
  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
    console.error("❌  input/ 目录不存在，已自动创建。");
    console.error("    请将完整 Mihomo YAML 配置文件放入 input/ 目录后重新运行。");
    process.exit(1);
  }
  fs.mkdirSync(overrideDir, { recursive: true });

  // 收集待处理文件
  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith(".yaml") || f.endsWith(".yml"))
    .filter(f => !onlyName || f === `${onlyName}.yaml` || f === `${onlyName}.yml`);

  if (files.length === 0) {
    console.error(
      onlyName
        ? `❌  input/${onlyName}.yaml 不存在`
        : "❌  input/ 目录下没有 .yaml / .yml 文件"
    );
    process.exit(1);
  }

  let ok = 0, fail = 0;

  for (const file of files) {
    const name = path.basename(file).replace(/\.ya?ml$/, "");
    console.log(`\n▶  处理: ${file}`);

    try {
      const raw    = fs.readFileSync(path.join(inputDir, file), "utf8");
      const config = yaml.load(raw);

      if (!config || typeof config !== "object") {
        throw new Error("YAML 解析结果为空或格式错误");
      }

      // 统计分组信息，方便调试
      const groups = config["proxy-groups"] || [];
      const includeAllCount = groups.filter(g => g["include-all"]).length;
      console.log(`   分组总数: ${groups.length}  其中 include-all: ${includeAllCount}`);

      const staticProxies = (config.proxies || []).filter(p => p && p.name);
      if (staticProxies.length > 0) {
        console.log(`   静态节点: ${staticProxies.map(p => p.name).join(", ")}`);
      }

      const js      = renderOverrideJs(name, config, file);
      const outPath = path.join(overrideDir, `${name}.js`);
      fs.writeFileSync(outPath, js);
      console.log(`   ✅  → overrides/${name}.js`);
      ok++;

    } catch (err) {
      console.error(`   ❌  失败: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n${"─".repeat(56)}`);
  console.log(`完成: ${ok} 成功 / ${fail} 失败 / ${files.length} 总计`);
  if (fail > 0) process.exit(1);
}

main();
