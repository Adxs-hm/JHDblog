---
title: "JHD 站点"
date: 2026-06-30T12:36:13+08:00
description: "Hugo + PaperMod 深度定制个人站点——技术架构、设计系统与工程链路全档"
images: ["og/og-jhd-site.png"]
tags: ["网站", "Hugo", "GitHub Pages"]
categories: ["项目"]
flagship: true
stats: ["Hugo + PaperMod", "GitHub Actions", "GitHub Pages"]
draft: false
---

## 这个项目是什么

**JHD 站点**是一个基于 Hugo 静态站点生成器构建的站点，内容限于自身建造过程的记录。本页即为该站点的规格说明，随每次架构变更同步更新。

## 技术架构

### 构建与部署链路

```text
Markdown 文章 → Hugo 构建 → 纯 HTML/CSS/JS → GitHub Pages 托管
     ↑                ↑                                ↑
  本地编辑        <300ms 构建                    全球 CDN 分发
```

整个链路没有数据库、没有后端服务器、没有运行时依赖。从写完一篇文章到全世界可见，只需要 `git push`。GitHub Actions 承担三个独立任务：

| 工作流 | 触发 | 职责 |
|--------|------|------|
| `hugo-deploy.yml` | push main | 构建校验（体量门禁 50MB）→ 部署 gh-pages 分支 |
| `lighthouse.yml` | push main / 每周一 / 手动 | 性能门禁：3 个代表页 × 5 轮取中位数 |
| `codeql.yml` | push main / 每周一 | 代码安全扫描 |

### 技术选型理由

| 选型 | 理由 |
|------|------|
| **Hugo**（Go 语言） | 单二进制文件，构建 <300ms，不需要 Node.js 环境；CI 锁定 0.168.0 Extended |
| **PaperMod 主题** | 结构清晰、无构建期依赖；随仓库分发本地副本，定制层全部在项目 `layouts/` 覆盖 |
| **手写 CSS 设计令牌** | 单一 `custom.css` 源管理全部色彩/排版/组件，无 CSS 框架；主题核心样式之后加载，令牌同特异性覆盖 |
| **GitHub Pages** | 永久免费、自带 HTTPS、全球 CDN、与 Git 工作流无缝整合 |
| **GitHub Actions** | push 即部署，零手动操作；门禁与扫描同链路执行 |

### 技术栈

| 层级 | 技术 |
|------|------|
| 生成器 | Hugo 0.168.0 Extended（CI 锁定版本） |
| 模板引擎 | Go Templates + Hugo Pipes（资源指纹/压缩） |
| 脚本 | Vanilla JS（esbuild 分包 + minify + fingerprint，零运行时依赖） |
| 样式 | 手写 CSS 自定义属性体系，`@media print` 打印形态 |
| 内容格式 | Markdown (Goldmark) |
| 评论 | giscus（GitHub Discussions 驱动，IntersectionObserver 懒加载） |
| 搜索 | Fuse.js 客户端全文检索（主题内置 + 项目增强层） |

### 体积与传输

| 资源 | 原始 | gzip |
|------|------|------|
| 样式（单文件） | 64.7 KB | 13.3 KB |
| 交互主包（全站） | 11.1 KB | 4.6 KB |
| 404 游戏包（仅 404 页） | 5.6 KB | 2.7 KB |
| 扫雷脚本（仅游戏页） | 17.9 KB | 5.1 KB |
| 字体（4 个 woff2，latin 子集） | 60.5 KB | 同（woff2 不再压缩） |
| OG 分享图（5 张 PNG） | 165 KB | 同（仅 meta 引用，不随页面加载） |

全站产物 856 KB / 27 个 HTML 页面。中文正文走系统字体栈（PingFang SC / 微软雅黑），零下载；自托管字体只覆盖拉丁字符。

## 质量保障

### 性能门禁（Lighthouse CI）

移动节流档位（1.6Mbps / 150ms RTT / 4x CPU / 360×640）下，3 个代表页各跑 5 轮取中位数，断言不满足即 CI 失败：

| 指标 | 门限 | 实测中位数 |
|------|------|-----------|
| performance | ≥ 0.9 | 1.00（三页） |
| accessibility | ≥ 0.95 | 1.00（三页） |
| LCP | ≤ 2000ms | 1503 / 1503 / 1653ms |
| TBT | ≤ 200ms | 0 / 12 / 0ms |
| CLS | ≤ 0.05 | 0（三页） |

门禁数据源是 `hugo --minify` 产物 + gzip 静态服务器——测的是生产等价字节；`hugo server` 不压缩且注入 livereload 脚本，已弃用为数据源。

### 自动化测试

| 套件 | 覆盖 | 规模 |
|------|------|------|
| `.tools/verify.py` | 11 个页面 × 亮/暗双主题加载（零 console 错误、零 4xx 子资源）、运行时状态、搜索五功能、404 游戏、扫雷渲染、特效开关 | 63 断言 |
| `.tools/test-minesweeper.js` | 扫雷纯逻辑 core：首击安全区、插旗/问号、chord 门控、踩雷判负、自动标雷策略 | 19 断言 |

