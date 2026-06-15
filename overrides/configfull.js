/**
 * 覆写脚本 — configfull
 * 由 to-override.js 从 configfull.yaml 自动生成
 * 生成时间: 2026-06-15T07:14:36.440Z
 *
 * 兼容客户端:
 *   FlClash v0.8.85+  /  Mihomo Party  /  Clash Party
 *   Clash Verge Rev   /  Sparkle
 *
 * 覆写内容:
 *   ✔ proxy-groups    — 完整分组结构（include-all/filter 原样保留）
 *   ✔ proxy-providers — 自定义 provider
 *   ✔ rules           — 完整路由规则
 *   ✔ rule-providers  — 规则集定义
 *   ✔ dns / sniffer / tun / 其他非骨架字段
 *   ✔ 静态节点注入    — 🟢 直连
 *
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

  const STATIC_PROXIES = [
    {
        "name": "🟢 直连",
        "type": "direct",
        "udp": true
    }
];

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

  config["proxy-groups"] = [
    {
        "name": "节点选择",
        "type": "select",
        "proxies": [
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "故障转移"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/select.png"
    },
    {
        "name": "YouTube",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/youtube.png"
    },
    {
        "name": "FCM",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/fcm.png"
    },
    {
        "name": "GoogleVPN",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/googlevpn.png"
    },
    {
        "name": "Google",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/google.png"
    },
    {
        "name": "Meta",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/meta.png"
    },
    {
        "name": "AI",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/ai.png"
    },
    {
        "name": "GitHub",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/github.png"
    },
    {
        "name": "OneDrive",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/onedrive.png"
    },
    {
        "name": "Microsoft",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/microsoft.png"
    },
    {
        "name": "Telegram",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/telegram.png"
    },
    {
        "name": "Discord",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/discord.png"
    },
    {
        "name": "Talkatone",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/talkatone.png"
    },
    {
        "name": "LINE",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/line.png"
    },
    {
        "name": "Signal",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/signal.png"
    },
    {
        "name": "TikTok",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/tiktok.png"
    },
    {
        "name": "NETFLIX",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/netflix.png"
    },
    {
        "name": "DisneyPlus",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/disney.png"
    },
    {
        "name": "HBO",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/hbo.png"
    },
    {
        "name": "Primevideo",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/primevideo.png"
    },
    {
        "name": "AppleTV",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/appletv.png"
    },
    {
        "name": "Apple",
        "type": "select",
        "proxies": [
            "全球直连",
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/apple.png"
    },
    {
        "name": "Emby",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/emby.png"
    },
    {
        "name": "哔哩哔哩",
        "type": "select",
        "proxies": [
            "全球直连",
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/bilibili.png"
    },
    {
        "name": "哔哩东南亚",
        "type": "select",
        "proxies": [
            "节点选择",
            "新加坡节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/bilibilit.png"
    },
    {
        "name": "巴哈姆特",
        "type": "select",
        "proxies": [
            "台湾节点"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/bahamut.png"
    },
    {
        "name": "Spotify",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/spotify.png"
    },
    {
        "name": "国内媒体",
        "type": "select",
        "proxies": [
            "全球直连",
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/Chinese_media.png"
    },
    {
        "name": "Global-TV",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/global_tv.png"
    },
    {
        "name": "Global-Medial",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/global_media.png"
    },
    {
        "name": "游戏平台",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/game.png"
    },
    {
        "name": "Speedtest",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/speedtest.png"
    },
    {
        "name": "PayPal",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/paypal.png"
    },
    {
        "name": "Wise",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/wise.png"
    },
    {
        "name": "国外电商",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/shopping.png"
    },
    {
        "name": "STEAM",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/steam.png"
    },
    {
        "name": "全球直连",
        "type": "select",
        "proxies": [
            "🟢 直连",
            "🔗 代理",
            "全部节点"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/direct.png"
    },
    {
        "name": "隐私拦截",
        "type": "select",
        "proxies": [
            "🚫 拒绝",
            "⚪ 丢弃",
            "🟢 直连",
            "🔗 代理"
        ],
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/block.png"
    },
    {
        "name": "Final",
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/final.png"
    },
    {
        "name": "自建/家宽节点",
        "type": "select",
        "include-all": true,
        "filter": "(?=.*(?i)(自建|CF|The_house|private|home|家宽|hgc|HKT|HKBN|icable|Hinet|att))",
        "exclude-filter": "(?=.*(?i)(Seattle))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/private_node.png"
    },
    {
        "name": "香港节点",
        "type": "select",
        "proxies": [
            "香港自动",
            "香港均衡"
        ],
        "include-all": true,
        "filter": "(?=.*(?i)(港|hk|hongkong|Hong Kong|🇭🇰))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/Hongkong.png"
    },
    {
        "name": "新加坡节点",
        "type": "select",
        "proxies": [
            "新加坡自动",
            "新加坡均衡"
        ],
        "include-all": true,
        "filter": "(?=.*(?i)(新|🇸🇬|SG|singapore))",
        "exclude-filter": "(?=.*(?i)(新西兰))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/Singapore.png"
    },
    {
        "name": "日本节点",
        "type": "select",
        "proxies": [
            "日本自动",
            "日本均衡"
        ],
        "include-all": true,
        "filter": "(?=.*(?i)(日本|🇯🇵|JP|Japan))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/Japan.png"
    },
    {
        "name": "台湾节点",
        "type": "select",
        "proxies": [
            "台湾自动",
            "台湾均衡"
        ],
        "include-all": true,
        "filter": "(?=.*(?i)(台|🇹🇼|TW|Taiwan))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/Taiwan_China.png"
    },
    {
        "name": "美国节点",
        "type": "select",
        "proxies": [
            "美国自动",
            "美国均衡"
        ],
        "include-all": true,
        "filter": "(?=.*(?i)(美|🇺🇲|🇺🇸|US|America|United States|UnitedState|Los Angeles|Chicago|Ashburn|Seattle|Kansas))",
        "exclude-filter": "(?=.*(?i)(Australia|Russia|RUS))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/America.png"
    },
    {
        "name": "欧洲节点",
        "type": "select",
        "include-all": true,
        "filter": "(?=.*(?i)(🇦🇱|🇦🇩|🇦🇹|🇧🇾|🇧🇪|🇧🇦|🇧🇬|🇭🇷|🇨🇾|🇨🇿|🇩🇰|🇪🇪|🇫🇮|🇫🇷|🇩🇪|🇬🇷|🇭🇺|🇮🇸|🇮🇪|🇮🇹|🇽🇰|🇱🇻|🇱🇮|🇱🇹|🇱🇺|🇲🇹|🇲🇩|🇲🇨|🇲🇪|🇳🇱|🇲🇰|🇳🇴|🇵🇱|🇵🇹|🇷🇴|🇷🇺|🇸🇲|🇷🇸|🇸🇰|🇸🇮|🇪🇸|🇸🇪|🇨🇭|🇹🇷|🇺🇦|🇬🇧|🇻🇦))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/European.png"
    },
    {
        "name": "全部节点",
        "type": "select",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/all.png"
    },
    {
        "name": "香港自动",
        "type": "url-test",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "max-failed-times": 1,
        "hidden": true,
        "filter": "(?=.*(?i)(香港|hk|hongkong|Hong Kong|🇭🇰))",
        "exclude-filter": "(?=.*(?i)(The_HK_automation|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus))",
        "icon": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/icon/hk_automatic_selection.png"
    },
    {
        "name": "新加坡自动",
        "type": "url-test",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "max-failed-times": 1,
        "hidden": true,
        "filter": "(?=.*(?i)(新|🇸🇬|SG|Singapore))",
        "exclude-filter": "(?=.*(?i)(The_SG_automation|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus|新西兰))",
        "icon": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/icon/sg_automatic_selection.png"
    },
    {
        "name": "日本自动",
        "type": "url-test",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "max-failed-times": 1,
        "hidden": true,
        "filter": "(?=.*(?i)(日本|🇯🇵|JP|Japan))",
        "exclude-filter": "(?=.*(?i)(The_JP_automation|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus))",
        "icon": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/icon/jp_automatic_selection.png"
    },
    {
        "name": "台湾自动",
        "type": "url-test",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "max-failed-times": 1,
        "hidden": true,
        "filter": "(?=.*(?i)(台|🇹🇼|TW|Taiwan))",
        "exclude-filter": "(?=.*(?i)(The_TW_automation|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus))",
        "icon": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/icon/tw_automatic_selection.png"
    },
    {
        "name": "美国自动",
        "type": "url-test",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "max-failed-times": 1,
        "hidden": true,
        "filter": "(?=.*(?i)(美|🇺🇲|🇺🇸|US|America|United States|UnitedState|Los Angeles|Chicago|Ashburn|Seattle|Kansas))",
        "exclude-filter": "(?=.*(?i)(The_US_automation|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|russia|austria|plus|traffic|Australia|rus|aus))",
        "icon": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/icon/usa_automatic_selection.png"
    },
    {
        "name": "香港均衡",
        "type": "load-balance",
        "include-all": true,
        "strategy": "consistent-hashing",
        "hidden": true,
        "filter": "(?=.*(?i)(香港|hk|hongkong|Hong Kong|🇭🇰))",
        "exclude-filter": "(?=.*(?i)(The_HK_balance|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/load-balance.png"
    },
    {
        "name": "新加坡均衡",
        "type": "load-balance",
        "include-all": true,
        "strategy": "consistent-hashing",
        "hidden": true,
        "filter": "(?=.*(?i)(新|🇸🇬|SG|Singapore))",
        "exclude-filter": "(?=.*(?i)(The_SG_balance|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus|新西兰))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/load-balance.png"
    },
    {
        "name": "日本均衡",
        "type": "load-balance",
        "include-all": true,
        "strategy": "consistent-hashing",
        "hidden": true,
        "filter": "(?=.*(?i)(日本|🇯🇵|JP|Japan))",
        "exclude-filter": "(?=.*(?i)(The_JP_balance|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/load-balance.png"
    },
    {
        "name": "台湾均衡",
        "type": "load-balance",
        "include-all": true,
        "strategy": "consistent-hashing",
        "hidden": true,
        "filter": "(?=.*(?i)(台|🇹🇼|TW|Taiwan))",
        "exclude-filter": "(?=.*(?i)(The_TW_balance|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|traffic|plus))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/load-balance.png"
    },
    {
        "name": "美国均衡",
        "type": "load-balance",
        "include-all": true,
        "strategy": "consistent-hashing",
        "hidden": true,
        "filter": "(?=.*(?i)(美|🇺🇲|🇺🇸|US|America|United States|UnitedState|Ashburn|Kansas|Seattle))",
        "exclude-filter": "(?=.*(?i)(The_US_balance|wcloud|0倍|0\\.1倍|0\\.01倍|0\\.3X|0\\.2x|0\\.5x|3X|2x|1\\.5x|russia|austria|plus|traffic|Australia|rus|aus))",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/load-balance.png"
    },
    {
        "name": "🔗 代理",
        "type": "select",
        "hidden": true,
        "proxies": [
            "节点选择"
        ]
    },
    {
        "name": "🚫 拒绝",
        "type": "select",
        "hidden": true,
        "proxies": [
            "REJECT"
        ]
    },
    {
        "name": "⚪ 丢弃",
        "type": "select",
        "hidden": true,
        "proxies": [
            "REJECT-DROP"
        ]
    },
    {
        "name": "故障转移",
        "type": "fallback",
        "include-all": true,
        "interval": 300,
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/fallback.png"
    },
    {
        "name": "GLOBAL",
        "type": "select",
        "include-all": true,
        "proxies": [
            "节点选择",
            "YouTube",
            "GoogleVPN",
            "FCM",
            "Google",
            "Meta",
            "AI",
            "GitHub",
            "OneDrive",
            "Microsoft",
            "Telegram",
            "Discord",
            "Talkatone",
            "LINE",
            "Signal",
            "TikTok",
            "NETFLIX",
            "DisneyPlus",
            "HBO",
            "Primevideo",
            "AppleTV",
            "Apple",
            "Emby",
            "哔哩哔哩",
            "哔哩东南亚",
            "巴哈姆特",
            "Spotify",
            "国内媒体",
            "Global-TV",
            "Global-Medial",
            "游戏平台",
            "Speedtest",
            "PayPal",
            "Wise",
            "国外电商",
            "STEAM",
            "全球直连",
            "隐私拦截",
            "Final",
            "自建/家宽节点",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "香港自动",
            "新加坡自动",
            "日本自动",
            "台湾自动",
            "美国自动",
            "香港均衡",
            "新加坡均衡",
            "日本均衡",
            "台湾均衡",
            "美国均衡",
            "故障转移"
        ],
        "exclude-filter": "(?i)(🟢 直连)",
        "icon": "https://pub-8feead0908f649a8b94397f152fb9cba.r2.dev/global.png"
    }
];

  // ══════════════════════════════════════════════════════════════
  // § 3  覆写 proxy-providers（仅保留 http/file 类型）
  //      inline 类型已跳过（避免把订阅节点序列化进覆写文件）
  //      目标订阅自身的 providers 不受影响，会被合并保留
  // ══════════════════════════════════════════════════════════════

  const PROVIDERS = {
    "Airport_01": {
        "type": "http",
        "interval": 86400,
        "health-check": {
            "enable": true,
            "url": "https://www.gstatic.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(拒绝|直连|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|traffic))",
        "proxy": "故障转移",
        "url": "订阅链接1",
        "override": {
            "additional-prefix": "[机场名称1]",
            "skip-cert-verify": true,
            "udp": true
        }
    },
    "Airport_02": {
        "type": "http",
        "interval": 86400,
        "health-check": {
            "enable": true,
            "url": "https://www.gstatic.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(拒绝|直连|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|traffic))",
        "proxy": "故障转移",
        "url": "订阅链接2",
        "override": {
            "additional-prefix": "[机场名称2]",
            "skip-cert-verify": true,
            "udp": true
        }
    },
    "Airport_03": {
        "type": "http",
        "interval": 86400,
        "health-check": {
            "enable": true,
            "url": "https://www.gstatic.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(拒绝|直连|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|traffic))",
        "proxy": "故障转移",
        "url": "订阅链接3",
        "override": {
            "additional-prefix": "[机场名称3]",
            "skip-cert-verify": true,
            "udp": true
        }
    }
};
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

  const OVERRIDE = {
    "Proxy_first": {
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ]
    },
    "Direct_first": {
        "type": "select",
        "proxies": [
            "全球直连",
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点"
        ]
    },
    "Include_all": {
        "type": "select",
        "proxies": [
            "节点选择",
            "香港节点",
            "新加坡节点",
            "日本节点",
            "台湾节点",
            "美国节点",
            "欧洲节点",
            "全部节点",
            "自建/家宽节点",
            "全球直连"
        ],
        "include-all": true,
        "exclude-filter": "(?i)(🟢 直连)"
    },
    "Urltest_Base": {
        "type": "url-test",
        "include-all": true,
        "tolerance": 20,
        "interval": 300,
        "max-failed-times": 1,
        "hidden": true
    },
    "PProviders": {
        "type": "http",
        "interval": 86400,
        "health-check": {
            "enable": true,
            "url": "https://www.gstatic.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(拒绝|直连|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|traffic))"
    },
    "global-ua": "clash.meta",
    "unified-delay": true,
    "tcp-concurrent": true,
    "find-process-mode": "strict",
    "keep-alive-idle": 600,
    "keep-alive-interval": 30,
    "profile": {
        "store-selected": true,
        "store-fake-ip": false
    },
    "sniffer": {
        "enable": true,
        "sniff": {
            "HTTP": {
                "ports": [
                    80,
                    "8080-8880"
                ],
                "override-destination": true
            },
            "TLS": {
                "ports": [
                    443,
                    8443
                ]
            },
            "QUIC": {
                "ports": [
                    443,
                    8443
                ]
            }
        },
        "force-domain": [
            "*.v2ex.com"
        ],
        "skip-domain": [
            "Mijia Cloud",
            "dlg.io.mi.com",
            "*.push.apple.com",
            "*.apple.com",
            "*.wechat.com",
            "*.qpic.cn",
            "*.qq.com",
            "*.wechatapp.com",
            "*.vivox.com",
            "*.oray.com",
            "*.sunlogin.net"
        ]
    },
    "tun": {
        "enable": true,
        "stack": "gvisor",
        "mtu": 9000,
        "dns-hijack": [
            "any:53",
            "tcp://any:53"
        ],
        "auto-route": true,
        "auto-redirect": true,
        "auto-detect-interface": true
    },
    "dns": {
        "enable": true,
        "listen": "0.0.0.0:1053",
        "ipv6": true,
        "prefer-h3": false,
        "respect-rules": true,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "28.0.0.1/8",
        "fake-ip-range6": "2001:480:abcd::1/64",
        "fake-ip-filter-mode": "blacklist",
        "fake-ip-filter": [
            "rule-set:fakeip_filter_domain,game_cn_domain,bank_cn_domain,wechat_domain,ai_cn_domain,NetEaseMusic_domain,fcm_domain,alibaba_domain,media_cn_domain,xiaomi_domain,steam_cn_domain,pt_cn_domain,public-tracker_domain,115_domain,aliyun_domain,direct_domain,apple_cn_domain,apple_firmware_domain,iptv_domain,private_domain,cn_domain"
        ],
        "default-nameserver": [
            "119.29.29.29",
            "180.184.1.1"
        ],
        "proxy-server-nameserver": [
            "https://doh.pub/dns-query",
            "https://223.5.5.5/dns-query#h3=true"
        ],
        "direct-nameserver": [
            "https://doh.pub/dns-query",
            "https://223.5.5.5/dns-query#h3=true"
        ],
        "nameserver": [
            "https://dns.google/dns-query",
            "https://dns.cloudflare.com/dns-query"
        ]
    },
    "rules": [
        "RULE-SET,banAd_domain,隐私拦截",
        "RULE-SET,wechat_domain,全球直连",
        "RULE-SET,wechat_asn,全球直连,no-resolve",
        "RULE-SET,speedtest_domain,Speedtest",
        "RULE-SET,Cloudflare_domain,节点选择",
        "RULE-SET,Wise_domain,Wise",
        "RULE-SET,paypal_domain,PayPal",
        "RULE-SET,proxy_domain,节点选择",
        "RULE-SET,biliintl_domain,哔哩东南亚",
        "RULE-SET,bilibili_domain,哔哩哔哩",
        "RULE-SET,bilibili_ip,哔哩哔哩,no-resolve",
        "RULE-SET,bahamut_domain,巴哈姆特",
        "RULE-SET,bank_cn_domain,全球直连",
        "RULE-SET,ai_cn_domain,全球直连",
        "RULE-SET,direct_domain,全球直连",
        "RULE-SET,alibaba_domain,全球直连",
        "RULE-SET,115_domain,全球直连",
        "RULE-SET,aliyun_domain,全球直连",
        "RULE-SET,github_domain,GitHub",
        "RULE-SET,gitbook_domain,GitHub",
        "RULE-SET,googlevpn_domain,GoogleVPN",
        "RULE-SET,youtube_domain,YouTube",
        "RULE-SET,fcm_domain,FCM",
        "RULE-SET,google_domain,Google",
        "RULE-SET,google_asn_cn,Google,no-resolve",
        "RULE-SET,google_ip,Google,no-resolve",
        "RULE-SET,onedrive_domain,OneDrive",
        "RULE-SET,microsoft_domain,Microsoft",
        "RULE-SET,ai!cn_domain,AI",
        "RULE-SET,ai_domain,AI",
        "RULE-SET,openai_domain,AI",
        "RULE-SET,telegram_domain,Telegram",
        "RULE-SET,telegram_ip,Telegram,no-resolve",
        "RULE-SET,line_domain,LINE",
        "RULE-SET,talkatone_domain,Talkatone",
        "RULE-SET,talkatone_ip,Talkatone,no-resolve",
        "RULE-SET,discord_domain,Discord",
        "RULE-SET,discord_asn,Discord,no-resolve",
        "RULE-SET,signal_domain,Signal",
        "RULE-SET,tencent!cn_domain,节点选择",
        "RULE-SET,tencent_domain,全球直连",
        "RULE-SET,iptv_domain,全球直连",
        "RULE-SET,private_domain,全球直连",
        "DOMAIN-KEYWORD,hk.tv.global.mi.com,节点选择",
        "RULE-SET,xiaomi_domain,全球直连",
        "RULE-SET,steam_cn_domain,全球直连",
        "RULE-SET,steamcdn_domain,全球直连",
        "RULE-SET,steamcdn_ip,全球直连,no-resolve",
        "RULE-SET,NetEaseMusic_domain,全球直连",
        "RULE-SET,NetEaseMusic_ip,全球直连,no-resolve",
        "RULE-SET,pt_cn_domain,全球直连",
        "RULE-SET,public-tracker_domain,全球直连",
        "RULE-SET,media_cn_domain,国内媒体",
        "RULE-SET,appleTV_domain,AppleTV",
        "RULE-SET,apple_cn_domain,全球直连",
        "RULE-SET,apple_firmware_domain,Apple",
        "RULE-SET,apple_domain,Apple",
        "RULE-SET,tiktok_domain,TikTok",
        "RULE-SET,netflix_domain,NETFLIX",
        "RULE-SET,netflix_ip,NETFLIX,no-resolve",
        "RULE-SET,disney_domain,DisneyPlus",
        "RULE-SET,hbo_domain,HBO",
        "RULE-SET,primevideo_domain,Primevideo",
        "RULE-SET,emby_domain,Emby",
        "RULE-SET,emby_ip,Emby,no-resolve",
        "RULE-SET,spotify_domain,Spotify",
        "RULE-SET,facebook_domain,Meta",
        "RULE-SET,whatsapp_domain,Meta",
        "RULE-SET,instagram_domain,Meta",
        "RULE-SET,threads_domain,Meta",
        "RULE-SET,meta_domain,Meta",
        "RULE-SET,facebook_ip,Meta,no-resolve",
        "DOMAIN-SUFFIX,mytvsuper.com,Global-TV",
        "DOMAIN-SUFFIX,mytv.com.hk,Global-TV",
        "RULE-SET,twitch_domain,Global-TV",
        "RULE-SET,porn_domain,Global-TV",
        "RULE-SET,TVB_domain,Global-TV",
        "RULE-SET,media!cn_domain,Global-Medial",
        "RULE-SET,twitter_ip,节点选择,no-resolve",
        "RULE-SET,steam_domain,STEAM",
        "RULE-SET,Epic_domain,游戏平台",
        "RULE-SET,EA_domain,游戏平台",
        "RULE-SET,Blizzard_domain,游戏平台",
        "RULE-SET,UBI_domain,游戏平台",
        "RULE-SET,Sony_domain,游戏平台",
        "RULE-SET,Nintendo_domain,游戏平台",
        "RULE-SET,ifast_domain,全球直连",
        "RULE-SET,Amazon_domain,国外电商",
        "RULE-SET,Amazon_ip,国外电商,no-resolve",
        "RULE-SET,Shopee_domain,国外电商",
        "RULE-SET,Shopify_domain,国外电商",
        "RULE-SET,ebay_domain,国外电商",
        "RULE-SET,gfw_domain,节点选择",
        "RULE-SET,geolocation-!cn,节点选择",
        "RULE-SET,cn_domain,全球直连",
        "RULE-SET,private_ip,全球直连,no-resolve",
        "RULE-SET,cn_ip,全球直连,no-resolve",
        "MATCH,Final"
    ],
    "rule-anchor": {
        "ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs"
        },
        "ip_text": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "text"
        },
        "ip_yaml": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "yaml"
        },
        "domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs"
        },
        "domain_text": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "text"
        },
        "domain_yaml": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "yaml"
        },
        "class": {
            "type": "http",
            "interval": 86400,
            "behavior": "classical",
            "format": "text"
        },
        "class_yaml": {
            "type": "http",
            "interval": 86400,
            "behavior": "classical",
            "format": "yaml"
        }
    },
    "rule-providers": {
        "banAd_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/banAd_mini.mrs"
        },
        "private_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs"
        },
        "bank_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-bank-cn.mrs"
        },
        "xiaomi_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/xiaomi.mrs"
        },
        "biliintl_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/bilibili%40!cn.mrs"
        },
        "bilibili_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/bilibili.mrs"
        },
        "bahamut_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/bahamut.mrs"
        },
        "spotify_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/spotify.mrs"
        },
        "steam_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/steam%40cn.mrs"
        },
        "steamcdn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/Steam-domain.mrs"
        },
        "steam_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/steam.mrs"
        },
        "ai!cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-ai-!cn.mrs"
        },
        "openai_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/openai.mrs"
        },
        "youtube_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs"
        },
        "google_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/google.mrs"
        },
        "github_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs"
        },
        "telegram_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs"
        },
        "netflix_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs"
        },
        "paypal_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/paypal.mrs"
        },
        "onedrive_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/onedrive.mrs"
        },
        "microsoft_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs"
        },
        "apple_firmware_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/applefirmware.mrs"
        },
        "apple_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.mrs"
        },
        "speedtest_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/ookla-speedtest.mrs"
        },
        "tiktok_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs"
        },
        "gfw_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/gfw.mrs"
        },
        "geolocation-!cn": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs"
        },
        "cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs"
        },
        "media_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-media-cn.mrs"
        },
        "media!cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-social-media-!cn.mrs"
        },
        "Cloudflare_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/cloudflare.mrs"
        },
        "gitbook_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/gitbook.mrs"
        },
        "disney_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/disney.mrs"
        },
        "hbo_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/hbo.mrs"
        },
        "primevideo_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/primevideo.mrs"
        },
        "NetEaseMusic_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/NetEaseMusic-domain.mrs"
        },
        "Amazon_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/amazon.mrs"
        },
        "Shopee_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/shopee.mrs"
        },
        "ebay_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/ebay.mrs"
        },
        "appleTV_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/appletv.mrs"
        },
        "Epic_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/epicgames.mrs"
        },
        "EA_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/ea.mrs"
        },
        "Blizzard_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/blizzard.mrs"
        },
        "UBI_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/ubi.mrs"
        },
        "Sony_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/sony.mrs"
        },
        "Nintendo_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/nintendo.mrs"
        },
        "facebook_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/facebook.mrs"
        },
        "whatsapp_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/whatsapp.mrs"
        },
        "instagram_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/instagram.mrs"
        },
        "threads_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/threads.mrs"
        },
        "meta_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/meta.mrs"
        },
        "Wise_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/wise.mrs"
        },
        "ifast_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/ifast.mrs"
        },
        "line_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/line.mrs"
        },
        "talkatone_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/Talkatone-domain.mrs"
        },
        "Shopify_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/shopify.mrs"
        },
        "signal_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/signal.mrs"
        },
        "wechat_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/WeChat.mrs"
        },
        "proxy_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/proxy.mrs"
        },
        "direct_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/direct.mrs"
        },
        "apple_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/apple%40cn.mrs"
        },
        "alibaba_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/alibaba.mrs"
        },
        "tencent!cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/tencent%40!cn.mrs"
        },
        "tencent_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/tencent.mrs"
        },
        "ai_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-ai-cn.mrs"
        },
        "discord_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/discord.mrs"
        },
        "fcm_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/googlefcm.mrs"
        },
        "emby_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/emby.mrs"
        },
        "pt_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-pt.mrs"
        },
        "public-tracker_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-public-tracker.mrs"
        },
        "115_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/115.mrs"
        },
        "aliyun_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/aliyun.mrs"
        },
        "twitch_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/twitch.mrs"
        },
        "porn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-porn.mrs"
        },
        "iptv_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/iptv.mrs"
        },
        "googlevpn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/googleVPN.mrs"
        },
        "ai_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/ai.mrs"
        },
        "TVB_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/tvb.mrs"
        },
        "game_cn_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geosite/category-games%40cn.mrs"
        },
        "fakeip_filter_domain": {
            "type": "http",
            "interval": 86400,
            "behavior": "domain",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/Domain/fakeip-filter.mrs"
        },
        "bilibili_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo-lite/geoip/bilibili.mrs"
        },
        "cn_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs"
        },
        "google_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs"
        },
        "telegram_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs"
        },
        "netflix_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs"
        },
        "Amazon_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/amazon-ip.mrs"
        },
        "facebook_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/facebook.mrs"
        },
        "twitter_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/twitter.mrs"
        },
        "private_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/refs/heads/meta/geo/geoip/private.mrs"
        },
        "talkatone_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/Talkatone-ip.mrs"
        },
        "steamcdn_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/steamCDN-ip.mrs"
        },
        "NetEaseMusic_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/NetEaseMusic-ip.mrs"
        },
        "emby_ip": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/emby-ip.mrs"
        },
        "google_asn_cn": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/AS24424.mrs"
        },
        "discord_asn": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/AS49544.mrs"
        },
        "wechat_asn": {
            "type": "http",
            "interval": 86400,
            "behavior": "ipcidr",
            "format": "mrs",
            "url": "https://raw.githubusercontent.com/Lanlan13-14/Rules/refs/heads/main/rules/IP/AS132203.mrs"
        }
    }
};

  // tun.enable 强制 false：避免与客户端自身 TUN 管理冲突
  // 如需开启 TUN 请在客户端界面操作，或手动删除此行
  if (OVERRIDE.tun) OVERRIDE.tun.enable = false;

  Object.assign(config, OVERRIDE);

  return config;
}

if (typeof module !== "undefined") module.exports = main;
