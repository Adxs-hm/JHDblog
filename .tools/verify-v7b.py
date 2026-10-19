# 深挖：文章页 404 资源定位 + 暗色主题验证 + 滚动后 reveal 验证
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    out = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--no-sandbox"])

        # 1) 文章页：抓失败请求的具体 URL
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        failed = []
        page.on("response", lambda r: failed.append((r.status, r.url)) if r.status >= 400 else None)
        await page.goto("http://localhost:8080/posts/jhd-site/", wait_until="networkidle")
        await page.wait_for_timeout(800)
        out["post_failed"] = failed

        # 2) 暗色主题（terminal）验证
        dark = await browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme="dark")
        await dark.goto("http://localhost:8080/", wait_until="networkidle")
        await dark.wait_for_timeout(500)
        out["dark_theme"] = await dark.evaluate("""() => ({
            theme: document.documentElement.dataset.theme,
            bg: getComputedStyle(document.body).backgroundColor,
            fg: getComputedStyle(document.body).color
        })""")

        # 3) 滚动后 reveal 是否触发 + 首页滚动态
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight * 0.4)")
        await page.wait_for_timeout(900)
        out["home_scrolled"] = await page.evaluate("""() => ({
            revealIn: document.querySelectorAll('[data-reveal].is-in').length,
            revealTotal: document.querySelectorAll('[data-reveal]').length,
            splitIn: (document.querySelector('.ak-split')||{}).className
        })""")
        # 首页 sanity/scanline 复检（需重新加载以应用修复——此处在旧页面上测，仅记录）
        out["sanity_scanline"] = await page.evaluate("""() => ({
            sanity: !!document.querySelector('.ak-sanity'),
            scanline: !!document.querySelector('#ak-scanline')
        })""")

        # 4) 重新加载首页验证 sanity/scanline 修复
        await page.goto("http://localhost:8080/", wait_until="networkidle")
        await page.wait_for_timeout(1000)
        out["home_after_fix"] = await page.evaluate("""() => ({
            sanity: !!document.querySelector('.ak-sanity'),
            scanline: !!document.querySelector('#ak-scanline'),
            sanityText: (document.querySelector('.ak-sanity')||{}).textContent
        })""")

        await browser.close()
    print(json.dumps(out, ensure_ascii=False, indent=1))

asyncio.run(main())
