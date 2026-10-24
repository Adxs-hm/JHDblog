"""PWA 图标生成器（v8.8）：从行星头像 SVG 栅格化 PNG 图标

背景：Chrome 的 PWA 安装性要求至少一个 ≥192px 的 PNG 图标
（SVG 不计入）——原 manifest 仅含 SVG，实际无法安装。

生成：static/images/icon-192.png 与 icon-512.png
渲染：纸白底 + 行星头像 84% 居中（兼顾 any 与 maskable 两种用途的安全区）

运行：python .tools/gen-icons.py
"""
import pathlib

from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
SVG = ROOT / "static" / "images" / "planet-avatar.svg"
OUT = ROOT / "static" / "images"
PAPER = "#f4f3ee"
SCALE = 0.84  # 头像占画布比例（maskable 安全区）


def main():
    svg_text = SVG.read_text(encoding="utf-8")
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])
        for size in (192, 512):
            page = browser.new_page(
                viewport={"width": size, "height": size}, device_scale_factor=1
            )
            inner = int(size * SCALE)
            page.set_content(
                f"""<!DOCTYPE html><html><head><style>
                html,body{{margin:0;width:{size}px;height:{size}px;background:{PAPER};
                  display:flex;align-items:center;justify-content:center}}
                svg{{width:{inner}px;height:{inner}px}}
                </style></head><body>{svg_text}</body></html>"""
            )
            page.wait_for_timeout(300)
            page.screenshot(path=str(OUT / f"icon-{size}.png"))
            print("generated:", f"icon-{size}.png")
            page.close()
        browser.close()
    print("done ->", OUT)


if __name__ == "__main__":
    main()
