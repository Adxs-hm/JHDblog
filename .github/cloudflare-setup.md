# Cloudflare 配置清单（v8 上线时执行）
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

## 6. Web Analytics（v8.3 接线，免 CDN 前置）

Cloudflare Web Analytics 是独立于 CDN 的免费产品：**不需要把站点前置到
Cloudflare**，github.io 域名亦可，只需在页面加一段 beacon 脚本。零 Cookie、
无个人数据、不设 cross-site 标识，与本站隐私姿态一致。

操作步骤：

1. 登录 Cloudflare Dashboard → 左侧 **Analytics & Logs → Web Analytics**
2. **Add a site**：主机名填 `adxs-hm.github.io`（无需改 DNS，仅用于报表归类）
3. 复制生成的 beacon token（形如 `a1b2c3d4e5f6...` 的一串十六进制）
4. 填入 `hugo.toml`：
   ```toml
   [params.analytics]
     cfBeaconToken = "粘贴token"
   ```
5. 提交并推送。构建时：
   - token 非空 → 全站 `<head>` 注入 beacon 脚本，CSP 自动放行
     `static.cloudflareinsights.com`（script-src）与 `cloudflareinsights.com`（connect-src）
   - token 为空 → 不渲染 beacon，CSP 亦不放行对应域名（两者由同一开关联动，
     不存在「配置删了但 CSP 仍放行」的残留）

6. 数据出现在 CF Dashboard 的 Web Analytics 报表（pageviews / 访问来源 /
    Top 页面 / Core Web Vitals 真实用户数据）。

> 说明：beacon 脚本约 12KB、defer 加载、异步上报，对 LCP/TBT 无实质影响
> （LHCI 门禁的 TBT 断言已涵盖此类成本）。若未来不再需要，把 token 改回
> `""` 并推送即可全站摘除。
