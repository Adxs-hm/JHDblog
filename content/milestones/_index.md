---
title: "里程碑"
date: 2026-07-07T00:00:00+08:00
description: "关键节点，见证成长"
draft: false
---

<div class="stat-banner">
  <div class="stat-item">
    <div class="stat-number">4</div>
    <div class="stat-label">阶段完成</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">6</div>
    <div class="stat-label">质量循环</div>
  </div>
  <div class="stat-item">
    <div class="stat-number">12</div>
    <div class="stat-label">内容产出</div>
  </div>
</div>

---

## 阶段一：基础夯实（2026.06.30 — 07.04）

站点从零到一，核心功能完整上线。

**站点建设**
- Hugo + PaperMod 框架搭建，GitHub Pages 部署
- 深空设计系统 v1：CSS 变量体系 + 星空粒子背景 + 轨道装饰
- 动态行星 SVG 头像（光环旋转 + 星点闪烁）
- GitHub Actions 自动部署管线（push → gh-pages）

**内容建设**
- 10 个项目的独立详情页全部上线
- 1 篇战报文章（帝国时代4 欢乐局）
- 项目涵盖：SillyTavern 设定（6个）+ RimWorld Mod（3个）+ 网站开发（1个）

---

## 阶段二：体验升级（2026.07.04 — 07.07）

网站从功能完整升级到设计精良。

**视觉系统**
- 深空设计系统 v4：三流派融合（Linear 暖暗 + Field.io 锐利 + Dieter Rams 诚实）
- 9 层星空背景：双层星场 + 银河核心 + 星云 + 太阳 + 黑洞 + 行星 + 流星 + 暗角
- 全站无框设计：0px border-radius，hairline 分隔线，单一金色强调（约5%像素）
- 排版系统：1.25 比率 scale，金色左竖线标题，等宽代码，渐变引用

**交互功能**
- TOC 侧边栏：桌面 sticky + 移动折叠 + IntersectionObserver 滚动跟踪
- macOS 风格代码块：红黄绿窗口按钮 + 语言标签 + 超16行自动折叠
- 搜索增强：Ctrl+K 全局快捷键 + Fuse.js 精度优化
- giscus 评论系统：transparent_dark 主题 + 首页留言区 + `noscript` 回退
- Webmention 社交互动：点赞头像网格 + 回复列表分离

**工程化**
- PWA 完整支持：manifest + Service Worker + 可安装到桌面
- CSP 安全头 + DNS Prefetch + Preconnect
- 响应式 4 断点覆盖（480/768/1024/print）
- 全站 350 行精简 CSS，0 设计系统违规

---

## 阶段三：工程化与质量保障（2026.07.07）

从设计精良到可持续迭代。

**质量基础设施**
- sitespeed.io 性能预算配置（LCP 低于 2.5s / FCP 低于 1.8s / CLS 低于 0.1）
- BackstopJS 视觉回归配置（7 场景 × 3 视口）
- GitHub Actions 两阶段 CI/CD：验证 → 部署 + 构建大小检查
- 周度安全扫描（Gitleaks + Lychee 死链检查）

**六循环质量审计**
- 循环 #1：设计系统精炼（三流派融合）
- 循环 #2：全站代码扫描（token 统一 + 0 旧引用）
- 循环 #3：响应式断点覆盖（完整 4 断点）
- 循环 #4：性能基准（CSS 压缩后 ~15KB）
- 循环 #5：跨浏览器兼容（全部特性有回退）
- 循环 #6：内容一致性（12 篇 audit 通过）

---

## 阶段四：JHD 2.0（2026.07.07 启动）

下一代架构准备。

- Astro v5 + Tailwind v4 项目骨架已搭建（`jhd2/`）
- 深空设计系统完整迁移（CSS 伪元素星空 + prose 排版 + 卡片组件）
- 待迁移：11 篇现有内容 → Astro Content Collections
- 待集成：Shiki 代码高亮 / Pagefind 搜索 / Satori OG 图片

---

## 内容清单

| # | 项目 | 领域 | 规模 |
|---|------|------|------|
| 1 | 丧尸危世 | SillyTavern 设定 | 50万字，5卷19篇 |
| 2 | 终局时代 | 硬科幻世界观 | 12文件，~500KB |
| 3 | 巨星（CLPS） | 科幻宇宙 | 4,000+ 行 |
| 4 | 化身为影 | SillyTavern 设定 | 9文件，484KB |
| 5 | 异界之乱 | SillyTavern 设定 | 11文件，282KB |
| 6 | 无限流 T1 | SillyTavern 设定 | 3文件，499KB |
| 7 | STD Template Mod | RimWorld Mod | 18文件，纯XML |
| 8 | RimWorld Mod 指南 | 技术教程 | 704行 |
| 9 | STD Mod 审查报告 | 质量评估 | 663行 |
| 10 | JHD 站点本身 | 网站开发 | — |
| — | 帝国时代4 欢乐局 | 战报 | — |
| — | 站点上线记录 | 里程碑 | — |

---

## 技术栈

| 层 | 技术 |
|---|------|
| SSG | Hugo Extended（PaperMod 主题） |
| 部署 | GitHub Pages（gh-pages 分支） |
| CI/CD | GitHub Actions（验证 → 部署两阶段） |
| 搜索 | Fuse.js（Ctrl+K 全局快捷键） |
| 评论 | giscus（GitHub Discussions）+ Webmention.io |
| 样式 | 350 行 custom.css（Deep Space Archive v4） |
| 安全 | CSP + Gitleaks + Lychee |
| 质量 | sitespeed.io 预算 + BackstopJS 视觉回归 |

---

> *每个里程碑都是一颗恒星的诞生。轨道在前方延伸，下一站已在星图标注。*
