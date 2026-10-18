# JHD · 深空个人博客

<p align="center">
  <img src="static/images/planet-avatar.svg" width="120" alt="JHD Logo">
</p>

<p align="center">
  <strong>记录每一个完成的成品 · 在星轨中留下足迹</strong>
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
| 社交互动 | webmention.io（Mastodon 联动） |
| 展示字体 | Noto Serif SC（Google Fonts，失败降级系统衬线） |
| 样式 | `assets/css/extended/custom.css` |

## 目录结构

```
blog/
├── hugo.toml                          # 站点配置
├── assets/css/extended/custom.css     # 深空编年史设计系统 v5
├── content/
│   ├── _index.md                      # 首页 Hero（紧凑价值主张）
│   ├── about/_index.md                # 关于页
│   ├── archives.md                    # 归档页
│   ├── search.md                      # 搜索页
│   ├── start-here/_index.md           # 新人入口（三步阅读路径）
│   ├── lore/                          # 设定（原创世界观）
│   │   ├── _index.md                  #   设定集入口
│   │   ├── clps-collapse/             #   巨星 CLPS（旗舰，4,000+ 行）
│   │   └── endgame-era/               #   终局时代（CLPS 子设定）
│   ├── posts/                         # 项目（工程成品）
│   │   ├── std-template-mod/          #   RimWorld 遗落科技 Mod
│   │   ├── jhd-site/                  #   JHD 站点本身
│   │   └── site-launch/               #   站点上线记录
│   └── articles/                      # 文章（战报与随笔）
│       └── aoe4-fun-match/            #   帝国时代4 欢乐局
├── layouts/
│   ├── index.html                     # 首页（Hero → Bento → 订阅）
│   ├── _markup/render-codeblock.html  # macOS 风格代码块
│   └── partials/
│       ├── comments.html              # giscus 评论
│       ├── extend_head.html           # 字体 + CSP + JSON-LD + PWA
│       ├── extend_footer.html         # Ctrl+K + TOC 跟踪 + Webmention
│       └── extend_post_content.html   # 系列导航（series）
├── static/images/planet-avatar.svg    # 行星头像
├── .github/workflows/
│   ├── hugo-deploy.yml                # 自动部署
│   └── security-scan.yml              # 安全扫描
└── themes/PaperMod/                   # 主题（本地副本）
```

## 设计系统

**Deep Space Chronicle v5（深空编年史）**——天文台档案室气质：深空暗底 + 单一金色强调 + 衬线展示标题。

- **背景仅两层**：静态细星场 + 一道星轨渐变光带（v4 的 9 层特效：银河/星云/流星/太阳/黑洞/行星/暗角/轨道环已全部移除）
- **单一强调色**：金色 `<5% 像素`，紫色已完全移除
- **排版**：Noto Serif SC 900 展示体（Hero/标题/条目）+ 系统无衬线正文 + JetBrains Mono 数据
- **Bento 层级**：首页卡片尺寸 = 内容重要性，CLPS 为唯一旗舰（跨列 + 数据点）
- **动效白名单**：头像呼吸 / hover 位移 / 入场渐隐（尊重 `prefers-reduced-motion`）
- **层次靠边框**：hairline 分隔线体系，零阴影（头像辉光除外）

## 快速开始

```bash
git clone https://github.com/Adxs-hm/JHDblog.git
cd JHDblog

# 本地预览
hugo server -D

# 构建
hugo
```

## 添加文章

```bash
hugo new posts/新项目名/index.md
```

Front matter 约定：
```yaml
---
title: "标题"
date: 2026-07-07T00:00:00+08:00
description: "SEO 描述"
tags: ["标签1", "标签2"]
categories: ["项目"]        # 项目 / 设定 / 文章
series: "CLPS 宇宙"         # 可选：同一系列互相串联
weight: 1                   # 可选：系列内排序
flagship: true              # 可选：首页旗舰大卡（每站仅一个）
stats: ["4,000+ 行设定"]    # 可选：旗舰卡数据点
draft: true
---
```

内容分区：`posts/` 项目 · `lore/` 设定 · `articles/` 文章。

## 许可证

MIT
