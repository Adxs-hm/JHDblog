---
title: "JHD 站点"
date: 2026-06-30T12:36:13+08:00
description: "Hugo + LoveIt 星空行星主题个人站点，深度定制 CSS 与交互，作为所有成品记录的统一入口"
tags: ["网站", "Hugo", "GitHub Pages"]
categories: ["项目"]
image: ""
draft: false
---

## 这个项目是什么

**JHD 站点**是一个基于 Hugo 静态站点生成器构建的个人成果记录网站。它不只是一个博客——它是所有完成项目的**统一入口和展示平台**。你正在看的这个页面本身就是 JHD 站点的产物。

整个站点从一开始的设计理念就是：**每个成品都是一颗小星球，而这个站点是它们运行的轨道。**

## 技术架构

### 构建与部署链路

```text
Markdown 文章 → Hugo 构建 → 纯 HTML/CSS/JS → GitHub Pages 托管
     ↑                ↑                                ↑
  本地编辑        <200ms 构建                   全球 CDN 分发
```

整个链路没有任何数据库、没有后端服务器、没有运行时依赖。从写完一篇文章到全世界可见，只需要 `git push`，然后 GitHub Actions 在 30 秒内完成构建和部署。

### 技术选型理由

| 选型 | 理由 |
|------|------|
| **Hugo**（Go 语言） | 单二进制文件，构建速度是所有静态生成器中最快的（<200ms），不需要 Node.js 环境 |
| **LoveIt 主题** | 中文支持好、功能全面（搜索/灯箱/代码高亮）、MIT 开源 |
| **自定义 CSS** | 在 LoveIt 基础上完全重写色彩体系，适配深色星空背景 |
| **GitHub Pages** | 永久免费、自带 HTTPS、全球 CDN、与 Git 工作流无缝整合 |
| **GitHub Actions** | push 即部署，零手动操作 |

### Hugo 版本与栈

| 层级 | 技术 |
|------|------|
| 框架 | Hugo 0.163.3 Extended (2026-06-18 发布) |
| 主题引擎 | Go Templates + Hugo Pipes |
| 样式预处理 | Tailwind CSS 4（LoveIt 内置）+ 手写 CSS |
| 脚本 | Vanilla JS（搜索/主题切换/灯箱） |
| 内容格式 | Markdown (Goldmark) + 自定义 Shortcodes |

## 开发历程

这个站点经历了两个阶段的演变：

### 第一阶段：Blender 作品展示

最初的构思是做 Blender 3D 作品集。但很快意识到需要的不是一个"作品集"网站，而是一个**更通用的记录系统**——因为完成的远不止 3D 作品。

### 第二阶段：JHD 通用成品记录

重新定位为"记录每一个完成的成品"。改造包括：
- 站名改为 **JHD**
- 设计转向星空行星主题——每个成品是一颗星球
- 导航栏重构为"项目 / 里程碑 / 关于"
- 放弃复杂全栈方案（此前评估过一个 Next.js + PostgreSQL 的博客），选择极简的 Hugo + GitHub Pages

### 遇到的坑与解决

**坑 1：LoveIt 主题的 section 页面不渲染 `_index.md` 正文**

主题的 `section.html` 模板只遍历子文章做列表，完全跳过 `.Content`。导致项目/里程碑/关于页面有标题没内容。

**解决**：在项目 `layouts/` 下创建自定义 `section.html`，在子文章列表前插入 `{{ .Content }}`。

**坑 2：CSS 路径问题**

自定义 CSS 最初用了相对路径 `css/space-theme.css`，在 `/projects/` 等子页面被解析为 `/projects/css/space-theme.css` → 404，整个星空主题丢失。

**解决**：改为绝对路径 `/css/space-theme.css`。

**坑 3：Permalink 与链接不匹配**

早期配置 `posts = ":contentbasename"` 把文章放在根目录下（`/jhd-site/`），但卡片链接写的是 `/posts/jhd-site/` → 全部 404。

