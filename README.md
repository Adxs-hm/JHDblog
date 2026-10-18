# JHD · 白银档案

<p align="center">
  <img src="static/images/planet-avatar.svg" width="120" alt="JHD Logo">
</p>

<p align="center">
  <strong>记录一个网站的建造 · 这里收录的唯一项目，就是本站自身</strong>
</p>

<p align="center">
  <a href="https://adxs-hm.github.io/JHDblog/"><img src="https://img.shields.io/badge/站点-在线-brightgreen?style=flat-square" alt="Site"></a>
  <a href="https://github.com/Adxs-hm/JHDblog/actions"><img src="https://img.shields.io/github/actions/workflow/status/Adxs-hm/JHDblog/hugo-deploy.yml?style=flat-square" alt="Deploy"></a>
  <img src="https://img.shields.io/badge/Hugo-v0.164-ff4088?style=flat-square&logo=hugo" alt="Hugo">
  <img src="https://img.shields.io/badge/Theme-PaperMod-blue?style=flat-square" alt="Theme">
</p>

---

## 技术栈

| 层 | 技术 |
|---|---|
| 静态站点生成 | Hugo Extended |
| 主题 | [PaperMod](https://github.com/adityatelange/hugo-PaperMod)（MIT，47K+ stars） |
| 部署 | GitHub Pages（`gh-pages` 分支） |
| CI/CD | GitHub Actions |
| 搜索 | Fuse.js（PaperMod 内置）+ Ctrl+K |
| 评论 | giscus（GitHub Discussions） |
| 字体 | Noto Sans SC（展示/正文）+ JetBrains Mono（HUD 标签） |
| 样式 | `assets/css/extended/custom.css` |

## 目录结构

```
blog/
├── hugo.toml                          # 站点配置
├── assets/css/extended/custom.css     # 白银档案设计系统 v6
├── content/
│   ├── _index.md                      # 首页 Hero（价值主张 + HUD 状态条）
│   ├── about/_index.md                # 关于页 + 站点参数表 + 运行计时
│   ├── archives.md                    # 归档页
│   ├── search.md                      # 搜索页
│   ├── start-here/_index.md           # 档案索引（REC/01–03 阅读路径）
│   └── posts/                         # 项目（本站自身，仅两篇）
│       ├── jhd-site/                  #   JHD 站点（旗舰档案）
│       └── site-launch/               #   JHD 站点正式上线
├── layouts/
│   ├── index.html                     # 首页（Hero → Bento → 索引条 → 订阅）
│   ├── _markup/render-codeblock.html  # 浅色银终端代码块
│   └── partials/
│       ├── comments.html              # giscus 评论
│       ├── extend_head.html           # 字体 + CSP + JSON-LD + PWA
│       ├── extend_footer.html         # Ctrl+K + TOC 跟踪 + 页脚 HUD + Webmention
│       └── extend_post_content.html   # 占位（无系列结构）
├── static/images/planet-avatar.svg    # 行星头像
├── .github/workflows/
│   ├── hugo-deploy.yml                # 自动部署
│   └── security-scan.yml              # 安全扫描
└── themes/PaperMod/                   # 主题（本地副本）
```

## 设计系统

**Silver Archive v6（白银档案）**——明日方舟 UI 平面语言 × 银金高级感：米白纸底 + 银灰细线 + 单一哑光金 + 科幻档案语言。

- **背景仅两层**：半调网点（网点纸）+ 图纸网格（56px 蓝图线），均静态低透明
- **单一金色强调**：哑光金只做标记（kicker/警戒条纹/链接/旗舰边/角括号），面积 < 5%；紫色已彻底移除
- **字体**：Noto Sans SC 900 展示标题 + JetBrains Mono 全部元信息（编号/状态/日期/数据）
- **档案语言**：REC/01–03 编号、`STATUS ● ONLINE / BUILD v6` HUD 状态条、45° 金色警戒条纹
- **套印错位**：卡片 hover 浮出金色第二印框（错位印刷的数字化）
- **细线不阴影**：层级全靠 1px 银灰细线，零投影，直角贯穿
- **动效白名单**：hover 套印框、入场渐隐，尊重 `prefers-reduced-motion`

## 快速开始

```bash
git clone https://github.com/Adxs-hm/JHDblog.git
cd JHDblog

# 本地预览
hugo server -D

# 构建
hugo
```

## Front matter 约定

```yaml
---
title: "标题"
date: 2026-07-07T00:00:00+08:00
description: "SEO 描述"
tags: ["标签1", "标签2"]
categories: ["项目"]
flagship: true              # 可选：首页旗舰大卡（全站一个）
stats: ["Hugo + PaperMod"]  # 可选：旗舰卡数据行
draft: true
---
```

## 许可证

MIT
