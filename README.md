<div align="center">

<img src="static/images/planet-avatar.svg" width="120" alt="JHD · 白银档案">

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=15&duration=2800&pause=900&color=B08D4E&center=true&vCenter=true&width=600&lines=%3E+JHD+%2F%2F+SILVER+ARCHIVE+v6%3B%3E+HUGO+0.168+EXTENDED+%C2%B7+PAPERMOD%3B%3E+STATUS+%E2%97%8F+ONLINE+%C2%B7+SYSTEMS+NOMINAL" alt="Typing SVG">

**记录一个网站的建造 —— 这里收录的唯一项目，就是本站自身。**

<a href="https://adxs-hm.github.io/JHDblog/"><img src="https://img.shields.io/badge/%E7%AB%99%E7%82%B9-%E5%9C%A8%E7%BA%BF-3f6b4f?style=flat-square" alt="站点"></a>
<a href="https://github.com/Adxs-hm/JHDblog/actions/workflows/hugo-deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/Adxs-hm/JHDblog/hugo-deploy.yml?style=flat-square&label=%E9%83%A8%E7%BD%B2" alt="部署状态"></a>
<img src="https://img.shields.io/badge/Hugo-0.168.0-a5824a?style=flat-square&logo=hugo&logoColor=white" alt="Hugo">
<img src="https://img.shields.io/badge/Theme-PaperMod-26282e?style=flat-square" alt="Theme">
<img src="https://img.shields.io/badge/License-MIT-787c86?style=flat-square" alt="License">

</div>

---

## `REC/01` · 关于本站

JHD 是一座只归档**自身建造过程**的个人站——设计系统、构建管线、每一次改版，都是被收录的档案，不追逐流量内容。

当前版本 **Silver Archive v6（白银档案）**：明日方舟 UI 的平面语言 × 银金高级感。米白纸底、银灰细线、单一哑光金，全部元信息以等宽字体呈现，像一座持续运行中的档案终端。

**在线** → <https://adxs-hm.github.io/JHDblog/>

## `REC/02` · 设计系统 · Silver Archive v6

> 设计纪律：浅色纸底 + 单一哑光金；细线不阴影；直角贯穿；动效白名单。

| 令牌 | 值 | 角色 |
|---|---|---|
| `--paper` | `#f2f1ec` | 纸底 · 全局背景 |
| `--surface` | `#fbfbf8` | 卡片面 |
| `--ink` | `#26282e` | 标题文字 |
| `--ink-2` | `#454852` | 正文 |
| `--muted` | `#787c86` | 元信息 |
| `--gold` | `#a5824a` | 唯一强调色（面积 < 5%） |
| `--gold-deep` | `#866631` | 强调深阶 · 代码关键字 |
| `--hairline` | `#d8d6cc` | 1px 银灰细线 |

- **字体**：Noto Sans SC 900 展示标题 + 400/500/700 正文；JetBrains Mono 承载全部元信息（编号 / 状态 / 日期 / 数据）
- **背景仅两层**：半调网点（网点纸）+ 56px 图纸网格，静态低透明，无第三层
- **档案语言**：`REC/01–03` 编号、`STATUS ● ONLINE / BUILD v6` HUD 状态条、45° 金色警戒条纹
- **套印错位**：卡片 hover 浮出金色第二印框——错位印刷的数字化
- **细线不阴影**：层级全部由 1px 银灰细线承担，零投影，直角贯穿（头像 / 标签胶囊除外）
- **动效白名单**：hover 套印框、入场渐隐；尊重 `prefers-reduced-motion`
- **浅色强制**：即使浏览器存有旧版暗色偏好，也经 `:root[data-theme="dark"]` 令牌映射强制浅色（v6.1 修复）

## `REC/03` · 技术栈

| 层 | 选型 |
|---|---|
| 静态生成 | Hugo Extended 0.168.0（CI: latest extended） |
| 主题 | [PaperMod](https://github.com/adityatelange/hugo-PaperMod)（本地副本，`layouts/` + `assets/` 扩展） |
| 部署 | GitHub Pages（`gh-pages` 分支） |
| CI/CD | GitHub Actions：构建验证 → 体量门禁 → 部署 |
| 搜索 | Fuse.js（PaperMod 内置）+ `Ctrl/⌘ + K` |
| 评论 | giscus（GitHub Discussions） |
| 字体 | Noto Sans SC + JetBrains Mono（Google Fonts） |
| 样式 | `assets/css/extended/custom.css` —— 唯一样式源 |

## `REC/04` · 目录结构

```
JHDblog/
├── hugo.toml                          # 站点配置（浅色强制 / 主区 posts）
├── assets/css/extended/custom.css     # 白银档案 v6 设计系统（唯一样式源）
├── content/
│   ├── _index.md                      # 首页 Hero（价值主张 + HUD 状态条）
│   ├── about/_index.md                # 关于页：站点参数表 + 运行计时器
│   ├── archives.md                    # 归档页
│   ├── search.md                      # 搜索页（Fuse.js）
│   ├── start-here/_index.md           # 档案索引（REC/01–03 阅读路径）
│   └── posts/                         # 唯一内容区：只收录本站自身
│       ├── jhd-site/                  #   JHD 站点（旗舰档案）
│       └── site-launch/               #   JHD 站点上线记录
├── layouts/
│   ├── index.html                     # 首页（Hero → Bento → 索引条 → 订阅）
│   ├── _markup/render-codeblock.html  # 浅色纸面代码块
│   └── partials/
│       ├── comments.html              # giscus 评论
│       ├── extend_head.html           # 字体 + CSP + JSON-LD + PWA
│       ├── extend_footer.html         # 页脚 HUD + Ctrl+K + 入场动效
│       └── extend_post_content.html   # 占位（无系列结构）
├── static/
│   ├── images/planet-avatar.svg       # 动态行星（连续环 + 环上卫星 + 线框经线）
│   ├── manifest.json                  # PWA
│   └── sw.js                          # Service Worker
├── .github/workflows/
│   ├── hugo-deploy.yml                # 构建验证 + 体量门禁 + Pages 部署
│   └── security-scan.yml              # 安全扫描
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
<sub>JHD // SILVER ARCHIVE v6 · HUGO 0.168.0 EXTENDED · PAPERMOD · MIT</sub>
</div>
