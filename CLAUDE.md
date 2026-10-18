# JHD 个人博客 — AI Agent 上下文

## 项目速览

- Hugo + PaperMod 静态博客，部署于 GitHub Pages
- 仓库: `Adxs-hm/JHDblog`
- URL: `https://adxs-hm.github.io/JHDblog/`
- 设计系统: Deep Space Chronicle v5（深空编年史）——单一金色强调 + 衬线展示 + Bento 层级 + 背景仅两层

## 关键文件

| 需求 | 文件 |
|------|------|
| 站点配置 | `hugo.toml` |
| 自定义样式 | `assets/css/extended/custom.css`（深空编年史 v5） |
| 首页布局 | `layouts/index.html`（Hero → 设定 Bento → 项目 Bento → 文章 → 订阅） |
| 首页 Hero | `content/_index.md` |
| 字体/CSP/JSON-LD | `layouts/partials/extend_head.html` |
| JS 特效 | `layouts/partials/extend_footer.html`（Ctrl+K + TOC 跟踪 + 入场动画 + webmention） |
| 系列导航 | `layouts/partials/extend_post_content.html`（按 front matter `series` 串联） |
| 评论 | `layouts/partials/comments.html`（giscus，仅文章页） |
| 新文章 | `content/posts|articles|lore/项目名/index.md` |
| 导航菜单 | `hugo.toml` § `menu.main`（项目/设定/文章/关于/搜索） |

## 内容分区约定

| Section | 用途 | 收录标准 |
|---------|------|---------|
| `posts/` | 项目——工程成品 | 工具、Mod、站点本身 |
| `lore/` | 设定——原创世界观 | 完成态世界构建文档，按 `series` 组织 |
| `articles/` | 文章——战报与随笔 | 轻量、时效性内容 |

- `series: "CLPS 宇宙"` + `weight` → 文章页显示系列导航
- `flagship: true` → 首页旗舰大卡（跨列 + `stats` 数据点）；全站仅设一个
- `draft: true` → 草稿，本地可见，线上不可见

## 构建与预览

- 本地预览: `hugo server -D`
- 部署: push main → GitHub Actions → gh-pages 分支 → GitHub Pages
- CSS 修改后需删除 `resources/` 和 `public/` 目录后重建
- 本地 Hugo Extended 二进制在仓库外 `.tools/hugo.exe`（版本 0.168.0），用于构建验证：
  `/d/Desktop/AI工程/博客/.tools/hugo.exe --minify`

## 设计纪律（v5，勿回退）

- 背景只有两层：静态星场 + 星轨光带；不要再加天体/流星/暗角/追踪光效
- 强调色只有金色 `#c9b26a`；紫色已废弃
- 动效只允许：头像呼吸、hover 位移、入场渐隐，且必须尊重 prefers-reduced-motion
- 阴影禁用（头像辉光例外）；层次用 hairline 边框表达
- 首页不放评论区；数字必须真实（过期数字 = 疏漏信号）