### 构建卫生

Hugo 构建输出零弃用告警（主题层两处 0.158 弃用项由项目级覆盖修正）；部署前校验产物体积（上限 50MB，当前 856KB）。

## 实用性体系

| 能力 | 实现 |
|------|------|
| 社交分享预览 | 每页独立 OG 分享卡（1200×630 PNG，构建时由 `.tools/gen-og.py` 生成，共 5 张）；补 `og:image:alt` / 宽高声明 / twitter:card |
| 长文深链引用 | 标题锚点 hover 显示金色 `#`（aria-label 满足 WCAG 2.5.3），`scroll-margin-top` 防吸顶裁剪 |
| 打印 / PDF 形态 | `@media print`：隐藏界面铬、外链 URL 括号展开、代码块强制浅色、分页保护、`@page` 页边距 |
| 时效信号 | `lastmod` 从 git 历史派生，meta 区显示「更新于」；og `article:modified_time` 同步 |
| 协作修正 | 每页 meta 区「编辑此页」链接指向 GitHub 源文件；仓库根目录 MIT LICENSE |
| 搜索增强 | 结果计数、标题匹配高亮、空态建议（档案入口）、清除按钮；与主题 Fuse 引擎解耦 |
| 版本史 | `/changelog/` 构建日志页：v4→v8.6 逐代记录，每条对应一次本地提交 |
| 阅读测量 | Cloudflare Web Analytics（零 Cookie）；`cfBeaconToken` 为空时 beacon 与 CSP 放行域同步关闭 |
| 订阅 | RSS 全文输出（仅载内容：档案 + 构建日志），`/subscribe/` 落地页 |

## 设计系统

### 色彩方案（TERMINAL v8 · 金/银，双主题）

| 用途 | 色值 | 说明 |
|------|------|------|
| 纸底 / 终端底 | `#f4f3ee` / `#06080a` | 双主题背景（light=档案纸白 · 主视觉，dark=终端黑 · 次级） |
| 主文字 | `#0d0f12` / `#eef2f4` | 墨黑 / 纸白 |
| 强调色 | `#a5824a` / `#c9a227` — 哑光金 | 链接、标签、高亮（仅图形） |
| 强调文字色 | `#7a5c1a` / `#c9a227` | 纸底用深金（5.7:1 · AA），深底用亮金（8.1:1 · AA） |
| 结构色 | `#cdd1d8` / `#1d252c` — 银 | 细线、HUD、元信息、边框、网点与网格 |
| 次要文字 | `#4c545c` / `#96a2ab` | 银灰，元信息 |
| 细线 | `#cdd1d8` / `#1d252c` | 1px 分隔线，零投影 |

### 排版层级

- 页面标题：Chakra Petch 700 / 宽字距
- 一级标题：左侧 4px 金色边杠；二级标题 3px
- 正文：系统中文栈，17px / 行高 1.8；正文测量宽 44em（中文 30–50 字/行），表格/代码破出满宽
- 元信息：JetBrains Mono（编号 / 状态 / 日期 / 数据）
- 标题平衡断行（`text-wrap: balance`），正文 `pretty`

### 页面骨架

宽容器 + 窄 Measure：主区 1072px（与导航边缘对齐），正文块限宽居中，代码/表格/图片可用满宽。侧栏目录在文章页常驻。

### 交互效果

- 项目卡片：hover 金色描边 + 套印错位框 + 角括号张开
- 入场：直角切入（clip-path 从左向右揭开）+ HUD 数字滚动
- 首页 Hero：粒子 Logo 场（Canvas 2D 文字采样，3000 粒硬上限，load 事件后才启动粒子循环，静态文字先绘做视觉桥接）
- 页面转场：View Transitions 直角揭页（Firefox 走网点遮罩兜底）
- 404 页：终端修复游戏（Canvas，60 秒修复度挑战）；扫雷页：GAME-01（自动标雷，不自动挖开）
- 特效四级门控：`data-fx` = full / lite / off / hc，按 save-data、网络制式、`prefers-reduced-motion` 首帧前决策，页脚开关可循环切换并持久化

## 开发历程

站点经历了四个设计系统代际与两轮工程化扩建，完整逐代记录见[构建日志](../changelog/)。

| 代 | 主题 | 要点 |
|----|------|------|
| v4 | Deep Space Archive | Hugo 初始化，首个全站设计系统（2026-07） |
| v5 | 深空编年史 | 暗色深空 + 金星金，首页 Bento 编排（2026-10-18） |
| v6 | Silver Archive 白银档案 | 浅色纸底 + 银灰细线 + 哑光金，血统语言定型（2026-10-18） |
| v7 | TERMINAL | 纯黑/纸白双主题 + 单一强调；全站去第三方 IP 化；文案改为冰冷陈述体（2026-10-19） |
| v8 | 金/银 · 纸白主导 | 金属色系替换青蓝，纸白升为主视觉；交互层零依赖分包（2026-10-20） |
| v8.1–v8.6 | 工程化扩建 | CI 门禁修复与宽度重构；实用性体系（OG/锚点/打印/日志页）；测试套件重建；发布前终检（2026-10-20 至 24） |

