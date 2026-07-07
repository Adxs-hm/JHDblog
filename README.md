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
| 搜索 | Fuse.js（PaperMod 内置） |
| 评论 | giscus（GitHub Discussions） |
| 社交互动 | webmention.io（Mastodon 联动） |
| 样式 | `assets/css/extended/custom.css` |

## 目录结构

```
blog/
├── hugo.toml                          # 站点配置
├── assets/css/extended/custom.css     # 深空设计系统
├── content/
│   ├── _index.md                      # 首页 Hero（轨道环 + 金属标题）
│   ├── about/_index.md                # 关于页
│   ├── archives.md                    # 归档页
│   ├── search.md                      # 搜索页
│   ├── milestones/_index.md           # 里程碑页
│   ├── projects/_index.md             # 项目总览
│   └── posts/                         # 11 篇文章
│       ├── aoe4-fun-match/            # 帝国时代4 欢乐局
│       ├── clps-collapse/             # 巨星(CLPS) 科幻宇宙
│       ├── endgame-era/               # 终局时代 硬科幻
│       ├── huashen-weiyin/            # 化身为影
│       ├── jhd-site/                  # JHD 站点本身
│       ├── rimworld-mod-guide/        # RimWorld Mod 指南
│       ├── site-launch/               # 站点上线记录
│       ├── std-mod-review/            # STD Mod 审查
│       ├── std-template-mod/          # STD Template Mod
│       ├── wuxianliu-t1/              # 无限流 T1
│       ├── yijie-zhiluan/             # 异界之乱
│       └── zombie-apocalypse/         # 丧尸危世
├── layouts/partials/
│   ├── comments.html                  # giscus 评论
│   ├── extend_head.html               # JSON-LD + webmention
│   └── extend_footer.html             # 星空特效 + 光影追踪 + webmention
├── static/images/planet-avatar.svg    # 行星头像
├── .github/workflows/
│   ├── hugo-deploy.yml                # 自动部署
│   └── security-scan.yml              # 安全扫描
└── themes/PaperMod/                   # 主题（本地副本）
```

## 设计系统

深空主题：`#0a0c1e` 深色背景 + `#c8b478` 金色强调 + `#a080d8` 紫色辅助。

- **5 层星空**: CSS 伪元素双层星场 + 流星 + 渐晕光晕 + 星云呼吸
- **轨道环头像**: 双层旋转光环（实线 + 虚线反向）
- **金属渐变标题**: 6 段龙鳞式渐变 + 呼吸光晕
- **毛玻璃卡片**: `backdrop-filter: blur(14px)` + 鼠标光影追踪
- **文章排版**: 金色竖线标题 + 渐变引用块 + 终端风格代码
- **滚动入场**: IntersectionObserver 驱动的内容渐入动画

## 快速开始

```bash
git clone https://github.com/Adxs-hm/JHDblog.git
cd JHDblog

# 本地预览（双击 dev.ps1 或手动运行）
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
categories: ["项目"]
draft: true
cover:
  image: "cover.png"
---
```

## 许可证

MIT
