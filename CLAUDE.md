# JHD 个人博客 — AI Agent 上下文

## 项目速览

- Hugo + PaperMod 静态博客，部署于 GitHub Pages
- 仓库: `Adxs-hm/JHDblog`
- URL: `https://adxs-hm.github.io/JHDblog/`
- 设计系统: **TERMINAL v8（终端 · 金/银）**——纸白/纯黑对撞 + 单一哑光金强调 + 银色结构 + 直角 + 拉丁大写 + 等宽 HUD；工业终端美学 × 贵金属档案（半调网点/套印错位/编号档案/警戒条纹）。双主题：无属性/`light`=ARCHIVE 档案纸白（**主视觉**），`data-theme="dark"`=TERMINAL 终端黑（次级）。金属分工：金=唯一强调色（`--accent`/`--accent-ink`），银=结构色（`--line`/`--fg-dim`/`--halftone`/`--grid`，不算第二强调）。PaperMod `defaultTheme="light"` 原生机制，localStorage 键 `pref-theme`
- **内容定位**：只收录站点自身的构建档案（jhd-site 旗舰 + site-launch），其他内容已全部删除
- 升级研究报告：`../文档/JHD博客v7罗德岛终端-升级研究报告.md`（v6→v7 决策全文，本地文档）
- **友链功能已下线**（2026-10-19）：未经站长同意不收录第三方站点。layout/island/分包代码均已移除；未来获得授权后可从 git 历史（commit 23e26a1）恢复 `layouts/_default/friends.html` + `assets/js/islands/friends.js` + `data/friends.yml`

## 关键文件

| 需求 | 文件 |
|------|------|
| 站点配置 | `hugo.toml`（defaultTheme=light · 纸白主导，菜单：项目/关于/搜索/游戏） |
| 设计系统 | `assets/css/extended/custom.css`（v8 金/银 tokens + 组件 + 双主题 chroma + 降级门控） |
| 首页布局 | `layouts/index.html`（Hero → 项目 Bento → 索引条 → 订阅） |
| 首页 Hero | `content/_index.md`（含 `data-island="particle-logo"` 粒子场） |
| 404 页 | `layouts/404.html`（终端修复游戏，`data-island="rec-game"`） |
| 字体/CSP/系统脚本 | `layouts/partials/extend_head.html`（自托管 woff2 子集 + data-fx 决策 + JSON-LD） |
| 交互层入口 | `layouts/partials/extend_footer.html`（js.Build 按页分包 + Ctrl+K/TOC/复制/webmention） |
| 核心 JS | `assets/js/main.js`（零依赖：FX 门控/岛屿加载/reveal/计数/逐字/转场兜底/特效开关） |
| 岛屿模块 | `assets/js/islands/{particle-logo,scanline,badges,focus}.js` |
| 游戏 | `assets/js/games/terminal-recovery.js`（入口 `assets/js/game-entry.js`，仅 404） |
| 字体 | `static/fonts/`：Chakra Petch 静态三档 + JetBrains Mono 可变字体单文件（wght 400–800） |
| 封面图管线 | `layouts/partials/cover.html`（AVIF/WebP picture + srcset + LQIP + fetchpriority） |
| 性能预算 | `.github/lighthouserc.json`（断言即预算）+ `.github/workflows/lighthouse.yml` + `.tools/ci-static-server.js`（gzip 数据源） |
| Cloudflare 配置 | `.github/cloudflare-setup.md` |
| 评论 | `layouts/partials/comments.html`（giscus，仅文章页；IO 懒加载，滚动至评论区前 400px 才注入） |
| 新文章 | `content/posts/项目名/index.md` |

## 技术架构（v7 2026-10-19 落地 → v8 2026-10-20 金/银换血）

- **两 JS 分包**（`js.Build (dict "minify" true) "js/xxx.js"` + fingerprint，defer）：
  `bundle.js` 全站核心 9.7KB（零依赖）；`game.js` 仅 404 页（终端修复游戏 5.6KB）。无第三方运行时依赖（GSAP vendor 已于 2026-10-19 删除，见 git 历史 23e26a1；CI 无 npm 步骤）
- **FX 四级门控** `data-fx`：full/lite/off/hc。head 内联脚本首帧前决策（save-data、2g/3g、prefers-reduced-motion → lite）；页脚 `.fx-toggle` 循环切换并持久化 `jhd:fx`；off 档 main.js 只挂开关不 boot（不加 `.js` 类，内容不预隐藏）
- **reveal 用滚动几何管线**（getBoundingClientRect），**禁用 IO 触发 [data-reveal]**——clip-path 初始态会把 IO 交叠矩形裁成零面积（ratio 0 永不过阈值，已踩坑）
- **PaperMod 特异性坑**：`:root[data-theme="dark"]` 为 (0,2,0)，我的令牌块必须同特异性且后加载（extended 在 core 后）；`.list` 类首页 body 会被 PaperMod 用 `--code-bg` 做底，已用 `.list{background:var(--bg)}` 覆盖
- **文字强调色双 token**：`--accent` 仅图形；`--accent-ink` 做文字（archive 档 #7a5c1a 对纸白 5.7:1，terminal 档 #c9a227 对纯黑 8.1:1）
- **粒子/扫描线 30fps 限帧 + requestIdleCallback 启动 + 批量 path fill**；lite/off 档粒子场退化为 CSS 静态字
- **页面骨架（宽容器 + 窄 Measure）**：`--main-width:1024`（main=1072px，与 `--nav-width` 对齐消除宽度断层）；`.post-content > p/ul/ol/blockquote/h1-h6` 限宽 `44em` 居中（中文 30–50 字/行），表格/代码/图片破出满宽
- **粒子场内存纪律**：Float32Array 粒子状态（无 per-particle 对象分配，规避 major GC 长任务）+ 3000 硬帽 + 半分辨率离屏采样（getImageData -75%）+ 离屏画布复用 + 静态文字先绘
- **LHCI 数据源是 `hugo --minify` 产物 + `.tools/ci-static-server.js`（node 内置模块 gzip）**——hugo server 不压缩且注入 78KB livereload，测出的不是生产字节（已弃用）；门禁：perf≥0.9 / a11y≥0.95 / LCP≤2000ms / TBT≤200ms / CLS≤0.05（移动节流 4x CPU）
- **字体双预载均为必需**：Mono 迟加载会触发 fallback→webfont swap 产生 CLS 0.27（实测），预载即防抖；勿为省带宽去掉
- 类名前缀：`.trm-`（终端组件）/ `.rec-`（404 游戏）/ `.ms-`（扫雷）；**禁用任何 IP 关联命名**
- SW：`static/sw.js`（jhd-v8，导航 network-first，静态 cache-first，第三方不拦截）
- 验证工具：`.tools/verify-v7*.py`（Playwright 冒烟/交互/截图）；本地预览 `python -m http.server 8080 --directory public`（**8081 会被环境代理拦截**）

