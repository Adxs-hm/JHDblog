/* 岛屿：专注度（FOCUS）角落组件 —— 6 分钟/点，上限 135 */
const CAP = 135, PER = 6 * 60 * 1000;
const LINES = [
  '> 缓冲区已补充。',
  '> 建议合理安排连续使用时长。',
  '> 后台任务正常运行。',
  '> 已记录本次恢复。',
  '> 缓冲区已满。终端待命。',
  '> 检测到长时间连续运行。'
];

export default function initFocus() {
  if (document.querySelector('.trm-focus')) return;
  let st = { v: CAP, t: Date.now() };
  try {
    const raw = JSON.parse(localStorage.getItem('jhd:focus') || 'null');
    /* 类型白名单：数值且有限才采信，并钳制到 [0, CAP]——存储损坏/篡改不外泄 */
    if (raw && typeof raw.v === 'number' && Number.isFinite(raw.v)) {
      st = { v: Math.min(CAP, Math.max(0, Math.round(raw.v))), t: raw.t || Date.now() };
    }
  } catch (e) {}
  if (!st.t) st.t = Date.now();
  const gain = Math.floor((Date.now() - st.t) / PER);
  if (gain > 0) {
    st.v = Math.min(CAP, st.v + gain);
    st.t += gain * PER;
    try { localStorage.setItem('jhd:focus', JSON.stringify(st)); } catch (e) {}
  }

  const el = document.createElement('div');
  el.className = 'trm-focus';
  el.innerHTML = 'FOCUS // <b>' + st.v + '/' + CAP + '</b><div class="trm-focus__line"></div>';
  document.body.appendChild(el);

  const valEl = el.querySelector('b');
  const line = el.querySelector('.trm-focus__line');
  let open = false;
  el.addEventListener('click', () => {
    open = !open;
    el.classList.toggle('is-open', open);
    if (open) line.textContent = '> ' + LINES[Math.floor(Math.random() * LINES.length)];
  });

  /* 每 60s 刷新一次显示（跨天恢复由时间差计算，无需长任务）*/
  setInterval(() => {
    const g = Math.floor((Date.now() - st.t) / PER);
    if (g > 0) {
      st.v = Math.min(CAP, st.v + g);
      st.t += g * PER;
      try { localStorage.setItem('jhd:focus', JSON.stringify(st)); } catch (e) {}
    }
    valEl.textContent = st.v + '/' + CAP;
  }, 60000);
}
