"""OG 分享图生成器（构建时一次性生成，PNG 随仓库提交）

背景：社交平台（X/LinkedIn/Slack/iMessage）的 OG 抓取器不支持 SVG，
      本站原 og:image 指向 planet-avatar.svg 实际不显示；须用 PNG。
规范：1200×630、每页独立卡、静态调色板（分享预览是一次性对外形象）。

依赖：本机已装的 Playwright + Chromium（与 .tools/verify-*.py 同环境），
      无需 npm。拉丁展示字用站点自托管 woff2（.tools/og-card.html 内引用），
      CJK 走系统栈（Microsoft YaHei / PingFang SC），与站点正文一致。

用法：在 JHDblog/ 目录下运行
    python .tools/gen-og.py
内容变更（标题/描述/版本号）后重跑本脚本并提交新 PNG。
"""

import pathlib

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
TPL = ROOT / ".tools" / "og-card.html"
OUT = ROOT / "static" / "og"

# 单一数据源：改标题/描述只改这里
CARDS = [
    {"id": "og-home", "file": "og-home.png", "kicker": "JHD // TERMINAL v8",
     "title": "JHD · 终端", "desc": "本站建造过程的完整档案",
     "meta": "RECORD OF CONSTRUCTION"},
    {"id": "og-jhd-site", "file": "og-jhd-site.png", "kicker": "PROJECT · 旗舰档案",
     "title": "JHD 站点",
     "desc": "Hugo + PaperMod 深度定制个人站点——技术架构、设计系统与工程链路全档",
     "meta": "2026-06-30"},
    {"id": "og-site-launch", "file": "og-site-launch.png", "kicker": "RECORD · 上线记录",
     "title": "JHD 站点正式上线", "desc": "本站从零到一的完整上线记录",
     "meta": "2026-06-30"},
    {"id": "og-default", "file": "og-default.png", "kicker": "JHD // TERMINAL v8",
     "title": "JHD · 终端", "desc": "一座只归档自身建造过程的个人站",
     "meta": "ARCHIVE"},
]


def main() -> None:
    OUT.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1280, "height": 640}, device_scale_factor=1)
        page.goto(TPL.as_uri())
        for card in CARDS:
            page.evaluate(
                """(c) => {
                const el = document.getElementById(c.id);
                el.querySelector('.og-kicker').textContent = c.kicker;
                el.querySelector('.og-title').textContent = c.title;
                el.querySelector('.og-desc').textContent = c.desc;
                el.querySelector('.f-meta').textContent = c.meta;
                }""",
                card,
            )
        # 等 webfont 就绪再截图（CJK 系统字立即可用）
        page.evaluate("document.fonts.ready.then(() => true)")
        page.wait_for_timeout(400)
        for card in CARDS:
            el = page.locator("#" + card["id"])
            el.screenshot(path=str(OUT / card["file"]))
            print("generated:", card["file"])
        browser.close()
    print("done ->", OUT)


if __name__ == "__main__":
    main()
