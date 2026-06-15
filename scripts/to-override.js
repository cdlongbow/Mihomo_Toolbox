#!/usr/bin/env node
/**
 * to-override.js  （工作流② 核心）
 * ─────────────────────────────────────────────────────────
 * 读取 input/<name>.yaml（完整 Mihomo 配置），
 * 生成通用覆写 JS 到 overrides/<name>.js
 *
 * 兼容以下常见配置风格：
 *   ① 标准 include-all + filter 风格（如 666OS/YYDS、echs-top 派生）
 *   ② include-all-providers + filter 风格（如 echs-top 原版）
 *   ③ 分组纯引用其他分组名风格（如 Ayanami0）
 *   ④ YaNet 风格（含条件性分组"其他节点"）
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// ─── CLI ──────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const onlyIdx  = args.indexOf("--only");
const onlyName = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

// ─── 无条件跳过的骨架字段 ─────────────────────────────────────
// 属于运行环境，由用户/客户端自己管理，覆写脚本不应强制覆盖
const SKIP_KEYS = new Set([
  "mixed-port", "port", "socks-port", "redir-port", "tproxy-port",
  "allow-lan", "bind-address", "mode", "log-level", "ipv6",
  // 管理面板
  "external-controller", "external-ui", "external-ui-url",
  "external-ui-name", "external-controller-cors", "secret",
  // GEO
  "geodata-mode", "geodata-loader", "geo-auto-update",
  "geo-update-interval", "geox-url",
  // 认证（敏感信息）
  "authentication", "skip-auth-prefixes",
]);

// ─── proxy-providers 处理策略 ─────────────────────────────────
/**
 * 判断一个 provider 是否应写入覆写文件。
 *
 * 规则：
 *   - type: inline  → 跳过。inline provider 的 payload 包含所有订阅节点，
 *     序列化进覆写 JS 会导致体积爆炸，且会把源配置的节点强行覆盖目标订阅。
 *     分组里的 include-all-providers 会自动使用目标订阅的 provider，
 *     不需要在覆写里重新定义。
 *   - type: http/file → 保留。这是自定义的规则集 provider 或补充节点源，
 *     覆写应当带上。
 */
function shouldKeepProvider(def) {
  if (!def || typeof def !== "object") return false;
  if (def.type === "inline") return false;
  return true;
}

// ─── 分组安全性检查 ───────────────────────────────────────────
/**
 * 扫描 proxy-groups，找出可能在某些订阅下产生悬空引用的分组名。
 * 典型情况：YaNet 的"其他节点"在没有冷门节点时不会被生成，
 * 但主策略组的 proxies 里引用了它。
 *
 * 处理方式：在生成的覆写 JS 里加入运行时防御代码，
 * 检测引用的分组是否存在，不存在则从 proxies 里移除。
 */
function findConditionalRefs(groups, staticProxies) {
  const groupNames  = new Set(groups.map(g => g.name));
  const staticNames = new Set((staticProxies || []).map(p => p.name).filter(Boolean));
  const builtins    = new Set(["DIRECT", "REJECT", "REJECT-DROP", "PASS", "PASS-RULE"]);
  const knownNames  = new Set([...groupNames, ...builtins, ...staticNames]);

  // 引用型分组：无 include-all 系列，且 proxies 里至少有一项是已知名字
  // 含义：这个分组的 proxies 是"策略选项列表"（引用其他分组/内置/静态节点）
  // 而非"节点列表"（来自订阅的真实节点，无法预先知晓）
  const refGroups = groups.filter(g => {
    if (g["include-all"] || g["include-all-providers"]) return false;
    const proxies = g.proxies || [];
    if (proxies.length === 0) return false;
    return proxies.some(p => knownNames.has(p));
  });

  // 从引用型分组里找出引用了但不存在的条目（即条件性分组名）
  const allRefs = new Set(refGroups.flatMap(g => g.proxies || []));
  return [...allRefs].filter(r =>
    !groupNames.has(r) && !builtins.has(r) && !staticNames.has(r)
  );
}

