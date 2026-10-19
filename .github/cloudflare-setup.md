# Cloudflare 配置清单（v7 上线时执行）

> GitHub Pages 自带全球 CDN 与 Brotli；前置 Cloudflare（免费档）补三件事：
> HTTP/3、精细缓存规则、安全响应头。以下为具体操作项。

## 1. DNS
- `adxs-hm.github.io` CNAME → `<user>.github.io`（Pages 自定义域场景）
- 代理状态：仅 DNS（灰云）亦可；Proxied（橙云）才能用缓存规则与 Workers，按需开启

## 2. Cache Rules（缓存规则）
| 规则 | 匹配 | 动作 |
|------|------|------|
| 静态资源长缓存 | `/JHDblog/js/*`, `/JHDblog/css/*`, `/JHDblog/fonts/*` | Eligible for cache · Browser TTL 1 年 · Edge TTL 1 个月 |
| 图片 | `/JHDblog/images/*`, `/JHDblog/posts/**/*.{jpg,png,webp,avif}` | Browser TTL 30 天 |
| HTML | `/JHDblog/*.html` 及目录页 | Browser TTL 0（或 Bypass，HTML 必须每次验证） |

> Hugo 产物文件名带内容哈希（`bundle.min.abc123.js`），静态资源可安全强缓存。

## 3. Speed（速度优化）
- 开启 Brotli（Pages 已默认支持，CF 侧确认 Tiered Cache 开启）
- 开启 HTTP/3 (QUIC)
- Early Hints：开启（CF 自动对 HTML 注入 103 响应）

## 4. Workers（响应头注入，替代 meta 方案的局限）
> meta 方式设置的 `X-Frame-Options` / `frame-ancestors` 浏览器支持不一，
> 且 CSP 无法覆盖 SW 与 Worker 注入的上下文。用一个 Worker 统一挂头：

```js
export default {
  async fetch(request) {
    const res = await fetch(request);
    const h = new Headers(res.headers);
    h.set('X-Content-Type-Options', 'nosniff');
    h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return new Response(res.body, res);
  }
};
```
> CSP 保留在 meta 中（含 giscus 的 style-src 放行）；SW 注册路径 `/JHDblog/sw.js` 加 Scope 例外。

## 5. 上线检查单
- [ ] 清一次缓存（Caching → Purge Everything），避免 v6 资源被旧节点长期serve
- [ ] 验证 `curl -sI https://adxs-hm.github.io/JHDblog/ | grep -i cache`
- [ ] 验证字体 200 + `cache-control: immutable`（Hugo 哈希文件名）
- [ ] PageSpeed Insights 移动档 LCP ≤ 1.5s
