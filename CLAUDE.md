# JHD 个人博客 — 项目文档

## 项目概述

基于 Hugo + PaperMod 的个人博客，部署于 GitHub Pages。记录每一个完成的成品。

- **URL**: `https://adxs-hm.github.io/JHDblog/`
- **GitHub 仓库**: `Adxs-hm/JHDblog`
- **站点标题**: JHD
- **标语**: "记录每一个完成的成品 · 在星轨中留下足迹"

## 技术栈

| 层 | 技术 |
|---|---|
| 静态站点生成 | Hugo v0.163.3 Extended |
| 主题 | PaperMod（MIT，47K+ stars） |
| 部署 | GitHub Pages（`gh-pages` 分支） |
| CI/CD | GitHub Actions（`.github/workflows/hugo-deploy.yml`） |
| 搜索 | Fuse.js（PaperMod 内置） |
| 评论 | giscus（GitHub Discussions 驱动） |
| 样式 | PaperMod 原生 + `assets/css/extended/custom.css`（95 行） |

## 目录结构

```
blog/
├── hugo.toml                  # 站点配置（PaperMod 标准配置）
├── assets/
│   └── css/extended/custom.css # 自定义样式（深色主题 + 金色强调）
├── content/
│   ├── about/_index.md        # "关于"页面
│   ├── articles/_index.md     # "文章"列表页
│   ├── articles/aoe4-fun-match/index.md  # 帝国时代4欢乐局
│   ├── archives.md            # 归档页面
│   ├── search.md              # 搜索页面
│   ├── milestones/_index.md   # "里程碑"页面
│   ├── projects/_index.md     # "项目"列表页
│   └── posts/                 # 所有帖子
│       ├── clps-collapse/     # 巨星(CLPS) 科幻宇宙
│       ├── endgame-era/       # 终局时代 硬科幻
│       ├── huashen-weiyin/    # 化身为影 SillyTavern 设定
│       ├── jhd-site/          # JHD 站点本身
│       ├── rimworld-mod-guide/# RimWorld Mod 指南
│       ├── site-launch/       # 站点上线记录
│       ├── std-mod-review/    # STD Mod 审查报告
│       ├── std-template-mod/  # STD Template Mod
│       ├── wuxianliu-t1/      # 无限流 T1 SillyTavern 设定
│       ├── yijie-zhiluan/     # 异界之乱 SillyTavern 设定
│       └── zombie-apocalypse/ # 丧尸危世 SillyTavern 设定
├── layouts/
│   └── partials/
│       ├── comments.html      # giscus 评论
│       └── extend_head.html   # JSON-LD 结构化数据
├── static/
│   └── images/planet-avatar.svg # 站点头像
└── themes/PaperMod/           # PaperMod 主题（本地副本）
```

## 内容管理

### 添加新文章

```bash
# 创建新帖子
hugo new posts/新项目名/index.md
```

### 前置元数据约定

```yaml
---
title: "标题"
date: 2026-07-07T00:00:00+08:00
description: "一句话描述"
tags: ["标签1", "标签2"]
categories: ["项目"]   # "项目" 或 "记录"
draft: true
---
```

### 添加封面图

将图片放在文章同目录下（如 `cover.png`），在 front matter 添加：
```yaml
cover:
  image: "cover.png"
```

站点默认 OG 图为 `images/planet-avatar.svg`，文章无封面时自动使用。

## 自定义

### CSS

通过 PaperMod 安全注入点 `assets/css/extended/custom.css` 定制。当前：深色背景 + 金色强调色 + 卡片动效。

### 扩展注入

- `layouts/partials/extend_head.html` — `<head>` 底部注入（JSON-LD）
- `layouts/partials/comments.html` — giscus 评论区
- PaperMod 内置 `extend_footer.html` 可用于注入自定义 JS

## 构建与部署

### 本地开发

```bash
hugo server -D    # 预览（含草稿）
hugo              # 构建到 public/
```

### 自动部署

push 到 `main` 分支触发 `.github/workflows/hugo-deploy.yml`，自动部署到 `gh-pages` 分支。

## 常用操作

```bash
hugo new posts/项目名/index.md  # 创建新文章
hugo server -D                  # 本地预览
hugo                            # 构建
git add -A && git commit && git push  # 提交部署
```

## 外部参考

- PaperMod 文档: https://github.com/adityatelange/hugo-PaperMod/wiki
- Hugo 文档: https://gohugo.io/documentation
