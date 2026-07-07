---
title: "JHD 站点正式上线"
date: 2026-06-30T10:33:33+08:00
description: "第一个成品：这个网站本身——从零到一的完整记录"
tags: ["网站", "里程碑"]
categories: ["项目"]
draft: false
---

## 成品 #001

这是 JHD 站点的第一个记录——**这个网站本身**。

一个用于记录所有已完成成品的个人站点。从决定建站到上线，整个过程中评估了多个方案、踩了无数坑、最终交付了一个可长期维护的成果展示平台。

## 技术选型历程

### 方案对比

| 方案 | 评估结论 |
|------|---------|
| **ddmer-1（Next.js 全栈博客）** | 功能极丰富（文章/相册/音乐/Live2D/管理后台），但依赖 Neon 数据库 + Cloudflare R2 + GitHub OAuth，部署复杂，对纯记录需求过度工程化 |
| **Gridea** | GUI 客户端友好，但项目已停滞，无作品展示主题 |
| **Hexo** | 中文生态最好，主题最丰富，但依赖 Node.js，构建速度随内容增长线性下降 |
| **Astro** | 现代架构，内置图片优化，但需要写代码定制，非"开箱即用" |
| **🏆 Hugo** | 单二进制文件（零系统依赖），构建速度最快（<500ms），主题生态成熟，GitHub Pages 原生支持 |

### 选择 Hugo 的核心理由

1. **零运维负担**：没有数据库、没有 Node.js、没有依赖版本焦虑，10 年后这个站点仍然可以构建
2. **Markdown 写作**：内容与展示完全分离，迁移成本为零
3. **GitHub Pages 原生**：push 即部署，不需要额外注册任何服务
4. **构建速度**：当前 82 页 + 特效 JS 仅需 ~400ms，扩展到 500 页也不会有性能问题

## 开发过程与踩坑记录

### 主题定制

选用 LoveIt 主题后进行了深度改造：

| 改造项 | 说明 |
|--------|------|
| **星空背景** | CSS-only 实现：三层伪元素（body::before 小星点 60s 漂移 + body::after 大星点 + 银河光带 160s 漂移 + .wrapper::before 星云呼吸光晕） |
| **动态行星头像** | SVG 矢量动画：光环 30s 自转 + 星点闪烁 + 呼吸式光晕脉动（3s 周期） |
| **项目卡片** | 横行毛玻璃卡片：左侧图标 + 右侧信息栏，整卡 `<a>` 包裹可点击，悬停右滑 + 箭头淡入 |
| **配色体系** | CSS 变量驱动：`--bg-deep #0a0c1e` / `--text-body #c0cce4` / `--gold #c8b478` / `--purple #a080d8`，全站统一 |
| **编译时注入** | `assets/css/_custom.scss` 在 LoveIt SCSS 管线末尾注入暗色规则，从编译层面消除白色背景 |

### 踩过的坑

| # | 坑 | 解决 |
|---|-----|------|
| 1 | LoveIt section 模板不渲染 `_index.md` 正文（只显示子文章列表） | 创建 `layouts/section.html` 覆写，在列表前插入 `{{ .Content }}` |
| 2 | 自定义 CSS 相对路径在子页面 404（`css/space-theme.css` → `/projects/css/space-theme.css`） | 改为绝对路径 `/css/space-theme.css` |
| 3 | Hugo permalink `:contentbasename` 导致文章 URL 在根目录，与卡片链接 `/posts/xxx/` 不匹配 | 改 permalink 为 `/posts/:contentbasename/` |
| 4 | **Hugo 的 tdewolff/minify 库将 CSS `transparent` 关键字错误转换为 `initial` 和 `0 0`**，导致所有透明属性失效，白框反复出现无法消除 | 在 `hugo.toml` 中添加 `[minify] disableCSS = true, disableHTML = true`，并从 GitHub Actions 构建命令中移除 `--minify` 标志 |
| 5 | GitHub push 被 secret scanning 拦截（LoveIt theme 示例文件中的 Mapbox token） | 删除 theme 的 `exampleSite/` 目录并重置 Git 历史 |
| 6 | 内联 `<style>` 标签被 Hugo HTML 压缩器递归处理，CSS 语法再次被破坏 | 最终方案：禁用 HTML 压缩 + 编译时注入，双保险 |

### 技术架构总览

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ 本地编辑 MD  │ ──→ │ Hugo 构建    │ ──→ │ GitHub Pages    │
│ (VS Code)   │     │ (<500ms)     │     │ (全球 CDN)      │
└─────────────┘     └──────────────┘     └─────────────────┘
                            │
                    ┌───────┴───────┐
                    │ GitHub Actions │
                    │ (自动部署)      │
                    └───────────────┘
```

| 层级 | 技术 |
|------|------|
| 框架 | Hugo 0.163.3 Extended |
| 主题 | LoveIt（SCSS 深度定制 + 编译时注入） |
| 自定义 CSS | `space-theme.css`（~40KB，CSS 变量体系 + 星空特效） |
| 自定义 JS | `space-fx.js`（鼠标视差 + 卡片光影追踪 + 滚动入场） |
| 布局覆写 | `layouts/section.html`、`layouts/posts/single.html`、`layouts/baseof.html` |
| 托管 | GitHub Pages |
| CI/CD | GitHub Actions（peaceiris/actions-hugo + actions-gh-pages） |
| 包管理 | 无（Hugo 单二进制） |
| 数据库 | 无（纯静态 HTML） |

## 当前站点数据

| 统计 | 数值 |
|------|------|
| 总页面数 | 82 |
| 项目详情页 | 9 |
| 分类栏目 | 4（游戏开发 / AI 角色扮演 / 世界观设定 / 网站建设） |
| 构建时间 | ~400ms |
| CSS 体积 | 76KB（style.min.css）+ 40KB（space-theme.css） |
| JS 体积 | 3.8KB（space-fx.js） |
| 零外部请求 | 所有资源自托管 |

## 后续规划

- **JHD 2.0 全新站点**（远期）：全新视觉设计，可能的技术栈为 Astro 或继续 Hugo，当前站点保留为档案
- 自定义域名绑定
- 图片资源体系（截图、流程图、渲染图）
- RSS/Atom Feed
- 多语言支持
- 无头 CMS 集成

---

> 🌟 *这个站点是第一颗被记录的恒星。在它运行的同时，更多的轨道正在星图中标注。*
