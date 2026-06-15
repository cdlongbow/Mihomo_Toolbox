我需要为 GitHub 仓库创建一套 Mihomo 配置自动化工具，
包含两个完全独立、互不依赖的 GitHub Actions 工作流。
技术栈：Node.js 20 + js-yaml，手动触发（workflow_dispatch）。

═══════════════════════════════════════════════════════
工作流① ：覆写脚本 → 完整 Mihomo YAML
═══════════════════════════════════════════════════════

【输入】
仓库根目录的 sources.yaml，结构如下：
  scripts:
    - name: <输出文件名>
      type: js          # 或 yaml
      url: <raw链接>
      description: <描述>
  proxy_providers:
    - name: Airport-01
      type: http
      url: "YOUR_SUBSCRIPTION_URL_HERE"
      interval: 86400
      health-check: {enable: true, url: "...", interval: 300}
      override: {additional-prefix: "[A1]"}

【核心脚本 scripts/to-yaml.js】

① 读取 sources.yaml，按 --only <name> 参数过滤

② HTTP fetch 支持重定向，timeout 30s

③ 构建基础配置骨架 makeBaseConfig()，其中 proxies 注入
   24 个虚拟节点（SEED_PROXIES），覆盖以下地区，每地区
   2 个，节点名格式 "__seed__HK香港01"，
   type: socks5, server: 127.0.0.1：
   HK/US/JP/KR/SG/TW/GB/DE/MY/TR/CA/AU

④ type=js：用 Node.js vm 沙箱执行脚本，查找 main 函数，
   支持四种导出方式：
     module.exports / module.exports.main /
     exports.main / 全局 main

⑤ type=yaml：按 Mihomo Party patch 语义应用：
   key!  强制覆盖
   +key  前置
   key+  追加
   key   递归合并

⑥ 执行后做 postProcess()：

   a. 从 proxies 数组删除所有 SEED_NAMES（__seed__ 前缀）

   b. 扫描每个分组的 proxies 列表，判断是否含虚拟节点：
      - 含虚拟节点 → 替换为 include-all: true + filter 正则
      - 不含虚拟节点 → 原样保留

   c. include-all / include-all-providers 任一为 true 的
      分组，直接跳过（内核自动填充节点，无需处理）

   d. 地区 filter 推断：扫描分组内虚拟节点名，匹配
      REGION_FILTERS 数组，包含以下地区的关键词和 emoji：
      HK/US/JP/KR/SG/TW/GB/DE/MY/TR/CA/AU
      无法识别地区时：include-all: true，不加 filter

   e. 纯静态引用分组（proxies 全是其他分组名/DIRECT/
      REJECT/静态节点名）原样保留，不做改动

⑦ 确保 proxy-providers 不被脚本清空，否则从
   sources.yaml 补回

⑧ 输出调用 renderMihomoYaml() 渲染为格式化 YAML

【格式化渲染器 scripts/render-yaml.js】
纯手写，不 require js-yaml，实现以下格式：

1. 文件头注释块（名称/来源/说明/生成时间/警告）

2. 锚点配置区块（自动提取，非硬编码）：
   - BaseUT：从 type=url-test + include-all 分组提取
     公共属性（type/interval/lazy/url/hidden/
     tolerance/empty-fallback 等所有值相同的字段）
   - BaseFB：同上，针对 type=fallback
   - FilterHK/TW/JP/SG/KR/US/EU/CA/AU/DE/GB/FR/
     NL/MY/TR/OT/AL：从各地区 include-all 分组的
     filter 字段提取，按地区正则匹配分配锚点名
   - SelectAL/One/US/DC 等：从被 ≥2 个分组共用的
     proxies 列表提取

   格式：
     BaseUT: &BaseUT {type: url-test, ...}
     FilterHK: &FilterHK '<正则>'
     SelectAL: &SelectAL {type: select, proxies: [...]}

3. 代理提供者区块：
   proxy-providers:
     名称: {type: http, url: ..., interval: 86400,
             health-check: {...}, override: {...}}