### 工程约束（本次扩建中确认）

- **PaperMod 的 `partialCached` footer 变体键不含页面身份**——同 Layout/Kind 的页面会共用首个渲染页的 footer 输出，按页条件渲染的内容被污染（曾致全部文章页误载扫雷脚本）。项目级 `baseof.html` 覆盖并追加 `.File.UniqueID` 变体键
- **字体预载不可省**：JetBrains Mono 迟加载会触发 fallback→webfont swap，实测产生 CLS 0.27
- **minify 产物无属性引号**：验证脚本的匹配模式不能假设引号存在
- **本地构建必须带 `--baseURL http://localhost:8080/`**：默认 baseURL 下资源走 `/JHDblog/` 前缀，本地服务全部 404
- **Hugo `js.Build` 不支持 esbuild splitting**：动态 import 的岛屿代码内联主包；代码拆分属 `js.Batch` 职责

## 文件结构

```text
JHDblog/
├── hugo.toml                  # 站点配置（菜单 5 项 / 输出格式 / Fuse 参数）
├── LICENSE                    # MIT
├── assets/
│   ├── css/extended/custom.css        # TERMINAL v8 设计系统（唯一样式源）
│   └── js/
│       ├── main.js                    # 核心入口（零依赖：reveal/计数/逐字/扫描线/徽章/专注度）
│       ├── game-entry.js              # 404 游戏入口
│       ├── islands/                   # particle-logo / scanline / badges / focus
│       └── games/terminal-recovery.js # 404 终端修复游戏
├── content/
│   ├── _index.md              # 首页（Hero + Bento + 档案索引条 + 订阅条）
│   ├── about/_index.md        # 关于页：站点参数表 + 运行计时器
│   ├── archives.md            # 归档页
│   ├── changelog.md           # 构建日志（v4→v8.12 版本史，条目即内容）
│   ├── search.md              # 搜索页
│   ├── start-here/_index.md   # 档案索引（阅读路径）
│   ├── subscribe.md           # 订阅落地页
│   ├── minesweeper.md         # 扫雷游戏页
│   └── posts/                 # 唯一内容区：只收录本站自身
│       ├── jhd-site/          #   本页（旗舰档案）
│       └── site-launch/       #   上线记录
├── layouts/
│   ├── baseof.html            # 项目覆盖：footer 缓存变体键追加页面身份
│   ├── index.html / 404.html / search.html
│   ├── _default/changelog.html
│   ├── _markup/render-codeblock.html
│   ├── rss.xml                # 项目覆盖：弃用项修正
│   └── partials/              # anchored_headings / post_meta / comments /
│                               # cover / extend_head / extend_footer / templates
├── static/
│   ├── fonts/                 # 自托管 woff2 latin 子集 ×4
│   ├── images/planet-avatar.svg + icon-192/512.png   # 头像 + PWA 图标
│   ├── og/                    # OG 分享图 PNG ×5
│   ├── manifest.json / sw.js  # PWA（PNG 图标满足安装性）
├── .tools/                    # 本地工具：gen-og.py / verify.py / shots.py /
│                               # test-minesweeper.js / ci-static-server.js
├── .github/
│   ├── workflows/             # 部署 + Lighthouse 门禁 + CodeQL
│   ├── lighthouserc.json      # 门禁断言即预算
│   └── cloudflare-setup.md    # 边缘网络 + Web Analytics 配置清单
└── themes/PaperMod/           # 主题（本地副本，随仓库分发）
```

## 后续规划

### 短期
- [ ] 自定义域名绑定（当前 `adxs-hm.github.io/JHDblog/`）
- [ ] 启用 Cloudflare Web Analytics（token 填入 `hugo.toml`，链路已就绪）

### 中期
- [ ] 色彩体系迁移 OKLCH（v8.x 演进项，当前为 hex 令牌）

### 已完成（原规划项）
- [x] RSS 全文输出 · 站内搜索增强 · 深色/浅色双主题独立配色（v8 系列落地）
- [x] CSS 滚动驱动动画替代滚动监听管线（v8.12，Baseline 2026 + JS 管线回退）

### 远期（评估中，未排期）
- [ ] Pagefind 替换 Fuse（内容 ≥100 篇的阈值触发）
- [ ] Astro 2.0 迁移评估（仓库内存有实验分支，无排期）

## 完成时间

**2026 年 6 月 30 日**（首次上线）  
持续迭代中，当前版本 v8.12。逐代记录见[构建日志](../changelog/)。
