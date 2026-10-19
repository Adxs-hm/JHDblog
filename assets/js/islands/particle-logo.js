/* 岛屿：粒子 Logo —— Canvas 2D 文字采样 + 鼠标斥力 + 回家弹性（零依赖） */
export default function initParticleLogo(field) {
  const canvas = field.querySelector('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const REPEL = 90, EASE = .08, DAMP = .82;
  const text = field.dataset.text || 'RHODES';
  let W = 0, H = 0, pts = [], raf = 0, visible = true, lastFrame = 0;
  let ink = '#22d3ee';
  const mouse = { x: -1e4, y: -1e4 };

  /* 颜色缓存：避免每帧 getComputedStyle 触发样式重算 */
  function readInk() {
    ink = getComputedStyle(canvas).color || '#22d3ee';
  }
  new MutationObserver(readInk).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function sample(gap) {
    const off = document.createElement('canvas');
    const o = off.getContext('2d');
    off.width = W; off.height = H;
    o.fillStyle = '#fff';
    o.font = '700 ' + Math.min(H * .5, 140) + 'px "Chakra Petch", sans-serif';
    o.textAlign = 'center';
    o.textBaseline = 'middle';
    o.fillText(text, W / 2, H / 2);
    const d = o.getImageData(0, 0, W, H).data;
    pts = [];
    for (let y = 0; y < H; y += gap) {
      for (let x = 0; x < W; x += gap) {
        if (d[(y * W + x) * 4 + 3] > 128) {
          pts.push({
            hx: x, hy: y,
            x: x + (Math.random() - .5) * 60,
            y: y + (Math.random() - .5) * 60,
            vx: 0, vy: 0
          });
        }
      }
    }
    /* 低端设备保护：粒子超限则放大间距重采样 */
    if (pts.length > 8000 && gap < 8) sample(Math.ceil(gap * Math.sqrt(pts.length / 8000)));
  }

  function resize() {
    W = field.clientWidth; H = field.clientHeight;
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readInk();
    sample(4);
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    /* 30fps 限帧：装饰性动画不抢 60fps 的预算 */
    if (now - lastFrame < 33) return;
    lastFrame = now;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ink;
    /* 批量路径：一次 fill 画完所有粒子（比逐颗 fillRect 快 5-10 倍）*/
    ctx.beginPath();
    for (const p of pts) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < REPEL * REPEL) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / REPEL) * 5;
        p.vx += dx / d * f; p.vy += dy / d * f;
      }
      p.vx += (p.hx - p.x) * EASE; p.vy += (p.hy - p.y) * EASE;
      p.vx *= DAMP; p.vy *= DAMP;
      p.x += p.vx; p.y += p.vy;
      ctx.rect(p.x, p.y, 1.6, 1.6);
    }
    ctx.fill();
  }

  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  function start() { if (!raf && visible && W) tick(); }

  addEventListener('resize', () => { stop(); resize(); start(); }, { passive: true });
  field.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  }, { passive: true });
  field.addEventListener('pointerleave', () => { mouse.x = -1e4; mouse.y = -1e4; }, { passive: true });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? start() : stop();
  }, { threshold: 0 }).observe(field);
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : start(); });

  resize();
  /* 让出首屏绘制窗口：idle 后再启动粒子场 */
  const launch = () => { if (visible) start(); };
  if ('requestIdleCallback' in window) requestIdleCallback(launch, { timeout: 1500 });
  else setTimeout(launch, 500);
}