4. 核心配置区块（有序字段）：
   mode/port/socks-port/redir-port/mixed-port/
   tproxy-port/ipv6/allow-lan/bind-address/
   unified-delay/tcp-concurrent/log-level/
   find-process-mode/keep-alive-interval/
   keep-alive-idle/global-ua 等
   子块：
     authentication / skip-auth-prefixes /
     experimental /
     管理面板注释组（external-ui-url/name/ui/
       controller/cors/secret） /
     GEO注释组（geodata-*/geox-url） /
     profile/hosts/ntp/listeners/tunnels

5. 流量嗅探区块（sniffer: 多行 block 格式）

6. TUN 模式区块（tun: 多行 block 格式）

7. DNS 配置区块（dns: 多行 block 格式）

8. 静态代理节点区块（proxies: flow 单行格式）：
   - {name: 直接连接, type: direct, udp: true}

9. 策略组区块（proxy-groups: 每项一行 flow 格式）：
   渲染逻辑：
   - name 始终第一
   - type 始终显式输出（第二位）
   - 若匹配 BaseUT/BaseFB 的所有字段值 → <<: *BaseUT
   - include-all: true 显式输出
   - filter 若在 filterToAnchor 映射中 → filter: *FilterHK
     否则 → filter: '<正则>'
   - proxies 若在 selectProxiesToAnchor 映射中
     且未使用 Base 锚点 → <<: *SelectAL
     否则 → proxies: [...]
   - 其余字段（icon/hidden/tolerance 等）追加末尾

10. 路由规则区块（rules: 每条一行）

11. 规则集区块：
    先输出行为锚点：
      BehaviorDN: &BehaviorDN {type: http, behavior: domain,
                                format: mrs, interval: 86400}
      BehaviorIP: &BehaviorIP {type: http, behavior: ipcidr,
                                format: mrs, interval: 86400}
    按 domain/ipcidr 分组，加注释：
      # ── 域名规则
      # ── IP 规则
    每项：
      名称: {<<: *BehaviorDN, url: '...'}

12. 末尾：# ==================== EOF ====================

分区标题格式：\n# ==================== 标题 ====================\n
区块之间有空行分隔。

【工作流文件 .github/workflows/to-yaml.yml】
- name: "① 覆写脚本 → 完整 Mihomo YAML"
- on: workflow_dispatch，input: only（可选，留空处理全部）
- permissions: contents: write
- steps:
    checkout →
    setup-node 20（不加 cache）→
    npm install →
    node scripts/to-yaml.js [--only $only] →
    git add output/ →
    有变化则 commit + push

【输出】output/<name>.yaml

═══════════════════════════════════════════════════════
工作流② ：完整 YAML → 通用覆写 JS
═══════════════════════════════════════════════════════

【输入】input/<name>.yaml（用户手动放入的完整 Mihomo 配置）

支持以下配置风格（需全部兼容）：
  ① 标准 include-all + filter（如 666OS/YYDS）
  ② include-all-providers + filter（如 echs-top 原版）
  ③ 纯分组引用型（如 Ayanami0）
  ④ 含条件性分组（如 YaNet 的"其他节点"）

注意：常量格式（const overrideConfig = {...}，无 main 函数）
不是合法的覆写脚本，不能放入 sources.yaml 的工作流①，
需手动提取为 YAML 放入 input/ 后用工作流②处理。

【核心脚本 scripts/to-override.js】

