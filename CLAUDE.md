# JHD 个人博客 — 项目文档

## 项目概述

基于 Hugo + LoveIt 主题的星空行星风格个人站点，部署于 GitHub Pages。站点定位是"记录每一个完成的成品"——不仅是博客，更是所有项目的统一入口和展示平台。

- **URL**: `https://Adxs-hm.github.io/`
- **GitHub 仓库**: `Adxs-hm.github.io`
- **站点标题**: JHD
- **标语**: "记录每一个完成的成品 · 在星轨中留下足迹"

## 技术栈

| 层 | 技术 |
|---|---|
| 静态站点生成 | Hugo v0.163.3 Extended |
| 主题 | LoveIt（本地 clone 于 `themes/LoveIt`，基于官方 `dillonzq/LoveIt`） |
| 部署 | GitHub Pages（`gh-pages` 分支） |
| CI/CD | GitHub Actions（`.github/workflows/hugo-deploy.yml`） |
| 搜索 | Fuse.js（客户端全文搜索，索引 `/index.json`） |
| 样式 | SCSS（编译时注入）+ 静态 CSS（运行时叠加），双层策略 |
| 脚本 | 原生 JS（无框架依赖） |

## 目录结构

```
blender-blog/
├── hugo.toml                  # 站点配置（主题、导航、搜索、压缩禁用等）
├── archetypes/default.md      # `hugo new` 模板
├── assets/
│   └── css/_custom.scss       # 编译时 SCSS 注入（LoveIt 管线最后一步）
├── content/
│   ├── about/_index.md        # "关于"页面
│   ├── articles/_index.md     # "文章"列表页（日常记录、对战复盘）
│   ├── articles/aoe4-fun-match/index.md  # 示例：帝国时代4欢乐局
│   ├── milestones/_index.md   # "里程碑"页面（已完成/进行中/计划中）
│   ├── posts/                 # 所有帖子（项目 + 文章共用一个 posts 目录）
│   │   ├── clps-collapse/     # 巨星(CLPS) 科幻宇宙设定
│   │   ├── endgame-era/       # 终局时代 硬科幻子设定
│   │   ├── huashen-weiyin/    # 化身为影 SillyTavern 设定包
│   │   ├── jhd-site/          # JHD 站点本身（项目介绍）
│   │   ├── rimworld-mod-guide/# RimWorld Mod 制作完全指南
│   │   ├── site-launch/       # 站点上线记录（第一个成品）
│   │   ├── std-mod-review/    # STD Mod 审查报告 v2
│   │   ├── std-template-mod/  # STD Template Mod
│   │   ├── wuxianliu-t1/      # 无限流 T1 SillyTavern 设定包
│   │   └── yijie-zhiluan/     # 异界之乱 SillyTavern 设定包
│   └── projects/_index.md     # "项目"列表页（按领域分类的卡片网格）
├── data/                      # 空（LoveIt 数据目录占位）
├── i18n/                      # 空（多语言占位）
├── layouts/                   # 自定义模板（覆盖 LoveIt 默认）
│   ├── baseof.html            # 基础模板（引入 space-fx.js + jhd-search.js）
│   ├── section.html           # 分区列表模板（先渲染 _index.md 再列子页面）
│   ├── posts/single.html      # 文章详情模板（含返回导航逻辑）
│   ├── articles/single.html   # 文章详情模板（与 posts/single.html 相同）
│   └── shortcodes/sketchfab.html  # Sketchfab 3D 模型嵌入
├── static/
│   ├── css/space-theme-v2.css # 星空主题 CSS v6（4000+ 行，运行时加载）
│   ├── images/planet-avatar.svg # 动态行星 SVG 头像
│   └── js/
│       ├── space-fx.js        # 星空特效引擎（视差、光影、入场动画、TOC）
│       └── jhd-search.js      # Fuse.js 搜索组件（自动补全、关键词高亮）
└── themes/LoveIt/             # LoveIt 主题本地副本（不通过 git submodule）
```

## 内容管理

### 添加新内容

```bash
# 创建新帖子（使用 archetypes/default.md 模板）
hugo new posts/新项目名/index.md

# 或者手动创建
mkdir -p content/posts/新项目名
# 然后创建 content/posts/新项目名/index.md
```

### 前置元数据约定

