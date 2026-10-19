/* 岛屿：友链墙 —— 分类筛选（FLIP 重排）+ 卡片 3D 翻转 + 拖拽排序（Draggable + Flip） */
import { gsap } from '../vendor/gsap/index.js';
import { Flip } from '../vendor/gsap/Flip.js';
import { Draggable } from '../vendor/gsap/Draggable.js';

const ORDER_KEY = 'jhd:friends-order';

export default function initFriends(wrap) {
  if (!wrap) return;
  const grid = wrap.querySelector('.friends-grid');
  const filters = wrap.querySelectorAll('.friends-filter');
  const counter = wrap.querySelector('.friends-count');
  if (!grid) return;

  const cards = () => Array.from(wrap.querySelectorAll('.friend-card'));

  /* ── 分类筛选：FLIP 重排（卡片 + 分类标题联动）── */
  const cats = () => Array.from(wrap.querySelectorAll('.friends-cat'));
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.toggle('is-active', b === btn));
      const cat = btn.dataset.cat;
      const state = Flip.getState([...cards(), ...cats()]);
      cards().forEach(c => {
        c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
      });
      cats().forEach(s => {
        s.style.display = (cat === 'all' || s.dataset.cat === cat) ? '' : 'none';
      });
      Flip.from(state, {
        duration: .5, ease: 'power3.inOut', stagger: .03, scale: true, absolute: true
      });
      updateCount();
    });
  });

  function updateCount() {
    if (!counter) return;
    counter.textContent = cards().filter(c => c.style.display !== 'none').length + ' / ' + cards().length + ' NODES';
  }
  updateCount();

  /* ── 卡片翻转：点击正面（避开链接）→ 正反面 3D 翻转 ── */
  cards().forEach(card => {
    let flipped = false;
    const inner = card.querySelector('.friend-card__inner');
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      flipped = !flipped;
      gsap.to(inner, { rotationY: flipped ? 180 : 0, duration: .6, ease: 'power3.inOut' });
    });
  });

  /* ── 拖拽排序：Draggable + 松手后按落点重排 DOM + Flip 补间 ── */
  Draggable.create(cards(), {
    type: 'x,y',
    edgeResistance: 0.65,
    bounds: wrap,
    onPress() { this.target.classList.add('is-drag'); this.target.style.zIndex = 5; },
    onRelease() {
      this.target.classList.remove('is-drag');
      this.target.style.zIndex = '';
      reorder(this.target);
    }
  });

  function reorder(dragged) {
    const state = Flip.getState(cards());
    const after = pickTarget(dragged);
    if (after) {
      after.parentNode.insertBefore(dragged, after.nextSibling);
    }
    /* 未找到落点则留在原位；归位位移由 Flip 补上 */
    gsap.set(cards(), { x: 0, y: 0 });
    Flip.from(state, { duration: .35, ease: 'power2.out' });
    saveOrder();
  }

  function pickTarget(dragged) {
    const dr = dragged.getBoundingClientRect();
    let best = null, bestDist = Infinity;
    for (const c of cards()) {
      if (c === dragged) continue;
      const r = c.getBoundingClientRect();
      const dx = (r.left + r.width / 2) - (dr.left + dr.width / 2);
      const dy = (r.top + r.height / 2) - (dr.top + dr.height / 2);
      const d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; best = c; }
    }
    return best;
  }

  function saveOrder() {
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify(cards().map(c => c.dataset.id)));
    } catch (e) {}
  }

  /* ── 恢复上次排序（按 data-id 的「分类-序号」归队到对应网格）── */
  try {
    const order = JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
    if (Array.isArray(order) && order.length) {
      const byId = new Map(cards().map(c => [c.dataset.id, c]));
      order.forEach(id => {
        const c = byId.get(id);
        if (!c) return;
        const cat = String(id).split('-')[0];
        const g = wrap.querySelector('.friends-grid[data-cat="' + cat + '"]');
        (g || grid).appendChild(c);
      });
    }
  } catch (e) {}
}
