"""JHD 全站冒烟验证（v8.5 重写，合并原 verify-v7/b/c 三脚本）

覆盖：
  1. 九个页面在亮/暗双主题下加载，零 console/page 错误、零 404 子资源
  2. 运行时状态：字体就绪、FX 档位、粒子场绘制、滚动 reveal
  3. 搜索页：计数 / 高亮 / 键盘导航 / 空态 / 清除复位
  4. 404 游戏：开始按钮 + HUD 计时
  5. 扫雷页：棋盘渲染 + 脚本加载
  6. 特效开关：循环切换 + localStorage 持久化

运行：先构建并起本地服务，再执行
    hugo --minify --baseURL http://localhost:8080/ && python -m http.server 8080 --directory public
    python .tools/verify.py
"""
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8080"
PAGES = [
    "/", "/posts/jhd-site/", "/posts/site-launch/", "/changelog/",
    "/about/", "/start-here/", "/archives/", "/search/", "/subscribe/",
    "/minesweeper/", "/404.html",
]

passed, failed = 0, 0


def check(name, ok, detail=""):
    global passed, failed
    if ok:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}" + (f"  [{detail}]" if detail else ""))


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])

        # ── 1+2. 双主题全页面加载与运行时状态 ──
        for scheme in ("light", "dark"):
            print(f"\n── 主题：{scheme} ──")
            for path in PAGES:
                page = browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme=scheme)
                errors, bad = [], []
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                page.on("response", lambda r: bad.append(f"{r.status} {r.url}") if r.status >= 400 else None)
                page.goto(BASE + path, wait_until="networkidle")
                page.wait_for_timeout(1000)
                tag = f"{scheme} {path}"
                check(f"加载零错误 {tag}", not errors, "; ".join(errors[:2]))
                check(f"无 4xx/5xx 子资源 {tag}", not bad, "; ".join(bad[:2]))
                page.close()

        # ── 运行时细节（亮色，首页 + 文章页）──
        print("\n── 运行时状态 ──")
        page = browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme="light")
        page.goto(BASE + "/", wait_until="networkidle")
        page.wait_for_timeout(1500)
        st = page.evaluate("""() => ({
            fonts: document.fonts.check('700 16px "Chakra Petch"'),
            fx: document.documentElement.dataset.fx,
            theme: document.documentElement.dataset.theme,
            focus: !!document.querySelector('.trm-focus'),
            hud: (document.querySelector('.jhd-hero-hud') || {}).textContent
        })""")
        check("Chakra Petch 字体就绪", st["fonts"] is True)
        check("FX 档位存在", bool(st["fx"]), str(st["fx"]))
        check("纸白为默认主题", st["theme"] in (None, "light"), str(st["theme"]))
        check("专注度组件挂载", st["focus"])
        check("首页 HUD 显示 BUILD v8.4+", "BUILD v8" in (st["hud"] or ""))

        # 粒子场绘制（load 门控后轮询）
        painted = 0
        for _ in range(20):
            page.wait_for_timeout(250)
            painted = page.evaluate("""() => {
                const cv = document.querySelector('.trm-logo-canvas');
                if (!cv) return 0;
                const d = cv.getContext('2d').getImageData(0, 0, cv.width, Math.min(60, cv.height)).data;
                let n = 0; for (let j = 3; j < d.length; j += 4) if (d[j] > 0) n++;
                return n;
            }""")
            if painted > 50:
                break
        check("粒子场绘制（load 门控后）", painted > 50, f"px={painted}")

        # 滚动 reveal
        page.evaluate("window.scrollTo(0, 1200)")
        page.wait_for_timeout(600)
        reveal = page.evaluate("""() => ({
            total: document.querySelectorAll('[data-reveal]').length,
            inView: document.querySelectorAll('[data-reveal].is-in').length
        })""")
        check("滚动后 reveal 触发", reveal["inView"] > 0, str(reveal))
        page.close()

        # ── 3. 搜索页 ──
        print("\n── 搜索页 ──")
        sp = browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme="light")
        sp.goto(BASE + "/search/", wait_until="networkidle")
        sp.wait_for_timeout(1500)
        sp.fill("#searchInput", "站点")
        sp.wait_for_timeout(800)
        r = sp.evaluate("""() => ({
            status: (document.getElementById('searchStatus') || {}).textContent,
            items: document.querySelectorAll('#searchResults li').length,
            marks: document.querySelectorAll('#searchResults .search-mark').length
        })""")
        check("搜索计数", "匹配" in (r["status"] or "") and r["items"] > 0, str(r))
        check("标题匹配高亮", r["marks"] > 0, str(r))
        sp.press("#searchInput", "ArrowDown")
        sp.wait_for_timeout(200)
        kb = sp.evaluate("() => !!document.activeElement.closest('#searchResults')")
        check("键盘导航聚焦结果", kb)
        sp.fill("#searchInput", "zzz不存在的词")
        sp.wait_for_timeout(800)
        e = sp.evaluate("""() => ({
            status: (document.getElementById('searchStatus') || {}).textContent,
            shown: !document.getElementById('searchEmpty').hidden,
            links: document.querySelectorAll('.search-empty__links a').length
        })""")
        check("空态建议", e["shown"] and e["links"] >= 3, str(e))
        sp.click("#searchClear")
        sp.wait_for_timeout(500)
        c = sp.evaluate("""() => ({
            value: document.getElementById('searchInput').value,
            hidden: document.getElementById('searchStatus').hidden
        })""")
        check("清除按钮复位", c["value"] == "" and c["hidden"], str(c))
        sp.close()

        # ── 4. 404 游戏 ──
        print("\n── 404 游戏 ──")
        gp = browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme="light")
        gp.goto(BASE + "/404.html", wait_until="networkidle")
        gp.wait_for_timeout(800)
        nav = gp.evaluate("() => document.querySelectorAll('.rec-nav__link').length")
        check("404 检索入口四链", nav == 4, str(nav))
        gp.click('[data-act="start"]')
        gp.wait_for_timeout(600)
        started = gp.evaluate(
            "() => (document.querySelector('.rec-log') || {}).textContent || ''"
        )
        check("游戏会话启动（日志）", "recovery session started" in started, started[:40])
        # headless 软件渲染下 rAF 约 1fps（帧绘制被 SwiftShader 拖慢），
        # 计时以突发方式推进——轮询等待游戏时间流逝即可，不要求每帧平滑
        advanced = False
        for _ in range(24):
            gp.wait_for_timeout(500)
            hud = gp.evaluate("() => (document.querySelector('.rec-hud') || {}).textContent || ''")
            if "T-60s" not in hud:
                advanced = True
                break
        check("游戏循环推进计时", advanced, hud if not advanced else "")
        gp.close()

        # ── 5. 扫雷页 ──
        print("\n── 扫雷页 ──")
        mp = browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme="light")
        mp.goto(BASE + "/minesweeper/", wait_until="networkidle")
        mp.wait_for_timeout(800)
        ms = mp.evaluate("""() => ({
            script: Array.from(document.scripts).some(s => (s.src || '').includes('minesweeper')),
            cells: document.querySelectorAll('.ms-cell').length,
            stats: document.querySelectorAll('.ms-stat').length
        })""")
        check("扫雷脚本加载", ms["script"])
        check("棋盘渲染", ms["cells"] > 0, str(ms["cells"]))
        mp.close()

        # ── 6. 特效开关 ──
        print("\n── 特效开关 ──")
        tp = browser.new_page(viewport={"width": 1280, "height": 800}, color_scheme="light")
        tp.goto(BASE + "/", wait_until="networkidle")
        tp.wait_for_timeout(600)
        before = tp.evaluate("() => document.documentElement.dataset.fx")
        tp.click(".fx-toggle")
        tp.wait_for_timeout(400)
        after = tp.evaluate("() => document.documentElement.dataset.fx")
        stored = tp.evaluate("() => localStorage.getItem('jhd:fx')")
        check("FX 档位切换", before != after, f"{before}→{after}")
        check("FX 偏好持久化", stored is not None, str(stored))
        tp.close()

        browser.close()

    print(f"\n{'=' * 46}\n{passed} passed, {failed} failed")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
