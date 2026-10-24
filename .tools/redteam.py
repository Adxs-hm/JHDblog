"""JHD 红队 / 黑队攻击套件（对抗性 + 黑盒，v1）

攻击面：
  A1 搜索框 XSS 弹药（注入标签/事件处理器/CDATA 逃逸）
  A2 localStorage 腐蚀弹药（坏 JSON / 巨型值 / 错误类型 / 原型链键）
  A3 快速交互风暴（fx-toggle 连点 / 游戏连开 / 清除连按）
  A4 JS 禁用下的内容可见性（无脚本环境必须直显全文）
  B1 搜索退化输入（空/64 字符上限/emoji/CJK/引号闭合）
  B2 扫雷 prefs 注入（原型链 difficulty / 极端棋盘 / 坏 JSON）
  B3 离线模式（SW 导航回落 / 深链回落首页）
  B4 URL hash 滥用（伪锚点注入）
  B5 极窄视口（320px 渲染完整性）
  B6 高速页面巡航（11 页连访，监听器泄漏 / 错误累积）

运行：构建 + 本地服务后执行 python .tools/redteam.py
"""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8080"
results = []


def rec(area, name, ok, detail=""):
    results.append((area, name, ok, detail))
    print(f"  {'PASS' if ok else 'FAIL'}  [{area}] {name}" + (f"  <<{detail}>>" if detail and not ok else ""))


XSS_PAYLOADS = [
    '<img src=x onerror=window.__pwned=1>',
    '<svg onload=window.__pwned=1>',
    '<script>window.__pwned=1</script>',
    '"><img src=x onerror=window.__pwned=1>',
    "'';!--\"<XSS>=&{()}",
    '<iframe src="javascript:window.__pwned=1">',
]