## 内容约定

- `posts/` 目前只放站点自身档案；新增项目也放这里
- `flagship: true` → 首页旗舰大卡（青边 + mono 数据行）；全站仅设一个
- `draft: true` → 草稿，本地可见，线上不可见

## 构建与预览

- 本地预览: `hugo server -D`（带 gzip）；或 `hugo --minify --baseURL http://localhost:8080/` + `python -m http.server 8080 --directory public`
- 部署: push main → GitHub Actions → gh-pages 分支 → GitHub Pages
- 本地 Hugo Extended 二进制：`D:/Desktop/AI工程/博客/.tools/hugo.exe`（0.168.0），构建验证：`/d/Desktop/AI工程/博客/.tools/hugo.exe --minify`
- **推送方式**：用户用 GitHub 桌面版推送，agent 只做本地 commit

## 设计纪律（v8 · 金/银，勿回退）

- 纸白/纯黑 + 单一哑光金强调 + 银色结构（银=结构色，不算第二强调）；禁止紫色/第三色系；直角贯穿（头像/标签胶囊例外）；阴影禁用
- 背景只有两层：半调网点 + 图纸网格；禁止天体/流星/辉光/暗角
- 动效挂 `data-fx` 门控 + `prefers-reduced-motion` 降级链，二者缺一不可
- 元信息走 JetBrains Mono；拉丁大字 Chakra Petch；**中文走系统栈（PingFang/雅黑），不走 webfont**
- 首页数字/HUD 文案必须真实（BUILD v8 / REC 02 / SINCE 与实现同步）
- **全站（含代码标识符/类名/注释）禁止出现任何第三方 IP 直指名称**——设计只取语言，不挂名
- 未经同意不收录第三方站点信息（友链下线教训）

## 演进阈值（记录备用，不急着做）

- **搜索**：Fuse.js 舒适区 ~500 页。内容 ≥100 篇或 index.json gz >300KB 时切 Pagefind（Rust→WASM 分片索引，post-build 一步接入）
- **WCAG 2.2 AA**：法定基准（EAA 2025-06 起 / ADA）。扫雷格子 17px < 2.5.8 的 24px 属游戏核心目标（Essential exception 论证范围），已记录备审；新增交互需过 2.4.11 Focus Not Obscured
- **OKLCH 迁移**：色彩函数已 Baseline，hex 体系稳定后可迁 oklch（需全量视觉回归）
- **优化研究报告**：`../文档/JHD架构优化研究报告-v7.1.md`（P1/P2 排期：CSS 滚动驱动动画替换 scrollFire、chroma 官方板、@layer、OG 图构建时生成、Cloudflare Web Analytics）

## 已知坑（2026-10-20 更新）

- **PaperMod baseof 的 `partialCached "footer.html"` 变体键不含页面身份**——主题原版以 `.Layout/.Kind/hideFooter/ShowCodeCopyButtons` 为键，同键页面共用首个渲染页的 footer 输出：`extend_footer.html` 内任何按页条件渲染的内容会被污染（曾致全部文章页误载 minesweeper.js 5.3KB 死载）。项目级 `layouts/baseof.html` 已覆盖并追加 `.File.UniqueID` 变体键；**今后 extend_footer 内新增按页内容前，先确认该键仍在**
- **markdown 正文里 `{{ }}` 不执行**（goldmark 非模板）——页面级模板逻辑必须放 layouts（自定义 layout 页的 md 只留 front matter）
- `js.Build` 的输出路径是 options 字典里的 `targetPath` 键，**不是位置参数**（位置参数会被当成 esbuild 语言 target 报 "unsupported target"）
- `{{ .Site.Params.author } },` 这类单 `}` 会触发 Go 模板 "unexpected } in operand"——JSON-LD 内嵌模板值注意 `}}` 配对
- `.Site.Data` 已废弃（0.156+），用 `hugo.Data`
- PaperMod head.html 的内联脚本会在首帧前应用 pref-theme（`defaultTheme="light"` → 纸白默认呈现，系统黑偏好用户仍得终端黑），与 v8 CSS 映射天然兼容，**不要**再写自己的 theme 预绘制脚本
- 主题自带 Catppuccin chroma 代码高亮板静态不随主题切换；custom.css 的 `.code-block-body .chroma` 双主题板（TERMINAL 金板 + ARCHIVE 纸面深金板）是覆盖实现，改代码块样式时勿删