① 读取 input/*.yaml（支持 .yml），按 --only 过滤

② 提取静态节点（staticProxies）：
   config.proxies 中有 name 的条目
   （如 直连/拒绝/IPV4优先/DNS劫持 等，
   订阅里没有这些节点，需在覆写脚本里注入）

③ 提取 proxy-groups（原样，不做任何变换）

④ proxy-providers 按类型处理：
   - type: inline → 跳过
     原因：inline provider 的 payload 包含所有订阅节点，
     序列化进覆写 JS 会导致体积爆炸，且会把源配置
     节点强行覆盖目标订阅；分组里的 include-all-providers
     会自动使用目标订阅的 provider，无需在覆写里重新定义
   - type: http / file → 保留并写入覆写文件

⑤ 提取 overrideFields，跳过以下 SKIP_KEYS：
   mixed-port / port / socks-port / redir-port /
   tproxy-port / allow-lan / bind-address / mode /
   log-level / ipv6 / external-controller / external-ui /
   external-ui-url / external-ui-name /
   external-controller-cors / secret / geodata-mode /
   geodata-loader / geo-auto-update / geo-update-interval /
   geox-url / authentication / skip-auth-prefixes
   同时跳过：proxies / proxy-groups / proxy-providers

⑥ overrideFields.tun.enable 强制 false

⑦ findConditionalRefs(groups, staticProxies) 检测条件性分组：

   算法：
   a. 构建 knownNames = groupNames ∪ builtins ∪ staticNames
      builtins = {DIRECT, REJECT, REJECT-DROP, PASS, PASS-RULE}

   b. 过滤出"引用型分组"：
      - 无 include-all 且无 include-all-providers
      - proxies 非空
      - proxies 里至少有一项在 knownNames 里
        （有已知名字 = 这是策略选项列表，不是节点列表）

   c. 从引用型分组的全部 proxies 里，找出不在
      groupNames / builtins / staticNames 里的条目
      → 这些就是"条件性分组引用"（运行时可能不存在）

   典型案例：YaNet 的"其他节点"分组只在订阅有冷门节点时
   才生成，但"默认节点"的 proxies 里引用了它；
   当订阅无冷门节点时，"其他节点"不存在但被引用 → loop

⑧ 生成 overrides/<name>.js，结构如下：

```javascript
/**
 * 覆写脚本注释（名称/生成时间/兼容客户端/覆写内容/
 * 不覆写字段/条件性分组说明）
 */
function main(config) {

  // § 1  注入静态节点
  //      源配置 proxies: 里的手动节点（直连/拒绝/IPV4优先等）
  //      目标订阅里没有这些节点，必须注入，否则分组引用会悬空
  const STATIC_PROXIES = [...];
  if (STATIC_PROXIES.length > 0) {
    config.proxies = config.proxies || [];
    const existingNames = new Set(config.proxies.map(p => p.name));
    for (const p of STATIC_PROXIES) {
      if (!existingNames.has(p.name)) config.proxies.push(p);
    }
  }

  // § 2  覆写 proxy-groups（原样替换）
  //      include-all / include-all-providers / filter 由
  //      Mihomo 内核运行时从订阅的 proxy-providers 自动填充节点
  config["proxy-groups"] = [...];

  // § 2.5  条件性分组防御（仅在检测到条件性引用时生成）
  //        运行时检测被引用的分组是否存在，不存在则从
  //        proxies 引用列表中移除，防止 loop
  const CONDITIONAL_REFS = [...];
  if (CONDITIONAL_REFS.length > 0) {
    const existingGroupNames = new Set(
      config["proxy-groups"].map(g => g.name)
    );
    const missingRefs = new Set(
      CONDITIONAL_REFS.filter(r => !existingGroupNames.has(r))
    );
    if (missingRefs.size > 0) {
      config["proxy-groups"] = config["proxy-groups"].map(group => {
        if (!Array.isArray(group.proxies)) return group;
        return {
          ...group,
          proxies: group.proxies.filter(p => !missingRefs.has(p))
        };
      });
    }
  }

  // § 3  覆写 proxy-providers（仅 http/file 类型，跳过 inline）
  //      用 Object.assign 合并：保留目标订阅原有 provider，
  //      追加/覆盖自定义 provider
  const PROVIDERS = {...};
  if (Object.keys(PROVIDERS).length > 0) {
    config["proxy-providers"] = Object.assign(
      {},
      config["proxy-providers"] || {},
      PROVIDERS
    );
  }

  // § 4  覆写其余字段（dns/rules/rule-providers/sniffer 等）
  //      tun.enable 强制 false
  const OVERRIDE = {...};
  if (OVERRIDE.tun) OVERRIDE.tun.enable = false;
  Object.assign(config, OVERRIDE);

  return config;
}

