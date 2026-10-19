# v7 交互功能验证：友链筛选/翻转/拖拽 + 404 游戏 + 特效开关降级
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch(args=["--no-sandbox"])

        # ── 友链页交互 ──
        pg = await b.new_page(viewport={"width": 1280, "height": 800})
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        await pg.goto("http://localhost:8080/friends/", wait_until="networkidle")
        await pg.wait_for_timeout(600)
        cards = await pg.query_selector_all(".friend-card")
        out["friends_cards"] = len(cards)
        # 筛选：点「技术」
        btn = await pg.query_selector('.friends-filter[data-cat="技术"]')
        await btn.click()
        await pg.wait_for_timeout(900)
        out["filter_tech_visible"] = await pg.evaluate(
            "Array.from(document.querySelectorAll('.friend-card')).filter(c => c.style.display !== 'none').length")
        # 翻面：点第一张【可见】卡（JS 判定 offsetParent，避开 Draggable 内联样式干扰）
        await pg.evaluate("""() => {
            const c = Array.from(document.querySelectorAll('.friend-card')).find(x => x.offsetParent !== null);
            if (c) { c.dataset.testFlip = '1'; c.click(); }
        }""")
        await pg.wait_for_timeout(800)
        out["flip_rotationY"] = await pg.evaluate(
            "getComputedStyle(document.querySelector('[data-test-flip] .friend-card__inner')).transform")
        # 拖拽：挑一张可见卡拖到右侧
        box2 = await pg.evaluate("""() => {
            const c = Array.from(document.querySelectorAll('.friend-card')).find(x => x.offsetParent !== null);
            if (!c) return null;
            const r = c.getBoundingClientRect();
            return { x: r.x, y: r.y, width: r.width, height: r.height, name: c.querySelector('h3').textContent };
        }""")
        if box2:
            await pg.mouse.move(box2["x"] + box2["width"] / 2, box2["y"] + box2["height"] / 2)
            await pg.mouse.down()
            await pg.mouse.move(box2["x"] + 260, box2["y"] + 150, steps=12)
            await pg.mouse.up()
            await pg.wait_for_timeout(700)
            out["drag_ok"] = await pg.evaluate(
                "Array.from(document.querySelectorAll('.friend-card')).filter(c=>c.offsetParent!==null).map(c => c.querySelector('h3').textContent).slice(0, 3)")
            out["drag_target"] = box2["name"]
        out["friends_errors"] = errs

        # ── 404 游戏 ──
        g = await b.new_page(viewport={"width": 1280, "height": 800})
        gerrs = []
        g.on("pageerror", lambda e: gerrs.append(str(e)))
        await g.goto("http://localhost:8080/404.html", wait_until="networkidle")
        await g.wait_for_timeout(500)
        await (await g.query_selector('[data-act="start"]')).click()
        await g.wait_for_timeout(2500)
        out["game_state"] = await g.evaluate("""() => ({
            hud: (document.querySelector('.prts-hud')||{}).textContent,
            canvasDrawn: (() => { const c = document.querySelector('.prts-canvas');
                const ctx = c.getContext('2d'); const d = ctx.getImageData(0,0,c.width,40).data;
                let n = 0; for (let i=3;i<d.length;i+=4000) if (d[i]>0) n++;
                return n; })()
        })""")
        out["game_errors"] = gerrs

        # ── 特效开关：full → off ──
        t = await b.new_page(viewport={"width": 1280, "height": 800})
        await t.goto("http://localhost:8080/", wait_until="networkidle")
        await (await t.query_selector(".fx-toggle")).click()
        await t.wait_for_load_state("networkidle")
        await t.wait_for_timeout(600)
        out["fx_off"] = await t.evaluate("""() => ({
            fx: document.documentElement.dataset.fx,
            revealVisible: getComputedStyle(document.querySelector('[data-reveal]')||document.body).opacity,
            sanity: !!document.querySelector('.ak-sanity'),
            toggleLabel: (document.querySelector('.fx-toggle')||{}).textContent
        })""")
        await b.close()
    print(json.dumps(out, ensure_ascii=False, indent=1))

asyncio.run(main())
