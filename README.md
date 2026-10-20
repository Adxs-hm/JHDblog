<div align="center">

<img src="static/images/planet-avatar.svg" width="120" alt="JHD · 终端">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=15&duration=2800&pause=900&color=C9A227&center=true&vCenter=true&width=600&lines=%3E+JHD+%2F%2F+TERMINAL+v8%3B%3E+HUGO+0.168+EXTENDED+%C2%B7+PAPERMOD%3B%3E+STATUS+%E2%97%8F+ONLINE+%C2%B7+SYSTEMS+NOMINAL" alt="Typing SVG">

**记录一个网站的建造 —— 这里收录的唯一项目，就是站自身。**

<a href="https://adxs-hm.github.io/JHDblog/"><img src="https://img.shields.io/badge/%E7%AB%99%E7%82%B9-%E5%9C%A8%E7%BA%BF-a5824a?style=flat-square" alt="站点"></a>
<a href="https://github.com/Adxs-hm/JHDblog/actions/workflows/hugo-deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/Adxs-hm/JHDblog/hugo-deploy.yml?style=flat-square&label=%E9%83%A8%E7%BD%B2" alt="部署状态"></a>
<img src="https://img.shields.io/badge/Hugo-0.168.0-a5824a?style=flat-square&logo=hugo&logoColor=white" alt="Hugo">
<img src="https://img.shields.io/badge/Theme-PaperMod-26282e?style=flat-square" alt="Theme">
<img src="https://img.shields.io/badge/License-MIT-787c86?style=flat-square" alt="License">

</div>

---

## `REC/01` · 关于本站

JHD 是一座只归档**自身建造过程**的个人站——设计系统、构建管线、每一次改版，都是被收录的档案，不追逐流量内容。

当前版本 **TERMINAL v8（终端 · 金/银）**：纸白/纯黑对撞 + 单一哑光金强调 + 银色结构 + 直角 + 拉丁大写 + 等宽 HUD。双主题中档案纸白为主视觉（默认），终端黑为次级；元信息全部以等宽字体呈现。

**在线** → <https://adxs-hm.github.io/JHDblog/>

## `REC/02` · 设计系统 · TERMINAL v8

> 设计纪律：纸白/纯黑 + 单一哑光金强调 + 银色结构；细线不阴影；直角贯穿；动效全门控。

| 令牌 | 值 | 角色 |
|---|---|---|
| `--bg` | `#f4f3ee` / `#06080a` | 档案纸白（主视觉）/ 终端黑（次级） |
| `--fg` | `#0d0f12` / `#eef2f4` | 墨黑 / 纸白 |
| `--accent` | `#a5824a` / `#c9a227` | 唯一强调色 · 哑光金（仅图形） |
| `--accent-ink` | `#7a5c1a` / `#c9a227` | 强调文字色（纸底 5.7:1 / 深底 8.1:1 · AA） |
| `--line` | `#cdd1d8` / `#1d252c` | 1px 银灰细线 |
| `--halftone` / `--grid` | 双主题各一 | 背景两层质感（银色） |

- **字体**：Chakra Petch（拉丁展示，自托管子集）+ JetBrains Mono（全部元信息）+ 系统中文栈（PingFang SC / 微软雅黑，零下载）
- **背景仅两层**：半调网点 + 56px 图纸网格，静态低透明，无第三层
- **档案语言**：`REC/01–03` 编号、`STATUS ● ONLINE / BUILD v8` HUD 状态条、45° 金色警戒条纹
- **套印错位**：卡片 hover 浮出金色第二印框——错位印刷的数字化
- **细线不阴影**：层级全部由 1px 银灰细线承担，零投影，直角贯穿（头像 / 标签胶囊除外）
- **动效门控**：`data-fx` 四级（full/lite/off/hc），save-data 与 prefers-reduced-motion 自动降级
- **双主题**：PaperMod `defaultTheme="light"`（纸白为主视觉，`pref-theme` 可切终端黑），head 内联脚本首帧前应用，无 FOUC

## `REC/03` · 技术栈

