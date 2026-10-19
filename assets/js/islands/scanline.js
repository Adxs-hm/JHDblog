/* 岛屿：青蓝扫描线 + 准星光标 overlay（mix-blend-mode: screen，全站单例） */
export default function initScanline() {
  if (matchMedia('(pointer: coarse)').matches) return;
  if (document.getElementById('ak-scanline')) return;
  const cv = document.createElement('canvas');
  cv.id = 'ak-scanline';
  cv.setAttribute('aria-hidden', 'true');
  cv.style.cssText = 'position:fixed;inset:0;z-index:70;pointer-events:none;mix-blend-mode:screen';
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, mx = -999, my = -999, raf = 0, glitchUntil = 0, running = false, lastFrame = 0;

  function size() {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  addEventListener('resize', size, { passive: true });
  addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (Math.random() < .02) glitchUntil = performance.now() + 120;
  }, { passive: true });

  function tick(t) {
    raf = requestAnimationFrame(tick);
    /* 30fps 限帧 */
    if (t - lastFrame < 33) return;
    lastFrame = t;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    /* 扫描线：鼠标 y 为中心的青蓝横带 */
    const g = ctx.createLinearGradient(0, my - 40, 0, my + 40);
    g.addColorStop(0, 'rgba(34,211,238,0)');
    g.addColorStop(.5, 'rgba(34,211,238,.14)');
    g.addColorStop(1, 'rgba(34,211,238,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, my - 40, W, 80);
    /* 准星 */
    ctx.strokeStyle = 'rgba(34,211,238,.8)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx - 9, my); ctx.lineTo(mx - 3, my);
    ctx.moveTo(mx + 3, my); ctx.lineTo(mx + 9, my);
    ctx.moveTo(mx, my - 9); ctx.lineTo(mx, my - 3);
    ctx.moveTo(mx, my + 3); ctx.lineTo(mx, my + 9);
    ctx.stroke();
    /* 故障横条（2% 指针事件触发，持续 120ms）*/
    if (t < glitchUntil) {
      const y = Math.random() * H, h = 2 + Math.random() * 6;
      ctx.fillStyle = 'rgba(34,211,238,.35)';
      ctx.fillRect(0, y, W, h);
    }
    raf = requestAnimationFrame(tick);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(tick); } }
  function stop() { if (running) { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; } }

  size();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    /* 让出首屏绘制窗口 */
    const launch = () => { start();
      document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); }); };
    if ('requestIdleCallback' in window) requestIdleCallback(launch, { timeout: 1500 });
    else setTimeout(launch, 500);
  }
}