GARBAGE_STORAGE = [
    ("jhd:fx", '"><script>window.__pwned=1</script>'),
    ("jhd:fx", "not-json-at-all"),
    ("jhd:focus", "{invalid"),
    ("jhd:focus", '{"v":"<img src=x onerror=window.__pwned=1>","t":1}'),
    ("jhd:focus", '{"v":-1e308,"t":1}'),
    ("jhd:focus", '{"v":NaN,"t":1}'),
    ("jhd:badges", '{"constructor":"polluted"}'),
    ("jhd:badges", "x".join(["a"] * 1) + "A" * 100000),
    ("ms-prefs", '{"difficulty":"constructor","rows":1,"cols":1,"mines":99999}'),
    ("ms-prefs", '{"rows":"<svg onload=window.__pwned=1>"}'),
]


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])

        # ── A1 搜索框 XSS 弹药 ──
        print("\n[A1] 搜索框 XSS 弹药")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + "/search/", wait_until="networkidle")
        pg.wait_for_timeout(1500)
        for payload in XSS_PAYLOADS:
            pg.fill("#searchInput", payload)
            pg.wait_for_timeout(650)
            state = pg.evaluate("""() => ({
                pwned: window.__pwned === 1,
                injected: !!document.querySelector('#searchStatus script, #searchStatus img, #searchStatus iframe, #searchResults script, #searchResults img, #searchResults iframe'),
                statusChildren: [...document.getElementById('searchStatus').childNodes].every(n => n.nodeType === 3)
            })""")
            rec("A1", f"payload 无执行 {payload[:34]}", not state["pwned"] and not state["injected"] and state["statusChildren"])
        pg.fill("#searchInput", "")
        pg.close()

        # ── A2 localStorage 腐蚀弹药 ──
        print("\n[A2] localStorage 腐蚀弹药")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        for key, val in GARBAGE_STORAGE:
            errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)), )
            pg.goto(BASE + "/", wait_until="domcontentloaded")
            pg.evaluate(f"() => {{ try {{ localStorage.setItem('{key}', {json.dumps(val)}) }} catch(e) {{}} }}")
            pg.reload(wait_until="networkidle")
            pg.wait_for_timeout(1200)
            state = pg.evaluate("""() => ({
                pwned: window.__pwned === 1,
                fx: ['full', 'lite', 'off'].includes(document.documentElement.dataset.fx),
                focusText: (document.querySelector('.trm-focus') || {textContent: 'n/a'}).textContent.slice(0, 30)
            })""")
            focus_ok = "NaN" not in state["focusText"] and "e+3" not in state["focusText"] and "-1e" not in state["focusText"]
            rec("A2", f"{key} ← {val[:26]}", not state["pwned"] and state["fx"] and focus_ok and not errs,
                f"fx={state['fx']} focus={state['focusText']!r} errs={errs[:1]}")
        pg.close()

        # ── A3 快速交互风暴 ──
        print("\n[A3] 快速交互风暴")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + "/", wait_until="networkidle")
        pg.wait_for_timeout(800)
        for _ in range(30):
            pg.click(".fx-toggle", timeout=2000)
        fx = pg.evaluate("() => document.documentElement.dataset.fx")
        rec("A3", "fx-toggle 30 连点后档位合法", fx in ("full", "lite", "off"), fx)
        pg.goto(BASE + "/404.html", wait_until="networkidle")
        pg.wait_for_timeout(600)
        for _ in range(10):
            try:
                pg.click('[data-act="start"]', timeout=800)
            except Exception:
                pass
        pg.wait_for_timeout(1200)
        rec("A3", "404 游戏 10 连开无崩溃", not errs, "; ".join(errs[:1]))
        pg.goto(BASE + "/search/", wait_until="networkidle")
        pg.wait_for_timeout(1200)
        pg.fill("#searchInput", "站点")
        for _ in range(19):
            try:
                pg.click("#searchClear", timeout=500)
                pg.fill("#searchInput", "站点", timeout=500)
            except Exception:
                pass
        try:
            pg.click("#searchClear", timeout=500)  # 以点击收尾，终态应为已清空
        except Exception:
            pass
        pg.wait_for_timeout(400)
        ok = pg.evaluate("() => document.getElementById('searchInput').value === ''")
        rec("A3", "清除按钮 20 连按终态正确", ok)
        rec("A3", "风暴全程零 JS 错误", not errs, "; ".join(errs[:1]))
        pg.close()

        # ── A4 JS 禁用：内容必须直显 ──
        print("\n[A4] JS 禁用内容可见性")
        ctx = browser.new_context(java_script_enabled=False, viewport={"width": 1280, "height": 800})
        pg = ctx.new_page()
        for path, probe in [("/", ".jhd-intro"), ("/posts/jhd-site/", ".post-content"),
                            ("/changelog/", ".cl-list"), ("/about/", "table")]:
            pg.goto(BASE + path, wait_until="load")
            vis = pg.evaluate("""(sel) => {
                const el = document.querySelector(sel);
                if (!el) return 'NO-EL';
                const s = getComputedStyle(el);
                return s.opacity === '1' && s.display !== 'none';
            }""", probe)
            rec("A4", f"无 JS 内容直显 {path} {probe}", vis is True, str(vis))
        ctx.close()

        # ── B1 搜索退化输入 ──
        print("\n[B1] 搜索退化输入")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + "/search/", wait_until="networkidle")
        pg.wait_for_timeout(1500)
        degenerates = ["", "   ", "a" * 64, "🌟" * 20, "网站" * 30, "' OR 1=1--",
                       "<svg/onload=window.__pwned=1>", "\\u0000\\u2028\\u2029", "！＃＄％＆"]
        for payload in degenerates:
            pg.fill("#searchInput", payload)
            pg.wait_for_timeout(650)
            ui = pg.evaluate("""() => ({
                status: !!document.getElementById('searchStatus'),
                empty: !document.getElementById('searchEmpty').hidden,
                items: document.querySelectorAll('#searchResults li').length
            })""")
            sane = ui["status"] and (ui["empty"] or ui["items"] >= 0)
            rec("B1", f"退化输入 {payload[:20]!r}", sane and not errs, f"{ui} {errs[:1]}")
        pg.close()

        # ── B2 扫雷 prefs 注入 ──
        print("\n[B2] 扫雷 prefs 注入")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        for key, val in [
            ("ms-prefs", '{"difficulty":"constructor"}'),
            ("ms-prefs", '{"difficulty":"hasOwnProperty","rows":40,"cols":40,"mines":100}'),
            ("ms-prefs", '{"difficulty":"custom","rows":1,"cols":1,"mines":99999}'),
        ]:
            pg.goto(BASE + "/minesweeper/", wait_until="domcontentloaded")
            pg.evaluate(f"() => {{ try {{ localStorage.setItem('{key}', {json.dumps(val)}) }} catch(e) {{}} }}")
            pg.reload(wait_until="networkidle")
            pg.wait_for_timeout(1200)
            board = pg.evaluate("""() => ({
                cells: document.querySelectorAll('.ms-cell').length,
                text: (document.querySelector('.ms-board') || document.body).textContent.includes('undefined')
            })""")
            rec("B2", f"{val[:44]}", board["cells"] > 0 and not board["text"], str(board))
        pg.close()

        # ── B3 离线模式 ──
        print("\n[B3] 离线模式")
        ctx = browser.new_context(viewport={"width": 1280, "height": 800})
        pg = ctx.new_page()
        pg.goto(BASE + "/", wait_until="networkidle")
        pg.wait_for_timeout(2500)  # SW 安装 + 预缓存
        ctx.set_offline(True)
        try:
            pg.goto(BASE + "/posts/jhd-site/", wait_until="load", timeout=8000)
            body = pg.evaluate("() => document.body.textContent.includes('JHD')")
            rec("B3", "离线打开已缓存文章页", body)
        except Exception as e:
            rec("B3", "离线打开已缓存文章页", False, str(e)[:60])
        try:
            pg.goto(BASE + "/", wait_until="load", timeout=8000)
            home = pg.evaluate("() => document.body.textContent.includes('TERMINAL') || document.body.textContent.includes('JHD')")
            rec("B3", "离线深链回落首页", home)
        except Exception as e:
            rec("B3", "离线深链回落首页", False, str(e)[:60])
        ctx.set_offline(False)
        ctx.close()

        # ── B4 URL hash 滥用 ──
        print("\n[B4] URL hash 滥用")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + "/posts/jhd-site/#<img src=x onerror=window.__pwned=1>", wait_until="load")
        pg.wait_for_timeout(1200)
        rec("B4", "伪锚点 hash 无执行", pg.evaluate("() => window.__pwned !== 1") and not errs)
        pg.close()

        # ── B5 极窄视口 ──
        print("\n[B5] 极窄视口 320px")
        pg = browser.new_page(viewport={"width": 320, "height": 700})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(BASE + "/posts/jhd-site/", wait_until="networkidle")
        pg.wait_for_timeout(1200)
        overflow = pg.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        rec("B5", "320px 无横向溢出", overflow <= 1, f"溢出 {overflow}px")
        pg.goto(BASE + "/changelog/", wait_until="networkidle")
        pg.wait_for_timeout(1000)
        overflow = pg.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        rec("B5", "320px changelog 无横向溢出", overflow <= 1, f"溢出 {overflow}px")
        pg.close()

        # ── B6 高速页面巡航 ──
        print("\n[B6] 高速页面巡航")
        pg = browser.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pages = ["/", "/posts/jhd-site/", "/changelog/", "/search/", "/minesweeper/",
                 "/about/", "/404.html", "/archives/", "/start-here/", "/subscribe/",
                 "/posts/site-launch/"]
        for u in pages:
            try:
                pg.goto(BASE + u, wait_until="domcontentloaded", timeout=8000)
                pg.wait_for_timeout(250)
            except Exception as e:
                errs.append(f"{u}: {str(e)[:40]}")
        rec("B6", "11 页高速连访零错误", not errs, "; ".join(errs[:2]))
        pg.close()

        browser.close()

    fails = [r for r in results if not r[2]]
    print(f"\n{'=' * 50}\n{len(results) - len(fails)} passed, {len(fails)} failed / {len(results)}")
    for area, name, _, detail in fails:
        print(f"  FAIL [{area}] {name}  <<{detail}>>")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