if (typeof module !== "undefined") module.exports = main;
```

【兼容性说明注释内容】
FlClash v0.8.85+ / Mihomo Party / Clash Party /
Clash Verge Rev / Sparkle
（v0.8.85+ 后 FlClash 与其他客户端格式完全相同）

【工作流文件 .github/workflows/to-override.yml】
- name: "② 完整 YAML → 覆写 JS"
- on: workflow_dispatch，input: only（可选）
- permissions: contents: write
- steps:
    checkout →
    setup-node 20 →
    npm install →
    node scripts/to-override.js [--only $only] →
    git add overrides/ →
    有变化则 commit + push

【输出】overrides/<name>.js

═══════════════════════════════════════════════════════
仓库文件结构
═══════════════════════════════════════════════════════

根目录：
  sources.yaml          ← 工作流①唯一配置
  package.json          ← 依赖仅 js-yaml ^4.1.0
  input/                ← 工作流②输入（手动放置）
  output/               ← 工作流①输出
  overrides/            ← 工作流②输出
  scripts/
    to-yaml.js          ← 工作流①核心
    to-override.js      ← 工作流②核心
    render-yaml.js      ← 格式化渲染器（to-yaml.js 依赖）
  .github/workflows/
    to-yaml.yml
    to-override.yml

═══════════════════════════════════════════════════════
关键约束
═══════════════════════════════════════════════════════

1. 两个工作流完全独立，不互相依赖，不共享状态

2. npm install（不用 npm ci，避免缺少 lock 文件报错）

3. render-yaml.js 不 require js-yaml，纯手写序列化

4. 工作流② include-all / include-all-providers 任一为 true
   的分组原样保留，不做任何节点动态处理，从根本上
   避免 loop 报错

5. 静态节点（直连/拒绝/IPV4优先/DNS劫持 等）必须在
   覆写脚本 § 1 注入，防止分组引用悬空

6. tun.enable 在覆写 JS 中强制 false，避免与客户端冲突

7. proxy-providers 的 type: inline 必须跳过，不得序列化
   进覆写文件；type: http/file 保留，用 Object.assign
   合并而非覆盖，保留目标订阅原有 provider

8. findConditionalRefs 必须同时排除：
   - 内置关键字（DIRECT/REJECT/REJECT-DROP/PASS/PASS-RULE）
   - 静态节点名（来自 config.proxies）
   - 已存在的分组名
   引用型分组判定条件：proxies 里至少有一项是已知名字
   （避免把含真实节点名的"节点型分组"误判为引用型分组）

9. 格式化渲染器自动提取锚点，不硬编码，适配任意输入

10. git commit 步骤先检查 diff，无变化则跳过，避免空提交

11. 常量格式脚本（const overrideConfig = {...}）不兼容
    工作流①，需手动转为 YAML 放入 input/ 用工作流②处理

═══════════════════════════════════════════════════════
已知 BUG 修复记录（供验证参考）
═══════════════════════════════════════════════════════

BUG-1  proxy-providers 无条件全部跳过
  现象：echs-top inline provider 被跳过后分组无节点
  修复：按 type 区分，inline 跳过，http/file 保留

BUG-2  findConditionalRefs 误判静态节点名
  现象："直连"/"拒绝" 不在 groupNames 里被误判为条件性引用
  修复：加入 staticNames 白名单

BUG-3  findConditionalRefs 跳过含真实节点的引用型分组
  现象："默认节点" proxies 含"其他节点"（分组引用）和
         "直连"（静态节点），同时"其他节点"分组的 proxies
         含真实节点名；旧算法把"默认节点"判定为节点型
         分组跳过，导致漏检"其他节点"的条件性引用
  修复：改判定条件为"proxies 里至少有一项在 knownNames 里"
         而非"proxies 全部在 knownNames 里"

BUG-4  工作流① postProcess 不识别 include-all-providers
  现象：echs-top 风格的分组被误处理
  修复：检查条件改为：
         group["include-all"] === true ||
         group["include-all-providers"] === true

BUG-5  npm ci 报错缺少 lock 文件
  现象：Actions 里 npm ci 需要 package-lock.json
  修复：改用 npm install

BUG-6  地区分组缺失（YaNet/sing-mix 等动态建组脚本）
  现象：base.proxies 为空时脚本地区匹配失败，生成的
         YAML 缺少 HK香港/US美国 等分组，也没有 include-all
  修复：注入 24 个带地区关键词的虚拟节点（SEED_PROXIES），
         执行后 postProcess 替换为 include-all + filter