// ─── 生成覆写 JS ──────────────────────────────────────────────
function renderOverrideJs(name, config, sourceFile) {

  // § A  静态节点：proxies 数组里手动定义的节点
  //       这些节点在目标订阅里不存在，必须注入
  const staticProxies = (config.proxies || []).filter(p => p && p.name);

  // § B  proxy-groups：原样保留
  //       include-all / include-all-providers / filter 由内核运行时处理
  const proxyGroups = config["proxy-groups"] || [];

  // § C  条件性分组名（运行时可能不存在）
  const conditionalRefs = findConditionalRefs(proxyGroups, staticProxies);

  // § D  proxy-providers：过滤掉 inline 类型，保留 http/file 类型
  const providers = config["proxy-providers"] || {};
  const keptProviders = {};
  const skippedProviders = [];
  for (const [k, v] of Object.entries(providers)) {
    if (shouldKeepProvider(v)) {
      keptProviders[k] = v;
    } else {
      skippedProviders.push(`${k}(${v.type})`);
    }
  }

  // § E  其余覆写字段（跳过骨架字段和已单独处理的字段）
  const overrideFields = {};
  for (const [k, v] of Object.entries(config)) {
    if (SKIP_KEYS.has(k))         continue;
    if (k === "proxies")          continue; // 静态节点单独处理（§1）
    if (k === "proxy-groups")     continue; // 分组单独处理（§2）
    if (k === "proxy-providers")  continue; // provider 单独处理（§3）
    overrideFields[k] = v;
  }

  // 序列化
  const staticProxiesJson  = JSON.stringify(staticProxies,   null, 4);
  const proxyGroupsJson    = JSON.stringify(proxyGroups,     null, 4);
  const keptProvidersJson  = JSON.stringify(keptProviders,   null, 4);
  const overrideFieldsJson = JSON.stringify(overrideFields,  null, 4);
  const conditionalJson    = JSON.stringify(conditionalRefs, null, 4);

  const hasProviders    = Object.keys(keptProviders).length > 0;
  const hasConditional  = conditionalRefs.length > 0;
  const skippedNote     = skippedProviders.length > 0
    ? ` （已跳过 inline 类型: ${skippedProviders.join(", ")}）`
    : "";

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
 *   ✔ proxy-groups    — 完整分组结构（include-all/filter 原样保留）
 *   ✔ proxy-providers — 自定义 provider${skippedNote}
 *   ✔ rules           — 完整路由规则
 *   ✔ rule-providers  — 规则集定义
 *   ✔ dns / sniffer / tun / 其他非骨架字段
 *   ✔ 静态节点注入    — ${staticProxies.length > 0 ? staticProxies.map(p => p.name).join(" / ") : "无"}
 *${hasConditional ? `\n *   ⚠  条件性分组防御 — ${conditionalRefs.join(", ")} 在订阅无匹配节点时可能不存在，\n *      已加入运行时检查，自动从引用列表中移除` : ""}
 *
 * 不覆写的字段（由客户端/用户自己管理）:
 *   端口、allow-lan、mode、log-level、管理面板、GEO数据源、认证信息
 */

/** @param {Record<string, any>} config */
function main(config) {

  // ══════════════════════════════════════════════════════════════
  // § 1  注入静态节点
  //      源配置 proxies: 里的手动节点（直连/拒绝/IPV4优先等）
  //      目标订阅里没有这些节点，必须注入，否则分组引用会悬空
  // ══════════════════════════════════════════════════════════════

  const STATIC_PROXIES = ${staticProxiesJson};

  if (STATIC_PROXIES.length > 0) {
    config.proxies = config.proxies || [];
    const existingNames = new Set(config.proxies.map(p => p.name));
    for (const p of STATIC_PROXIES) {
      if (!existingNames.has(p.name)) {
        config.proxies.push(p);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // § 2  覆写 proxy-groups（原样替换）
  //      include-all / include-all-providers / filter 字段
  //      由 Mihomo 内核在运行时从订阅的 proxy-providers 自动填充节点
  // ══════════════════════════════════════════════════════════════

  config["proxy-groups"] = ${proxyGroupsJson};
${hasConditional ? `
  // ── 条件性分组防御 ──────────────────────────────────────────
  // 以下分组在某些订阅下可能不存在（如"其他节点"需要有冷门节点才会生成）
  // 运行时检查所有分组的 proxies 引用，移除不存在的分组名，防止 loop
  const CONDITIONAL_REFS = ${conditionalJson};
  if (CONDITIONAL_REFS.length > 0) {
    const existingGroupNames = new Set(config["proxy-groups"].map(g => g.name));
    const missingRefs = new Set(CONDITIONAL_REFS.filter(r => !existingGroupNames.has(r)));
    if (missingRefs.size > 0) {
      config["proxy-groups"] = config["proxy-groups"].map(group => {
        if (!Array.isArray(group.proxies)) return group;
        const filtered = group.proxies.filter(p => !missingRefs.has(p));
        return { ...group, proxies: filtered };
      });
    }
  }
` : ""}
  // ══════════════════════════════════════════════════════════════
  // § 3  覆写 proxy-providers（仅保留 http/file 类型）
  //      inline 类型已跳过（避免把订阅节点序列化进覆写文件）
  //      目标订阅自身的 providers 不受影响，会被合并保留
  // ══════════════════════════════════════════════════════════════

  const PROVIDERS = ${keptProvidersJson};
  if (Object.keys(PROVIDERS).length > 0) {
    config["proxy-providers"] = Object.assign(
      {},
      config["proxy-providers"] || {},  // 保留目标订阅原有 provider
      PROVIDERS                          // 追加/覆盖自定义 provider
    );
  }

  // ══════════════════════════════════════════════════════════════
  // § 4  覆写其余字段（dns / rules / rule-providers / sniffer 等）
  // ══════════════════════════════════════════════════════════════

  const OVERRIDE = ${overrideFieldsJson};

  // tun.enable 强制 false：避免与客户端自身 TUN 管理冲突
  // 如需开启 TUN 请在客户端界面操作，或手动删除此行
  if (OVERRIDE.tun) OVERRIDE.tun.enable = false;

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

  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
    console.error("❌  input/ 目录不存在，已自动创建。");
    console.error("    请将完整 Mihomo YAML 配置放入 input/ 后重新运行。");
    process.exit(1);
  }
  fs.mkdirSync(overrideDir, { recursive: true });

  const files = fs.readdirSync(inputDir)
    .filter(f => f.endsWith(".yaml") || f.endsWith(".yml"))
    .filter(f => !onlyName || f === `${onlyName}.yaml` || f === `${onlyName}.yml`);

  if (files.length === 0) {
    console.error(onlyName
      ? `❌  input/${onlyName}.yaml 不存在`
      : "❌  input/ 目录下没有 .yaml / .yml 文件");
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

      const groups = config["proxy-groups"] || [];
      console.log(`   分组: ${groups.length} 个  include-all: ${groups.filter(g => g["include-all"] || g["include-all-providers"]).length} 个`);

      const staticProxies = (config.proxies || []).filter(p => p && p.name);
      if (staticProxies.length > 0) {
        console.log(`   静态节点: ${staticProxies.map(p => p.name).join(", ")}`);
      }

      const providers = config["proxy-providers"] || {};
      const inlineCount = Object.values(providers).filter(v => v && v.type === "inline").length;
      const httpCount   = Object.values(providers).filter(v => v && v.type !== "inline").length;
      if (Object.keys(providers).length > 0) {
        console.log(`   proxy-providers: ${httpCount} 个保留 / ${inlineCount} 个 inline 跳过`);
      }

      const conditional = findConditionalRefs(groups, staticProxies);
      if (conditional.length > 0) {
        console.log(`   ⚠  条件性分组引用: ${conditional.join(", ")} → 已加入运行时防御`);
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
