/**
 * 覆写脚本 — MihomoProPlus
 * 由 to-override.js 从 MihomoProPlus.yaml 自动生成
 * 生成时间: 2026-06-15T07:14:36.428Z
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
 *   ✔ 静态节点注入    — 无
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

  const STATIC_PROXIES = [];

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
        "name": "默认代理",
        "type": "select",
        "proxies": [
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Static.png"
    },
    {
        "name": "故障转移",
        "type": "fallback",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "proxies": [
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "全球手动",
            "冷门自选",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/ULB.png"
    },
    {
        "name": "国外流量",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Global.png"
    },
    {
        "name": "国内流量",
        "type": "select",
        "proxies": [
            "直接连接",
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/China.png"
    },
    {
        "name": "兜底流量",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Final.png"
    },
    {
        "name": "直接连接",
        "type": "select",
        "proxies": [
            "DIRECT"
        ],
        "hidden": true,
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Direct.png"
    },
    {
        "name": "网络测试",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "include-all": true,
        "filter": "^(?!.*(DIRECT|直接连接|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Speedtest.png"
    },
    {
        "name": "UKwifi",
        "type": "select",
        "proxies": [
            "DIRECT",
            "欧盟策略"
        ],
        "icon": "https://www.giffgaff.design/iconography/icons/library/coverage-signal.svg"
    },
    {
        "name": "抖快书定位",
        "type": "select",
        "proxies": [
            "直接连接",
            "香港策略",
            "台湾策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "欧盟策略"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Null_Nation.png"
    },
    {
        "name": "Emby服",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Emby.png"
    },
    {
        "name": "油管视频",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/YouTube.png"
    },
    {
        "name": "奈飞视频",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Netflix.png"
    },
    {
        "name": "国际媒体",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/DomesticMedia.png"
    },
    {
        "name": "新闻媒体",
        "type": "select",
        "proxies": [
            "美国策略",
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple_News.png"
    },
    {
        "name": "电报消息",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Telegram_X.png"
    },
    {
        "name": "推特社交",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/X.png"
    },
    {
        "name": "社交平台",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/PBS.png"
    },
    {
        "name": "人工智能",
        "type": "select",
        "proxies": [
            "美国策略",
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/AI.png"
    },
    {
        "name": "货币平台",
        "type": "select",
        "proxies": [
            "狮城策略",
            "默认代理",
            "故障转移",
            "香港策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://raw.githubusercontent.com/Orz-3/mini/master/Alpha/Bitcloud.png"
    },
    {
        "name": "游戏平台",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Game.png"
    },
    {
        "name": "Github",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://raw.githubusercontent.com/lige47/QuanX-icon-rule/main/icon/04ProxySoft/github(1).png"
    },
    {
        "name": "微软服务",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Microsoft.png"
    },
    {
        "name": "谷歌服务",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Google_Search.png"
    },
    {
        "name": "苹果服务",
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ],
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Apple.png"
    },
    {
        "name": "香港策略",
        "type": "select",
        "proxies": [
            "香港自动",
            "香港均衡-散列",
            "香港均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Hong_Kong.png"
    },
    {
        "name": "台湾策略",
        "type": "select",
        "proxies": [
            "台湾自动",
            "台湾均衡-散列",
            "台湾均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Taiwan.png"
    },
    {
        "name": "狮城策略",
        "type": "select",
        "proxies": [
            "狮城自动",
            "狮城均衡-散列",
            "狮城均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Singapore.png"
    },
    {
        "name": "日本策略",
        "type": "select",
        "proxies": [
            "日本自动",
            "日本均衡-散列",
            "日本均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(尼日利亚|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Japan.png"
    },
    {
        "name": "韩国策略",
        "type": "select",
        "proxies": [
            "韩国自动",
            "韩国均衡-散列",
            "韩国均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Korea.png"
    },
    {
        "name": "美国策略",
        "type": "select",
        "proxies": [
            "美国自动",
            "美国均衡-散列",
            "美国均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(美|🇺🇸|US|USA|JFK|SJC|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(Plus|Australia|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/United_States.png"
    },
    {
        "name": "欧盟策略",
        "type": "select",
        "proxies": [
            "欧盟自动",
            "欧盟均衡-散列",
            "欧盟均衡-轮询"
        ],
        "include-all": true,
        "filter": "^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/European_Union.png"
    },
    {
        "name": "冷门自选",
        "type": "select",
        "include-all": true,
        "filter": "^(?!.*(DIRECT|直接连接|美|港|坡|台|新|日|韩|奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇭🇰|🇼🇸|🇹🇼|🇸🇬|🇯🇵|🇰🇷|🇺🇸|🇬🇧|🇦🇹|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|HK|TW|SG|JP|KR|US|GB|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU|HKG|TPE|TSA|KHH|SIN|XSP|NRT|HND|KIX|CTS|FUK|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD|LHR|LGW))",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Europe_Map.png"
    },
    {
        "name": "全球手动",
        "type": "select",
        "include-all": true,
        "filter": "^(?!.*(DIRECT|直接连接|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Clubhouse.png"
    },
    {
        "name": "香港自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "台湾自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "狮城自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "日本自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(尼日利亚|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "韩国自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "美国自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(美|🇺🇸|US|USA|JFK|SJC|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(Plus|Australia|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "欧盟自动",
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Auto.png"
    },
    {
        "name": "香港均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "台湾均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "狮城均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "日本均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(尼日利亚|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "韩国均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "美国均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(美|🇺🇸|US|USA|JFK|SJC|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(Plus|Australia|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "欧盟均衡-散列",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin_1.png"
    },
    {
        "name": "香港均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    },
    {
        "name": "台湾均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    },
    {
        "name": "狮城均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    },
    {
        "name": "日本均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(尼日利亚|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    },
    {
        "name": "韩国均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    },
    {
        "name": "美国均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(美|🇺🇸|US|USA|JFK|SJC|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(Plus|Australia|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    },
    {
        "name": "欧盟均衡-轮询",
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true,
        "include-all": true,
        "filter": "^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU))(?!.*(排除1|排除2|5x)).*$",
        "icon": "https://github.com/Koolson/Qure/raw/master/IconSet/Color/Round_Robin.png"
    }
];

  // ══════════════════════════════════════════════════════════════
  // § 3  覆写 proxy-providers（仅保留 http/file 类型）
  //      inline 类型已跳过（避免把订阅节点序列化进覆写文件）
  //      目标订阅自身的 providers 不受影响，会被合并保留
  // ══════════════════════════════════════════════════════════════

  const PROVIDERS = {
    "优质服务商": {
        "type": "http",
        "interval": 86400,
        "proxy": "DIRECT",
        "health-check": {
            "enable": true,
            "url": "https://www.google.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))",
        "url": "优质订阅源地址",
        "override": {
            "additional-prefix": "[优] "
        }
    },
    "备用服务商": {
        "type": "http",
        "interval": 86400,
        "proxy": "DIRECT",
        "health-check": {
            "enable": true,
            "url": "https://www.google.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))",
        "url": "备用订阅源地址",
        "override": {
            "additional-prefix": "[备] "
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
    "BaseProvider": {
        "type": "http",
        "interval": 86400,
        "proxy": "DIRECT",
        "health-check": {
            "enable": true,
            "url": "https://www.google.com/generate_204",
            "interval": 300
        },
        "filter": "^(?!.*(群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))"
    },
    "BaseFB": {
        "type": "fallback",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204"
    },
    "BaseCH": {
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "consistent-hashing",
        "hidden": true
    },
    "BaseCR": {
        "type": "load-balance",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "strategy": "round-robin",
        "hidden": true
    },
    "BaseUT": {
        "type": "url-test",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true
    },
    "BaseSmart": {
        "type": "smart",
        "interval": 200,
        "lazy": true,
        "url": "https://www.google.com/generate_204",
        "hidden": true,
        "uselightgbm": true
    },
    "FilterHK": "^(?=.*(?i)(港|🇭🇰|HK|Hong|HKG))(?!.*(排除1|排除2|5x)).*$",
    "FilterSG": "^(?=.*(?i)(坡|🇸🇬|SG|Sing|SIN|XSP))(?!.*(排除1|排除2|5x)).*$",
    "FilterJP": "^(?=.*(?i)(日|🇯🇵|JP|Japan|NRT|HND|KIX|CTS|FUK))(?!.*(尼日利亚|排除2|5x)).*$",
    "FilterKR": "^(?=.*(?i)(韩|🇰🇷|韓|首尔|南朝鲜|KR|KOR|Korea|South))(?!.*(排除1|排除2|5x)).*$",
    "FilterUS": "^(?=.*(?i)(美|🇺🇸|US|USA|JFK|SJC|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD))(?!.*(Plus|Australia|5x)).*$",
    "FilterTW": "^(?=.*(?i)(台|🇼🇸|🇹🇼|TW|tai|TPE|TSA|KHH))(?!.*(排除1|排除2|5x)).*$",
    "FilterUK": "^(?=.*(?i)(英|英国|UK|伦敦|大不列颠|Kingdom))(?!.*(排除1|排除2|5x)).*$",
    "FilterEU": "^(?=.*(?i)(奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|🇬🇧|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU))(?!.*(排除1|排除2|5x)).*$",
    "FilterOT": "^(?!.*(DIRECT|直接连接|美|港|坡|台|新|日|韩|奥|比|保|克罗地亚|塞|捷|丹|爱沙|芬|法|德|希|匈|爱尔|意|拉|立|卢|马其它|荷|波|葡|罗|斯洛伐|斯洛文|西|瑞|英|🇭🇰|🇼🇸|🇹🇼|🇸🇬|🇯🇵|🇰🇷|🇺🇸|🇬🇧|🇦🇹|🇧🇪|🇨🇿|🇩🇰|🇫🇮|🇫🇷|🇩🇪|🇮🇪|🇮🇹|🇱🇹|🇱🇺|🇳🇱|🇵🇱|🇸🇪|HK|TW|SG|JP|KR|US|GB|CDG|FRA|AMS|MAD|BCN|FCO|MUC|BRU|HKG|TPE|TSA|KHH|SIN|XSP|NRT|HND|KIX|CTS|FUK|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD|LHR|LGW))",
    "FilterAL": "^(?!.*(DIRECT|直接连接|群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author))",
    "SelectFB": {
        "type": "select",
        "proxies": [
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ]
    },
    "SelectPY": {
        "type": "select",
        "proxies": [
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ]
    },
    "SelectDC": {
        "type": "select",
        "proxies": [
            "直接连接",
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动"
        ]
    },
    "SelectHK": {
        "type": "select",
        "proxies": [
            "香港策略",
            "默认代理",
            "故障转移",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ]
    },
    "SelectSG": {
        "type": "select",
        "proxies": [
            "狮城策略",
            "默认代理",
            "故障转移",
            "香港策略",
            "日本策略",
            "韩国策略",
            "美国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ]
    },
    "SelectUS": {
        "type": "select",
        "proxies": [
            "美国策略",
            "默认代理",
            "故障转移",
            "香港策略",
            "狮城策略",
            "日本策略",
            "韩国策略",
            "台湾策略",
            "欧盟策略",
            "冷门自选",
            "全球手动",
            "直接连接"
        ]
    },
    "listeners": [
        {
            "name": "SS-IN",
            "type": "shadowsocks",
            "listen": "::",
            "port": 10000,
            "udp": true,
            "password": "Xf3#Lp9WqZ",
            "cipher": "aes-256-gcm"
        },
        {
            "name": "MIXED-SG",
            "type": "mixed",
            "port": 50000,
            "proxy": "狮城策略"
        },
        {
            "name": "MIXED-US",
            "type": "mixed",
            "port": 50001,
            "proxy": "美国策略"
        },
        {
            "name": "MIXED-TW",
            "type": "mixed",
            "port": 50002,
            "proxy": "台湾策略"
        },
        {
            "name": "MIXED-HK",
            "type": "mixed",
            "port": 50003,
            "proxy": "香港策略"
        },
        {
            "name": "MIXED-JP",
            "type": "mixed",
            "port": 50004,
            "proxy": "日本策略"
        },
        {
            "name": "MIXED-KR",
            "type": "mixed",
            "port": 50005,
            "proxy": "韩国策略"
        },
        {
            "name": "MIXED-EU",
            "type": "mixed",
            "port": 50006,
            "proxy": "欧盟策略"
        },
        {
            "name": "MIXED-AL",
            "type": "mixed",
            "port": 50007,
            "proxy": "默认代理"
        }
    ],
    "unified-delay": true,
    "tcp-concurrent": true,
    "find-process-mode": "always",
    "keep-alive-interval": 15,
    "keep-alive-idle": 600,
    "experimental": {
        "quic-go-disable-gso": true
    },
    "profile": {
        "store-selected": true,
        "store-fake-ip": true
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
        "skip-domain": [
            "Mijia Cloud",
            "+.push.apple.com"
        ]
    },
    "tun": {
        "enable": false,
        "stack": "mixed",
        "dns-hijack": [
            "any:53",
            "tcp://any:53"
        ],
        "auto-route": true,
        "auto-redirect": true,
        "auto-detect-interface": true
    },
    "hosts": {
        "miwifi.com": "192.168.31.2",
        "epdg.epc.mnc010.mcc234.pub.3gppnetwork.org": [
            "87.194.8.8",
            "87.194.88.8",
            "87.194.89.8",
            "87.194.9.8"
        ],
        "services.googleapis.cn": "services.googleapis.com",
        "cn.bing.com": "www4.bing.com"
    },
    "dns": {
        "enable": true,
        "ipv6": true,
        "enhanced-mode": "fake-ip",
        "fake-ip-range": "198.18.0.1/16",
        "fake-ip-filter": [
            "+.lan",
            "+.local",
            "time.*.com",
            "ntp.*.com",
            "+.market.xiaomi.com",
            "+.pub.3gppnetwork.org",
            "+.push.apple.com",
            "+.bing.com",
            "rule-set:Direct",
            "rule-set:Private",
            "rule-set:China"
        ],
        "use-hosts": true,
        "respect-rules": true,
        "default-nameserver": [
            "tls://223.5.5.5",
            "tls://223.6.6.6"
        ],
        "nameserver": [
            "https://cloudflare-dns.com/dns-query",
            "https://dns.google/dns-query"
        ],
        "direct-nameserver": [
            "https://dns.alidns.com/dns-query",
            "https://doh.pub/dns-query"
        ],
        "proxy-server-nameserver": [
            "https://dns.alidns.com/dns-query",
            "https://doh.pub/dns-query"
        ],
        "nameserver-policy": {
            "rule-set:Advertising,AWAvenueAds": "rcode://success",
            "rule-set:Direct,Private,China": [
                "https://dns.alidns.com/dns-query",
                "https://doh.pub/dns-query"
            ],
            "rule-set:Speedtest,Twitter,Telegram,SocialMedia,NewsMedia,Games,Crypto,Emby,Netflix,YouTube,Streaming,Apple,Google,Microsoft,Proxy": [
                "https://dns.google/dns-query",
                "https://cloudflare-dns.com/dns-query"
            ]
        }
    },
    "rules": [
        "RULE-SET,Tracking,REJECT",
        "RULE-SET,AWAvenueAds,REJECT",
        "RULE-SET,Advertising,REJECT",
        "AND,((DST-PORT,443),(NETWORK,UDP)),REJECT",
        "RULE-SET,ukwifi,UKwifi",
        "RULE-SET,LocationDKS,抖快书定位",
        "RULE-SET,Private,直接连接",
        "RULE-SET,Direct,直接连接",
        "RULE-SET,XPTV,直接连接",
        "RULE-SET,Download,直接连接",
        "RULE-SET,AppleCN,直接连接",
        "RULE-SET,AI,人工智能",
        "DOMAIN-KEYWORD,speedtest,网络测试",
        "RULE-SET,Speedtest,网络测试",
        "RULE-SET,Twitter,推特社交",
        "RULE-SET,Telegram,电报消息",
        "RULE-SET,SocialMedia,社交平台",
        "RULE-SET,NewsMedia,新闻媒体",
        "DOMAIN-SUFFIX,steamserver.net,DIRECT",
        "RULE-SET,Games,游戏平台",
        "RULE-SET,Crypto,货币平台",
        "RULE-SET,Emby,Emby服",
        "RULE-SET,Netflix,奈飞视频",
        "RULE-SET,YouTube,油管视频",
        "RULE-SET,Streaming,国际媒体",
        "RULE-SET,Apple,苹果服务",
        "RULE-SET,Google,谷歌服务",
        "RULE-SET,github,Github",
        "RULE-SET,Microsoft,微软服务",
        "RULE-SET,Proxy,国外流量",
        "RULE-SET,China,国内流量",
        "RULE-SET,AdvertisingIP,REJECT,no-resolve",
        "RULE-SET,PrivateIP,直接连接,no-resolve",
        "RULE-SET,XPTVIP,直接连接,no-resolve",
        "RULE-SET,AIIP,人工智能,no-resolve",
        "RULE-SET,TelegramIP,电报消息,no-resolve",
        "RULE-SET,SocialMediaIP,社交平台,no-resolve",
        "RULE-SET,EmbyIP,Emby服,no-resolve",
        "RULE-SET,NetflixIP,奈飞视频,no-resolve",
        "RULE-SET,StreamingIP,国际媒体,no-resolve",
        "RULE-SET,GoogleIP,谷歌服务,no-resolve",
        "RULE-SET,ProxyIP,国外流量,no-resolve",
        "RULE-SET,ChinaIP,国内流量",
        "MATCH,兜底流量"
    ],
    "BehaviorDN": {
        "type": "http",
        "behavior": "domain",
        "format": "mrs",
        "interval": 86400
    },
    "BehaviorDY": {
        "type": "http",
        "behavior": "domain",
        "format": "yaml",
        "interval": 86400
    },
    "BehaviorIP": {
        "type": "http",
        "behavior": "ipcidr",
        "format": "mrs",
        "interval": 86400
    },
    "ClassicalText": {
        "type": "http",
        "interval": 86400,
        "behavior": "classical",
        "format": "text"
    },
    "ClassicalYaml": {
        "type": "http",
        "behavior": "classical",
        "interval": 3600,
        "format": "yaml",
        "proxy": "DIRECT"
    },
    "rule-providers": {
        "Tracking": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Tracking.mrs"
        },
        "Advertising": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Advertising.mrs"
        },
        "Direct": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Direct.mrs"
        },
        "LocationDKS": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/LocationDKS.mrs"
        },
        "Private": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Private.mrs"
        },
        "Download": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Download.mrs"
        },
        "Speedtest": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Speedtest.mrs"
        },
        "AI": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/AI.mrs"
        },
        "Telegram": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Telegram.mrs"
        },
        "Twitter": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Twitter.mrs"
        },
        "SocialMedia": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/SocialMedia.mrs"
        },
        "NewsMedia": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/NewsMedia.mrs"
        },
        "Games": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Games.mrs"
        },
        "Crypto": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Crypto.mrs"
        },
        "Netflix": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Netflix.mrs"
        },
        "YouTube": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/YouTube.mrs"
        },
        "XPTV": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/XPTV.mrs"
        },
        "Emby": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Emby.mrs"
        },
        "Streaming": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Streaming.mrs"
        },
        "AppleCN": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/AppleCN.mrs"
        },
        "Apple": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Apple.mrs"
        },
        "Google": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Google.mrs"
        },
        "Microsoft": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Microsoft.mrs"
        },
        "Facebook": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Facebook.mrs"
        },
        "Proxy": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/Proxy.mrs"
        },
        "China": {
            "type": "http",
            "behavior": "domain",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/domain/China.mrs"
        },
        "AdvertisingIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Advertising.mrs"
        },
        "PrivateIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Private.mrs"
        },
        "AIIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/AI.mrs"
        },
        "TelegramIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Telegram.mrs"
        },
        "SocialMediaIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/SocialMedia.mrs"
        },
        "XPTVIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/XPTV.mrs"
        },
        "EmbyIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Emby.mrs"
        },
        "NetflixIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Netflix.mrs"
        },
        "StreamingIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Streaming.mrs"
        },
        "GoogleIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Google.mrs"
        },
        "FacebookIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Facebook.mrs"
        },
        "ProxyIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/Proxy.mrs"
        },
        "ChinaIP": {
            "type": "http",
            "behavior": "ipcidr",
            "format": "mrs",
            "interval": 86400,
            "url": "https://github.com/666OS/rules/raw/release/mihomo/ip/China.mrs"
        },
        "ukwifi": {
            "type": "http",
            "interval": 86400,
            "behavior": "classical",
            "format": "text",
            "url": "https://raw.githubusercontent.com/HenryChiao/wificalling/refs/heads/main/qiao/wificalling.list"
        },
        "AWAvenueAds": {
            "type": "http",
            "behavior": "domain",
            "format": "yaml",
            "interval": 86400,
            "url": "https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/Filters/AWAvenue-Ads-Rule-Clash.yaml"
        },
        "github": {
            "type": "http",
            "behavior": "classical",
            "interval": 3600,
            "format": "yaml",
            "proxy": "DIRECT",
            "url": "https://rule.kelee.one/Clash/GitHub.yaml"
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
