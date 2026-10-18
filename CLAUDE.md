# JHD 个人博客 — AI Agent 上下文

## 项目速览

- Hugo + PaperMod 静态博客，部署于 GitHub Pages
- 仓库: `Adxs-hm/JHDblog`
- URL: `https://adxs-hm.github.io/JHDblog/`
- 设计系统: Silver Archive v6（白银档案）——浅色米白纸底 + 单一哑光金 + JetBrains Mono HUD 语言；血统为明日方舟 UI（网点纸/套印错位/编号档案/警戒条纹）
- **内容定位**：只收录站点自身的构建档案（jhd-site 旗舰 + site-launch），其他内容已全部删除

## 关键文件

| 需求 | 文件 |
|------|------|
| 站点配置 | `hugo.toml`（defaultTheme=light，菜单：项目/关于/搜索） |
| 自定义样式 | `assets/css/extended/custom.css`（白银档案 v6） |
| 首页布局 | `layouts/index.html`（Hero → 项目 Bento → 索引条 → 订阅） |
| 首页 Hero | `content/_index.md` |
| 字体/CSP/JSON-LD | `layouts/partials/extend_head.html` |
| JS 特效 | `layouts/partials/extend_footer.html`（Ctrl+K + TOC 跟踪 + 入场动画 + 页脚 HUD + webmention） |
| 评论 | `layouts/partials/comments.html`（giscus，仅文章页） |
| 新文章 | `content/posts/项目名/index.md` |
| 导航菜单 | `hugo.toml` § `menu.main` |

## 内容约定

- `posts/` 目前只放站点自身档案；新增项目也放这里
- `flagship: true` → 首页旗舰大卡（金边 + mono 数据行）；全站仅设一个
- `draft: true` → 草稿，本地可见，线上不可见

## 构建与预览

- 本地预览: `hugo server -D`
- 部署: push main → GitHub Actions → gh-pages 分支 → GitHub Pages
- 本地 Hugo Extended 二进制：`D:/Desktop/AI工程/博客/.tools/hugo.exe`（0.168.0），构建验证：
  `/d/Desktop/AI工程/博客/.tools/hugo.exe --minify`

## 设计纪律（v6，勿回退）

- 浅色纸底 + 单一哑光金；**不要再加暗色/紫色/第二强调色**
- 背景只有两层：半调网点 + 图纸网格；不要再加天体/流星/辉光/暗角
- 阴影禁用；层级靠 1px 银灰细线；直角贯穿（头像/标签胶囊例外）
- 动效仅白名单：hover 套印框、入场渐隐，必须尊重 prefers-reduced-motion
- 全站元信息走 JetBrains Mono；标题 Noto Sans SC 900
- 首页数字/HUD 文案必须真实（BUILD v6 等与实现同步）
