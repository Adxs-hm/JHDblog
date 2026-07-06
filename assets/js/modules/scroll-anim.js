// 滚动入场动画 + 数值递增
export function initScrollAnim() {
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
        appearObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .project-card, .post-card, .stat-item, blockquote, table, pre').forEach((el) => {
    if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
    appearObserver.observe(el);
  });
}

export function initCounting() {
  let counted = false;
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat-number').forEach((el) => {
          const target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
          if (!target || isNaN(target)) return;
          let start = 0;
          const duration = 1200;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            el.textContent = start;
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });
  const banner = document.querySelector('.stat-banner');
  if (banner) countObserver.observe(banner);
}

export function initPageLoad() {
  document.body.classList.add('loaded');
}
