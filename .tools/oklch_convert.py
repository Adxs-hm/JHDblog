"""hex → oklch 精确转换器（OKLab 标准矩阵，Björn Ottosson 规范）

转换后回程（oklch → sRGB）误差必须 ≤ 1/255，保证像素级等价。
用法：python .tools/oklch_convert.py   （打印对照表 + 生成替换块）
"""
import math

def srgb_to_linear(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def linear_to_srgb(c):
    c = c * 12.92 if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055
    return max(0, min(255, round(c * 255)))

def hex_to_oklch(hx):
    r = srgb_to_linear(int(hx[1:3], 16))
    g = srgb_to_linear(int(hx[3:5], 16))
    b = srgb_to_linear(int(hx[5:7], 16))
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_ = l ** (1 / 3); m_ = m ** (1 / 3); s_ = s ** (1 / 3)
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    aa = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    C = math.hypot(aa, bb)
    H = math.degrees(math.atan2(bb, aa)) % 360
    return L * 100, C, H

def oklch_to_hex(L, C, H):
    L = L / 100.0  # 入参为百分数
    h = math.radians(H)
    aa, bb = C * math.cos(h), C * math.sin(h)
    l_ = L + 0.3963377774 * aa + 0.2158037573 * bb
    m_ = L - 0.1055613458 * aa - 0.0638541728 * bb
    s_ = L - 0.0894841775 * aa - 1.2914855480 * bb
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return "#{:02x}{:02x}{:02x}".format(linear_to_srgb(r), linear_to_srgb(g), linear_to_srgb(b))

TOKENS = {
    "TERMINAL": ["#06080a", "#0b0f13", "#eef2f4", "#96a2ab", "#1d252c", "#c9a227",
                 "#8a6d1f", "#f5b800", "#ff4d5e", "#0d1117"],
    "ARCHIVE": ["#f4f3ee", "#fbfaf6", "#0d0f12", "#4c545c", "#cdd1d8", "#a5824a",
                "#8a6d1f", "#7a5c1a", "#f5b800", "#8a6100", "#c2253a",
                "#f6f5f0", "#efece3", "#26282e", "#3f6b4f", "#8f959e", "#3d4750",
                "#8a6100", "#a6a9b0", "#f6f5f0"],
}

if __name__ == "__main__":
    worst = 0.0
    for theme, hexes in TOKENS.items():
        print(f"── {theme} ──")
        for hx in hexes:
            L, C, H = hex_to_oklch(hx)
            out = f"oklch({L:.2f}% {C:.4f} {H:.2f})"
            back = oklch_to_hex(L, C, H)
            # 回程误差（逐通道）
            d = max(abs(int(back[1:3], 16) - int(hx[1:3], 16)),
                    abs(int(back[3:5], 16) - int(hx[3:5], 16)),
                    abs(int(back[5:7], 16) - int(hx[5:7], 16)))
            worst = max(worst, d)
            mark = "OK " if d <= 1 else "OFF"
            print(f"  {hx} → {out:34s} 回程 {back} Δ{d} {mark}")
    print(f"\n最大回程误差: {worst}/255（≤1 即像素级等价）")
