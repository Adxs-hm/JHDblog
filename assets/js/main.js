/* ═══════════════════════════════════════════════════════════════
   JHD · TERMINAL v7 — main.js（核心入口 · 零依赖）
   职责：FX 门控 / 岛屿加载器 / 手写机械感动效 / 转场兜底 / 特效开关
   约定：重交互按页分包（如 404 游戏走 game-entry.js），不进主包；
         首页/文章页的 reveal、计数、逐字入场全部用 IO + CSS transition 实现。
   ═══════════════════════════════════════════════════════════════ */

const root = document.documentElement;
const FX = root.dataset.fx || 'full';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* SDA（Baseline 2026）：支持滚动时间线时 reveal 交由 CSS 驱动，
   scrollFire 管线对 [data-reveal] 退出（split-char/计数器仍走 JS） */
const SDA = !REDUCED && typeof CSS !== 'undefined' && CSS.supports && CSS.supports('animation-timeline: view()');
if (SDA) root.classList.add('sda');

/* a11y 补丁（v8.2）：goldmark 把 markdown 任务列表渲染为无 label 的 disabled
   checkbox（Lighthouse「form elements do not have associated labels」失分）。
   补 aria-label；与 FX 档位无关，off 档同样执行。 */
document.querySelectorAll('.post-content input[type="checkbox"]').forEach(cb => {
  if (!cb.hasAttribute('aria-label')) {
    cb.setAttribute('aria-label', cb.checked ? '已完成' : '未完成');
  }
});

if (FX === 'off') {
  mountFxToggle();           /* off 档仅保留开关本身，保证可恢复 */
} else {
  root.classList.add('js');
  boot();
}

/* ── 页脚「关闭特效」开关（任何档位可恢复）── */
function mountFxToggle() {
  const footer = document.querySelector('footer.footer, .footer');
  if (!footer || footer.querySelector('.fx-toggle')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'fx-toggle';
  const LABEL = { full: '特效 FULL', lite: '特效 LITE', off: '特效 OFF' };
  btn.innerHTML = '<span class="fx-toggle__dot"></span>' + (LABEL[FX] || '特效 FULL');
  /* aria-label 须包含可见文本（WCAG 2.5.3 Label in Name）——带上当前档位 */
  btn.setAttribute('aria-label', '切换动效与特效档位，当前 ' + LABEL[FX]);
  btn.addEventListener('click', () => {
    const order = { full: 'off', off: 'lite', lite: 'full' };
    try { localStorage.setItem('jhd:fx', order[FX] || 'full'); } catch (e) {}
    location.reload();
  });
  footer.appendChild(btn);
}

function boot() {
  /* ── 岛屿注册表（视口内动态 import，按需付费）── */
  const islands = {
    'particle-logo': () => import('./islands/particle-logo.js'),
    'scanline':      () => import('./islands/scanline.js'),
    'badges':        () => import('./islands/badges.js'),
    'focus':         () => import('./islands/focus.js')
    /* rec-game 不走主包：见 extend_footer 的 404 按页分包 */
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const load = islands[e.target.dataset.island];
      if (load) load().then(m => m.default && m.default(e.target)).catch(() => {});
      io.unobserve(e.target);
    }
  }, { rootMargin: '250px' });
  /* 粒子场是首屏 LCP 候选且持续耗 CPU——仅 full 档挂载；lite/off 走 CSS 静态字 */
  if (FX === 'full') {
    document.querySelectorAll('[data-island]').forEach(el => io.observe(el));
  }

  /* ── 专注度组件 + 金色扫描线（全站轻量岛屿，full 档直接动态加载）── */
  if (FX === 'full') {
    /* 让出首屏绘制窗口：idle 后再启动持续动效岛屿 */
    const launch = () => {
      import('./islands/focus.js').then(m => m.default && m.default());
      if (matchMedia('(pointer: fine)').matches) {
        import('./islands/scanline.js').then(m => m.default && m.default());
      }
    };
    if ('requestIdleCallback' in window) requestIdleCallback(launch, { timeout: 1200 });
    else setTimeout(launch, 400);
  }

  /* ── 滚动触发统一管线（getBoundingClientRect 几何检测；
     不用 IO——[data-reveal] 初始态带 clip-path，会把 IO 交叠矩形裁成零面积）── */
  function scrollFire(els, frac, fire) {
    let raf = 0, alive = true;
    const check = () => {
      raf = 0;
      for (let i = els.length - 1; i >= 0; i--) {
        const r = els[i].getBoundingClientRect();
        if (r.top < innerHeight * frac && r.bottom > 0) {
          fire(els[i]);
          els.splice(i, 1);
        }
      }
      if (!els.length) alive = false;
    };
    const onScroll = () => { if (alive && !raf) raf = requestAnimationFrame(check); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    check();
  }

  /* ── 机械感 reveal：直角切入（SDA 走 CSS 滚动时间线，其余走本管线）── */
  const reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  if (REDUCED) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else if (!SDA) {
    scrollFire(reveals, .88, el => el.classList.add('is-in'));
  }

  /* ── HUD 数字滚动：0042 式补零 ── */
  const counters = Array.from(document.querySelectorAll('[data-count]'));
  counters.forEach(el => {
    const end = parseFloat(el.dataset.count) || 0;
    const pad = el.dataset.pad ? parseInt(el.dataset.pad, 10) : 0;
    const dur = 1400;
    const start = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);           /* power3.out */
        let s = String(Math.round(end * eased));
        el.textContent = pad ? s.padStart(pad, '0') : s;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (REDUCED) { el.textContent = pad ? String(end).padStart(pad, '0') : String(end); }
    else scrollFire([el], .9, start);
  });

  /* ── Hero 标题逐字入场（手写 split，full 档 + 桌面）── */
  if (!REDUCED && FX === 'full' && matchMedia('(min-width: 768px)').matches) {
    document.querySelectorAll('.trm-split').forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      el.setAttribute('aria-label', text);
      [...text].forEach((ch, i) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        s.setAttribute('aria-hidden', 'true');
        s.style.transitionDelay = (i * 22) + 'ms';
        el.appendChild(s);
      });
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
    });
  }

  /* ── 转场兜底：不支持 View Transitions 的浏览器（Firefox）── */
  if (!document.startViewTransition) {
    const veil = document.createElement('div');
    veil.id = 'trm-navveil';
    document.body.appendChild(veil);
    document.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (a.origin !== location.origin) return;
      if (href.startsWith('#') || href.startsWith('mailto:')) return;
      if (a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      veil.classList.add('is-on');
      setTimeout(() => { location.href = href; }, 300);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) veil.classList.remove('is-on'); });
  }

  /* ── 特效开关 ── */
  mountFxToggle();
}
