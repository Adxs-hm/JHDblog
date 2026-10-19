# v7 运行时验证：加载关键页面，抓控制台错误 + 检查运行时状态
import asyncio, json, sys
from playwright.async_api import async_playwright

PAGES = ["http://localhost:8080/", "http://localhost:8080/friends/",
         "http://localhost:8080/404.html", "http://localhost:8080/posts/jhd-site/"]

async def main():
    results = {}
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=["--no-sandbox"])
        page = await browser.new_page(viewport={"width": 1280, "height": 800})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        for url in PAGES:
            err0 = len(errors)
            await page.goto(url, wait_until="networkidle")
            await page.wait_for_timeout(1200)
            info = await page.evaluate("""() => {
                const d = document.documentElement;
                const canvas = document.querySelector('.trm-logo-canvas');
                return {
                    fx: d.dataset.fx || null,
                    theme: d.dataset.theme || null,
                    jsClass: d.classList.contains('js'),
                    revealIn: document.querySelectorAll('[data-reveal].is-in').length,
                    revealTotal: document.querySelectorAll('[data-reveal]').length,
                    logoCanvas: !!canvas,
                    canvasSize: canvas ? [canvas.width, canvas.height] : null,
                    sanity: !!document.querySelector('.trm-focus'),
                    scanline: !!document.querySelector('#trm-scanline'),
                    friendCards: document.querySelectorAll('.friend-card').length,
                    fxToggle: !!document.querySelector('.fx-toggle'),
                    navveil: !!document.querySelector('#ak-navveil'),
                    fontLoaded: document.fonts ? document.fonts.check('700 16px "Chakra Petch"') : null,
                    progressTrack: !!document.querySelector('.ak-progress-track'),
                    prtsLog: (document.querySelector('.prts-log')||{}).textContent || null
                };
            }""")
            new_errs = errors[err0:]
            results[url] = {"info": info, "errors": new_errs}
        await browser.close()
    print(json.dumps(results, ensure_ascii=False, indent=1))

asyncio.run(main())
