/* 游戏：TERMINAL · SYSTEM RECOVERY（404 页彩蛋）
   状态机 BOOT → PLAY → WIN/OVER；接青色数据包修复系统，躲红色损坏包
   键盘可玩（←/→）；prefers-reduced-motion 退化为静态终端日志 */
const S = { BOOT: 0, PLAY: 1, WIN: 2, OVER: 3 };
const DUR = 60;

const LOGS = [
  '> terminal kernel panic @ 0x7f3a … page table entry missing',
  '> rerouting power to system bus … ok',
  '> cache flushed. integrity 100%',
  '> 终端会自愈的。大概。',
  '> 用 [修复光束] 接住青色数据包，避开红色损坏包',
  '> 方向键 ← / → 可移动光束 · 空格开始'
];
const WIN_LOGS = [
  '> system integrity 100% · all sectors nominal',
  '> 恢复完成——但你要找的页面确实不存在。',
  '> 已为你生成返回首页的导航信标。'
];
const OVER_LOGS = [
  '> integrity critical … falling back to archive index',
  '> 修复失败。但失败也是数据。'
];

export default function initRecoveryGame(stage) {
  const canvas = stage.querySelector('canvas');
  const hud = stage.querySelector('.rec-hud');
  const logBox = document.querySelector('.rec-log');
  const actions = stage.querySelector('.rec-actions');
  if (!canvas || !logBox) return;

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── reduce 档：静态终端日志，无游戏 ── */
  const homeHref = (actions.querySelector('a.rec-btn') || {}).href || '/';
  if (REDUCED) {
    canvas.style.display = 'none';
    logBox.textContent = LOGS.join('\n');
    actions.innerHTML = '<a class="rec-btn" href="' + homeHref + '">‹ GO BACK · 返回首页</a>';
    return;
  }

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  function size() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  addEventListener('resize', size, { passive: true });

  let state = S.BOOT;
  let repair = 0, integrity = 100, timeLeft = DUR;
  let best = 0;
  try { best = parseInt(localStorage.getItem('jhd:rec-best') || '0', 10) || 0; } catch (e) {}
  let packets = [], sparks = [], beam = { x: 0, w: 90 };
  let last = 0, raf = 0;
  const keys = { left: false, right: false };

  function hudText() {
    return 'REPAIR <b>' + Math.max(0, Math.min(100, repair)) + '%</b>' +
      '<span class="hud-sep"> / </span>INTEGRITY <b>' + integrity + '</b>' +
      '<span class="hud-sep"> / </span>T-<b>' + Math.ceil(timeLeft) + 's</b>' +
      '<span class="hud-sep"> / </span>BEST <b>' + best + '%</b>';
  }
  function renderHud() { if (hud) hud.innerHTML = hudText(); }
  function log(lines) { logBox.textContent = lines.join('\n'); }

  function reset() {
    repair = 0; integrity = 100; timeLeft = DUR;
    packets = []; sparks = []; beam.x = W / 2;
    state = S.PLAY;
    renderHud();
    log(['> recovery session started · good luck']);
    actions.innerHTML = '';
    last = performance.now();
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function finish(win) {
    state = win ? S.WIN : S.OVER;
    const pct = Math.max(0, Math.min(100, Math.round(repair)));
    if (pct > best) {
      best = pct;
      try { localStorage.setItem('jhd:rec-best', String(best)); } catch (e) {}
    }
    log(win ? WIN_LOGS : OVER_LOGS);
    actions.innerHTML =
      '<button type="button" class="rec-btn" data-act="again">RETRY ></button>' +
      '<a class="rec-btn" href="' + homeHref + '">‹ GO BACK · 返回首页</a>';
    actions.querySelector('[data-act="again"]').addEventListener('click', reset);
    renderHud();
  }

  function spawn(dt) {
    if (Math.random() < dt * 2.2) {
      const bad = Math.random() < .3;
      packets.push({
        x: 20 + Math.random() * (W - 40),
        y: -12,
        vy: 120 + Math.random() * 90 + (DUR - timeLeft) * 1.2,
        r: 7,
        bad
      });
    }
  }

  function burst(x, y, color) {
    for (let i = 0; i < 8; i++) {
      sparks.push({
        x, y,
        vx: (Math.random() - .5) * 160,
        vy: (Math.random() - .5) * 160 - 40,
        life: .5, color
      });
    }
  }

  function update(dt) {
    timeLeft -= dt;
    if (timeLeft <= 0) { finish(repair >= 100); return; }
    const speed = 420 * dt;
    if (keys.left) beam.x -= speed;
    if (keys.right) beam.x += speed;
    beam.x = Math.max(beam.w / 2, Math.min(W - beam.w / 2, beam.x));

    spawn(dt);
    const beamY = H - 26;
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.y += p.vy * dt;
      if (p.y + p.r >= beamY && p.y - p.r < H && Math.abs(p.x - beam.x) <= beam.w / 2 + p.r) {
        if (p.bad) {
          integrity -= 12;
          burst(p.x, beamY, '#ff4d5e');
        } else {
          repair += 8;
          burst(p.x, beamY, '#22d3ee');
        }
        packets.splice(i, 1);
        renderHud();
        if (integrity <= 0) { finish(false); return; }
        if (repair >= 100) { finish(true); return; }
        continue;
      }
      if (p.y - p.r > H) packets.splice(i, 1);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 300 * dt; s.life -= dt;
      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    /* 背景点阵 */
    ctx.fillStyle = 'rgba(238,242,244,.05)';
    for (let y = 8; y < H; y += 16) for (let x = 8; x < W; x += 16) ctx.fillRect(x, y, 1.5, 1.5);
    /* 数据包 */
    for (const p of packets) {
      ctx.fillStyle = p.bad ? '#ff4d5e' : '#22d3ee';
      ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      ctx.strokeStyle = p.bad ? 'rgba(255,77,94,.4)' : 'rgba(34,211,238,.4)';
      ctx.strokeRect(p.x - p.r - 3, p.y - p.r - 3, p.r * 2 + 6, p.r * 2 + 6);
    }
    /* 修复光束 */
    const beamY = H - 26;
    const g = ctx.createLinearGradient(beam.x - beam.w / 2, 0, beam.x + beam.w / 2, 0);
    g.addColorStop(0, 'rgba(34,211,238,.15)');
    g.addColorStop(.5, 'rgba(34,211,238,.85)');
    g.addColorStop(1, 'rgba(34,211,238,.15)');
    ctx.fillStyle = g;
    ctx.fillRect(beam.x - beam.w / 2, beamY, beam.w, 3);
    ctx.fillStyle = 'rgba(34,211,238,.25)';
    ctx.fillRect(beam.x - beam.w / 2, beamY + 3, beam.w, 14);
    /* 迸溅 */
    for (const s of sparks) {
      ctx.globalAlpha = Math.max(0, s.life * 2);
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, 2.5, 2.5);
    }
    ctx.globalAlpha = 1;
  }

  function drawIdle() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(238,242,244,.05)';
    for (let y = 8; y < H; y += 16) for (let x = 8; x < W; x += 16) ctx.fillRect(x, y, 1.5, 1.5);
    ctx.strokeStyle = 'rgba(34,211,238,.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(14, 14, W - 28, H - 28);
    ctx.fillStyle = 'rgba(34,211,238,.7)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('AWAITING RECOVERY SESSION', 26, 34);
  }

  function loop(t) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (t - last) / 1000);
    last = t;
    if (state === S.PLAY) {
      update(dt);
      draw();
    } else {
      drawIdle();
    }
  }

  /* ── 输入 ── */
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    beam.x = e.clientX - r.left;
  }, { passive: true });
  addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { keys.left = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys.right = true; e.preventDefault(); }
    if ((e.key === ' ' || e.key === 'Enter') && state !== S.PLAY) {
      const btn = actions.querySelector('.rec-btn:not([href])');
      if (btn) { e.preventDefault(); btn.click(); }
    }
  });
  addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    else if (state === S.PLAY && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  });

  /* ── BOOT 态 ── */
  renderHud();
  log(LOGS);
  actions.innerHTML = '<button type="button" class="rec-btn" data-act="start">START RECOVERY ></button>' +
    '<a class="rec-btn" href="' + homeHref + '">‹ GO BACK · 返回首页</a>';
  actions.querySelector('[data-act="start"]').addEventListener('click', reset);
  drawIdle();
}