| 层 | 选型 |
|---|---|
| 静态生成 | Hugo Extended 0.168.0（CI: 0.168.0 extended，版本已 pin） |
| 主题 | [PaperMod](https://github.com/adityatelange/hugo-PaperMod)（本地副本，`layouts/` + `assets/` 扩展） |
| 部署 | GitHub Pages（`gh-pages` 分支） |
| CI/CD | GitHub Actions：构建验证 → 体量门禁 → 部署；Lighthouse 预算门禁（独立工作流） |
| 搜索 | Fuse.js（PaperMod 内置）+ `Ctrl/⌘ + K` |
| 评论 | giscus（GitHub Discussions） |
| 字体 | Chakra Petch + JetBrains Mono 自托管 latin 子集；中文系统栈 |
| 样式 | `assets/css/extended/custom.css` —— 唯一样式源 |
| 交互层 | `assets/js/main.js`（零依赖核心）+ `game-entry.js`（仅 404），esbuild 按页分包 |

## `REC/04` · 目录结构

```
JHDblog/
├── hugo.toml                          # 站点配置（light 主题 · 纸白主导 / 主区 posts）
├── assets/
│   ├── css/extended/custom.css        # TERMINAL v8 设计系统（唯一样式源）
│   └── js/
│       ├── main.js                    # 核心入口（零依赖）
│       ├── game-entry.js              # 404 游戏入口
│       ├── islands/                   # particle-logo / scanline / badges / focus
│       └── games/terminal-recovery.js # 404 终端修复游戏
├── content/
│   ├── _index.md                      # 首页 Hero（粒子 Logo 场 + HUD 状态条）
│   ├── about/_index.md                # 关于页：站点参数表 + 运行计时器
│   ├── archives.md                    # 归档页
│   ├── search.md                      # 搜索页（Fuse.js）
│   ├── start-here/_index.md           # 档案索引（REC/01–03 阅读路径）
│   └── posts/                         # 唯一内容区：只收录本站自身
│       ├── jhd-site/                  #   JHD 站点（旗舰档案）
│       └── site-launch/               #   JHD 站点上线记录
├── layouts/
│   ├── index.html                     # 首页（Hero → Bento → 索引条 → 订阅）
│   ├── 404.html                       # 404 终端恢复协议（游戏彩蛋）
│   ├── _markup/render-codeblock.html  # 代码块
│   └── partials/
│       ├── comments.html              # giscus 评论
│       ├── cover.html                 # 封面图 AVIF/WebP/LQIP 管线
│       ├── extend_head.html           # 字体 + CSP + data-fx 决策 + JSON-LD
│       ├── extend_footer.html         # JS 分包 + Ctrl+K + TOC + webmention
│       └── extend_post_content.html   # 阅读进度轨道
├── static/
│   ├── fonts/                         # 自托管 woff2  latin 子集（4 个：Chakra Petch ×3 + JetBrains Mono 可变）
│   ├── images/planet-avatar.svg       # 动态行星（连续环 + 环上卫星 + 线框经线）
│   ├── manifest.json                  # PWA
│   └── sw.js                          # Service Worker
├── .github/
│   ├── workflows/                     # 部署 + Lighthouse 门禁 + 安全扫描
│   ├── lighthouserc.json              # LHCI 配置（断言即预算：LCP 1500ms / TBT 200ms / CLS 0.05）
│   └── cloudflare-setup.md            # 边缘网络配置清单
└── themes/PaperMod/                   # 主题（本地副本，随仓库分发）
```

## `REC/05` · 快速开始

```bash
git clone https://github.com/Adxs-hm/JHDblog.git
cd JHDblog

hugo server -D        # 本地预览（需 Hugo Extended）
hugo --minify         # 生产构建 → public/
```

## `REC/06` · Front matter 约定

```yaml
---
title: "标题"
date: 2026-07-07T00:00:00+08:00
description: "SEO 描述"
tags: ["标签"]
categories: ["项目"]
flagship: true              # 可选：首页旗舰大卡（全站仅一个）
stats: ["Hugo + PaperMod"]  # 可选：旗舰卡 mono 数据行
draft: true
---
```

---

<div align="center">
<sub>JHD // TERMINAL v8 · HUGO 0.168.0 EXTENDED · PAPERMOD · MIT</sub>
</div>
