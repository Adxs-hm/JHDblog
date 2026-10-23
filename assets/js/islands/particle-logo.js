/* 岛屿：粒子 Logo —— Canvas 2D 文字采样 + 鼠标斥力 + 回家弹性（零依赖）
   内存与 CPU 纪律（v8.1，LHCI 4x CPU 门禁驱动）：
   - 粒子状态存 Float32Array（无 per-particle 对象分配，规避 major GC 长任务）
   - 硬上限 3000 粒（间距渐进放大直至达标）
   - 采样分辨率减半（离屏画布 0.5x，getImageData 读取量降 75%）
   - 离屏画布复用（不随 resize 重分配）
   - 静态文字先绘一帧（即时视觉落点，避免空白场）*/
export default function initParticleLogo(field) {
  const canvas = field.querySelector('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const REPEL = 90, EASE = .08, DAMP = .82;
  const MAX_P = 3000;
  const text = field.dataset.text || 'TERMINAL';
  let W = 0, H = 0, raf = 0, visible = true, lastFrame = 0, count = 0;
  const X = new Float32Array(MAX_P), Y = new Float32Array(MAX_P);
  const VX = new Float32Array(MAX_P), VY = new Float32Array(MAX_P);
  const HX = new Float32Array(MAX_P), HY = new Float32Array(MAX_P);
  let ink = '#c9a227';
  const mouse = { x: -1e4, y: -1e4 };

  /* 复用的离屏采样画布（半分辨率）*/
  const off = document.createElement('canvas');
  const octx = off.getContext('2d', { willReadFrequently: true });

  /* 颜色缓存：避免每帧 getComputedStyle 触发样式重算 */
  function readInk() {
    ink = getComputedStyle(canvas).color || '#c9a227';
  }
  new MutationObserver(readInk).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function sample(gap) {
    if (!octx || !W || !H) return;
    const hw = Math.max(1, Math.ceil(W / 2)), hh = Math.max(1, Math.ceil(H / 2));
    off.width = hw; off.height = hh;
    octx.fillStyle = '#fff';
    octx.font = '700 ' + Math.max(8, Math.min(H * .25, 70)) + 'px "Chakra Petch", sans-serif';
    octx.textAlign = 'center'; octx.textBaseline = 'middle';
    octx.fillText(text, hw / 2, hh / 2);
    const d = octx.getImageData(0, 0, hw, hh).data;
    count = 0;
    const step = Math.max(1, Math.round(gap / 2));
    for (let y = 0; y < hh && count < MAX_P; y += step) {
      for (let x = 0; x < hw && count < MAX_P; x += step) {
        if (d[(y * hw + x) * 4 + 3] > 128) {
          X[count] = x * 2; Y[count] = y * 2;
          HX[count] = x * 2; HY[count] = y * 2;
          VX[count] = 0; VY[count] = 0;
          count++;
        }
      }
    }
    /* 触顶则放大间距重采样（低端设备/大字段保护）*/
    if (count >= MAX_P && gap < 12) sample(Math.ceil(gap * 1.4));
  }

  function drawStatic() {
    if (!W || !H) return;
    ctx.fillStyle = ink;
    ctx.font = '700 ' + Math.min(H * .5, 140) + 'px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, W / 2, H / 2);
  }

  function resize() {
    W = field.clientWidth; H = field.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readInk();
    drawStatic();
    sample(4);
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    /* 30fps 限帧：装饰性动画不抢 60fps 的预算 */
    if (now - lastFrame < 33) return;
    lastFrame = now;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ink;
    /* 批量路径：一次 fill 画完所有粒子 */
    ctx.beginPath();
    for (let i = 0; i < count; i++) {
      const dx = X[i] - mouse.x, dy = Y[i] - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < REPEL * REPEL) {
        const d = Math.sqrt(d2) || 1, f = (1 - d / REPEL) * 5;
        VX[i] += dx / d * f; VY[i] += dy / d * f;
      }
      VX[i] += (HX[i] - X[i]) * EASE; VY[i] += (HY[i] - Y[i]) * EASE;
      VX[i] *= DAMP; VY[i] *= DAMP;
      X[i] += VX[i]; Y[i] += VY[i];
      ctx.rect(X[i], Y[i], 1.6, 1.6);
    }
    ctx.fill();
  }

  function stop() { if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  function start() { if (!raf && visible && W) raf = requestAnimationFrame(tick); }

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
  /* 让出首屏绘制窗口：load 事件之后才启动粒子场（装饰动画不抢加载突发期的
     主线程——实测冷启动单任务 1069ms 全部落在 TBT 窗口内）；
     静态文字已先绘，粒子在页面 settled 后接管，空档即「物质化」过程。*/
  const launch = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => { if (visible) start(); }, { timeout: 2000 });
    else setTimeout(() => { if (visible) start(); }, 600);
  };
  if (document.readyState === 'complete') launch();
  else addEventListener('load', launch, { once: true });
}
