/* 岛屿：阅读进度徽章 —— 手写滚动进度 + localStorage 持久化（零依赖） */
const RACK = [
  { at: .25, id: 'first', name: '初读',   desc: '阅读进度 25%' },
  { at: .5,  id: 'half',  name: '渐入',   desc: '阅读进度 50%' },
  { at: .75, id: 'deep',  name: '深耕',   desc: '阅读进度 75%' },
  { at: 1,   id: 'full',  name: '通读',   desc: '全文读完' }
];
const KEY = 'jhd:badges';

export default function initBadges(track) {
  if (!track) return;
  let got = new Set();
  try { got = new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) {}

  const bar = document.createElement('div');
  bar.className = 'trm-progress-bar';
  track.appendChild(bar);

  const toast = document.createElement('div');
  toast.className = 'trm-badge-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  let toastTimer = 0;

  /* 进度源：文章正文（不存在时退化为整页）*/
  const target = document.querySelector('.post-content') || document.body;

  function onScroll() {
    const r = target.getBoundingClientRect();
    const total = r.height - innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : (r.top < 0 ? 1 : 0);
    bar.style.width = (progress * 100).toFixed(2) + '%';
    RACK.forEach(b => {
      if (progress >= b.at && !got.has(b.id)) {
        got.add(b.id);
        try { localStorage.setItem(KEY, JSON.stringify([...got])); } catch (e) {}
        toast.innerHTML = '<div class="t">// BADGE UNLOCKED — ' + b.name + '</div><div class="d">' + b.desc + '</div>';
        toast.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-on'), 3200);
      }
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  onScroll();
}