**解决**：改 permalink 为 `/posts/:contentbasename/`，统一所有文章 URL 在 `/posts/` 下。

**坑 4：深色背景文字不可见**

LoveIt 主题的暗色模式没有完全覆盖所有元素。表格内的文字、列表项、部分元信息仍是暗色，在深色背景上完全不可见。

**解决**：全面重写 CSS，对所有可能出现的文字元素做显式浅色声明（`#d0d8f0` 及以上亮度），表格/代码/引用块全部独立设色。

## 文件结构

```text
blender-blog/
├── hugo.toml                 # 站点配置（主题/菜单/SEO/语言）
├── content/
│   ├── projects/_index.md    # 项目列表页（分类 + 横行卡片）
│   ├── milestones/_index.md  # 里程碑时间线
│   ├── about/_index.md       # 关于页
│   └── posts/                # 所有文章/项目详情
│       ├── site-launch/      # 站点的第一个成品记录
│       ├── jhd-site/         # JHD 站点项目详情
│       ├── std-template-mod/ # STD Mod 项目详情
│       └── ...               # 其他项目详情页
├── layouts/
│   ├── section.html          # 自定义栏目页模板（修复 _index.md 渲染）
│   └── shortcodes/
│       └── sketchfab.html    # 3D 模型嵌入 Shortcode
├── static/
│   ├── css/space-theme.css   # 星空主题样式（~530 行）
│   └── images/
│       └── planet-avatar.svg # 动态行星 SVG 头像
├── themes/LoveIt/            # 基础主题
└── .github/workflows/        # GitHub Actions 自动部署
    └── hugo-deploy.yml
```

## 设计系统

### 色彩方案

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景底色 | `#06060f` | 深空黑 |
| 卡片背景 | `rgba(18,18,50,0.6)` | 半透明深蓝紫 |
| 主文字 | `#d0d8f0` - `#eef4ff` | 浅蓝白 |
| 强调色 | `#e9b847` — 金星金 | 链接、标签、高亮 |
| 次要文字 | `#7888a8` - `#98acc8` | 灰蓝，元信息 |
| 星云光晕 | `rgba(75,30,120,0.25)` | 紫罗兰 |
| 表格/代码区 | `rgba(10,10,30,0.8)` | 更深底色 |

### 排版层级

- 页面标题：2rem / 800 字重
- 一级标题：1.75rem / 800 字重 / 金色左边框
- 二级标题：1.4rem / 700 字重 / 金色半透明左边框
- 正文：1.05rem / 行高 2.0
- 标签/元信息：0.72–0.85rem

### 交互效果

- 项目卡片：悬停右滑 8px + 箭头淡入 + 金色边框发光
- 文章卡片：悬停上浮 4px + 蓝色阴影扩散
- 行星头像：呼吸式光晕脉动（3 秒周期）+ 光环 30 秒旋转
- 表格行：悬停微亮背景
- 链接：底部虚线 → 实线 + 金色发光

## 后续规划

### 短期（1-3 个月）
- [ ] 自定义域名绑定
- [ ] 图片懒加载 & WebP 自动转换
- [ ] RSS/Atom Feed
- [ ] 站内全文搜索优化
- [ ] 深色/浅色模式独立配色

### 中期（3-12 个月）
- [ ] 项目间标签关联网络（自动发现相关内容）
- [ ] 交互式时间线视图
- [ ] 中英双语支持
- [ ] 内容更新统计面板

### 远期（1 年以上）
- [ ] **JHD 2.0 全新站点**：全新视觉设计，可能技术栈：Astro / Next.js / Hugo
- [ ] 无头 CMS 集成（Decap CMS / TinaCMS）
- [ ] 结构化数据 API
- [ ] 自动化内容同步（从其他创作平台聚合）
- [ ] 评论/反馈系统

## 完成时间

**2026 年 6 月 30 日**（首次上线）  
持续迭代中
