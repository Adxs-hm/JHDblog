"""JHD 全站截图工具（v8.5 重写，替代原 shots-v7.py）

用法：构建 + 起本地服务后执行
    hugo --minify --baseURL http://localhost:8080/ && python -m http.server 8080 --directory public
    python .tools/shots.py
输出：文档/重构验证截图/shot-<名称>.png
"""
import pathlib

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8080"
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / "文档" / "重构验证截图"

# (路径, 名称, 主题, 宽, 高)
SHOTS = [
    ("/", "home-light", "light", 1440, 900),
    ("/", "home-dark", "dark", 1440, 900),
    ("/posts/jhd-site/", "post-light", "light", 1440, 900),
    ("/posts/jhd-site/", "post-dark", "dark", 1440, 900),
    ("/changelog/", "changelog-light", "light", 1440, 900),
    ("/changelog/", "changelog-dark", "dark", 1440, 900),
    ("/about/", "about-light", "light", 1440, 900),
    ("/archives/", "archives-light", "light", 1440, 900),
    ("/start-here/", "start-here-light", "light", 1440, 900),
    ("/subscribe/", "subscribe-light", "light", 1440, 900),
    ("/minesweeper/", "minesweeper-light", "light", 1440, 900),
    ("/404.html", "404-light", "light", 1440, 900),
    ("/", "home-mobile", "light", 390, 844),
    ("/posts/jhd-site/", "post-mobile", "light", 390, 844),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])
        for path, name, scheme, w, h in SHOTS:
            page = browser.new_page(
                viewport={"width": w, "height": h}, color_scheme=scheme,
                device_scale_factor=2 if w < 500 else 1,
            )
            page.goto(BASE + path, wait_until="networkidle")
            page.wait_for_timeout(1600)
            page.screenshot(path=str(OUT / f"shot-{name}.png"))
            print("shot:", name)
            page.close()
        browser.close()
    print("done ->", OUT)


if __name__ == "__main__":
    main()