```yaml
---
title: "标题"
date: 2026-06-30T12:36:13+08:00  # ISO 8601 + 时区
description: "一句话描述"
tags: ["标签1", "标签2"]
categories: ["项目"]  # "项目" 或 "记录" 决定返回导航行为
image: ""
draft: false
---
```

- `categories: ["项目"]` → 文章底部显示"← 返回项目列表"
- `categories: ["记录"]` 或其他 → 显示"← 返回文章列表"
- 文章中的图片放在同目录下（如 `featured-image.png`），通过 `image` 字段引用

### 内容分区

- **posts/**: 所有内容统一放这里，通过 `categories` 区分项目和文章
- **articles/**: 仅放日常文章（当前只有 aoe4-fun-match），实际通过 posts 软链
- **projects/**: 项目主页 `_index.md` 包含按领域的项目卡片网格（需手动维护卡片 HTML）
- **milestones/**: `_index.md` 包含里程碑进度（需手动更新）

## 主题定制

### 双层 CSS 策略

1. **`assets/css/_custom.scss`** — 编译时注入到 LoveIt SCSS 管线末尾，用 `!important` 覆盖主题默认色值
2. **`static/css/space-theme-v2.css`** — 运行时加载（通过 `hugo.toml` 的 `params.page.library.css.spaceTheme`），4000+ 行，提供星空粒子背景、轨道装饰、银河光带、卡片辉光等高级视觉效果

### 自定义模板覆盖

| 模板 | 覆盖原因 |
|---|---|
| `layouts/baseof.html` | 在 `<body>` 底部引入 `space-fx.js` 和 `jhd-search.js` |
| `layouts/section.html` | 在子页面列表前渲染 `_index.md` 内容（支持自定义介绍） |
| `layouts/posts/single.html` | 添加底部返回导航（根据分类跳转 `/projects/` 或 `/articles/`） |
| `layouts/articles/single.html` | 与 posts/single.html 内容相同 |

### 自定义 Shortcode

- `sketchfab`: 嵌入 Sketchfab 3D 模型，参数 `id`, `title`, `params`, `height`, `caption`

### 自定义 JS

- **space-fx.js**: 鼠标视差、卡片光影追随、滚动入场动画（IntersectionObserver）、数值递增动画、TOC 滚动高亮/平滑滚动
- **jhd-search.js**: Fuse.js 客户端搜索，自建 dropdown panel，支持键盘导航、关键词高亮、去重

## 构建与部署

### 本地开发

```bash
# 进入项目目录
hugo server -D    # 预览（含草稿），默认 http://localhost:1313
hugo              # 构建到 public/
```

### 自动部署

push 到 GitHub `main` 分支触发 `.github/workflows/hugo-deploy.yml`：
1. 检出代码
2. 安装 Hugo Extended latest
3. 运行 `hugo` 构建
4. 部署 `public/` 到 `gh-pages` 分支（peaceiris/actions-gh-pages）

GitHub Pages 设置中 Source 选择 "Deploy from a branch"，分支选 `gh-pages`。

## 已知问题与解决方案

### CSS/HTML 压缩禁用
**问题**: `hugo.toml` 中 `[minify] disableCSS = true, disableHTML = true`。
**原因**: tdewolff/minify 会把 CSS 中的 `transparent` 关键字错误转换为 `rgba(0,0,0,0)`，导致深色主题的所有透明区域变黑。
**影响**: 输出文件稍大，但不影响功能。

### 搜索索引去重
**问题**: `/index.json` 可能包含重复条目。
**方案**: `jhd-search.js` 加载索引后自动按 `uri` 去重。

### LoveIt 主题为本地副本
主题位于 `themes/LoveIt/`，是直接 clone 而非 git submodule。更新主题需要手动 re-clone 或复制文件。

### Hugo 版本锁定
当前使用 Hugo v0.163.3 Extended。LoveIt 0.3.X 兼容 Hugo 0.128.0 - 0.145.0，但实测 0.163.3 正常工作。

## 常用操作

```bash
# 创建新帖子
hugo new posts/项目名/index.md

# 本地预览（含草稿）
hugo server -D

# 构建
hugo

# 构建并检查
hugo && ls -la public/

# Git 提交流程
git add -A
git commit -m "描述改动"
git push origin main
# GitHub Actions 自动部署
```

## 外部参考

- LoveIt 官方文档: https://hugoloveit.com/zh-cn/
- Hugo 文档: https://gohugo.io/documentation
- LoveIt GitHub: https://github.com/dillonzq/LoveIt
