# JHD 个人博客 — AI Agent 上下文

## 项目速览

- Hugo + PaperMod 静态博客，部署于 GitHub Pages
- 仓库: `Adxs-hm/JHDblog`
- URL: `https://adxs-hm.github.io/JHDblog/`

## 关键文件

| 需求 | 文件 |
|------|------|
| 站点配置 | `hugo.toml` |
| 自定义样式 | `assets/css/extended/custom.css`（深空设计系统） |
| 首页 Hero | `content/_index.md`（轨道环头像 + 金属标题） |
| JS 特效 | `layouts/partials/extend_footer.html`（光影追踪 + 滚动入场 + webmention） |
| Head 注入 | `layouts/partials/extend_head.html`（JSON-LD + webmention link） |
| 评论 | `layouts/partials/comments.html`（giscus） |
| 新文章 | `content/posts/项目名/index.md` |
| 导航菜单 | `hugo.toml` § `menu.main` |

## 构建与预览

- 本地预览: 双击 `dev.ps1` 或 `hugo server -D`
- 部署: push main → GitHub Actions → gh-pages 分支 → GitHub Pages
- CSS 修改后需删除 `resources/` 和 `public/` 目录后重建

## 内容约定

- 所有文章在 `content/posts/` 下，每篇一个子目录
- `draft: true` → 草稿，本地可见，线上不可见
- 分类: `项目` 或 `记录`
- 封面图: `cover.image: "cover.png"`（放在文章子目录）
