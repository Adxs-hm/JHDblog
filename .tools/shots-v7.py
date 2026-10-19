# v7 视觉验证：截图关键页面（明/暗双主题）
import asyncio
from playwright.async_api import async_playwright

SHOTS = [
    ("http://localhost:8080/", "home-light", "light", 1280, 800),
    ("http://localhost:8080/", "home-dark", "dark", 1280, 800),
    ("http://localhost:8080/friends/", "friends-light", "light", 1280, 800),
    ("http://localhost:8080/friends/", "friends-dark", "dark", 1280, 800),
    ("http://localhost:8080/posts/jhd-site/", "post-light", "light", 1280, 800),
    ("http://localhost:8080/posts/jhd-site/", "post-dark", "dark", 1280, 800),
    ("http://localhost:8080/404.html", "404-light", "light", 1280, 800),
    ("http://localhost:8080/minesweeper/", "minesweeper-light", "light", 1280, 800),
    ("http://localhost:8080/", "home-mobile", "light", 390, 844),
]

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox"])
        for url, name, scheme, w, h in SHOTS:
            pg = await b.new_page(viewport={"width": w, "height": h}, color_scheme=scheme)
            await pg.goto(url, wait_until="networkidle")
            await pg.wait_for_timeout(1400)
            await pg.screenshot(path=f"D:/Desktop/AI工程/博客/文档/重构验证截图/v7-{name}.png", full_page=False)
            print("shot:", name)
            await pg.close()
        await b.close()

asyncio.run(main())
