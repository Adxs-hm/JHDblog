/* 岛屿：理智（SANITY）角落组件 —— 6 分钟/点，上限 135，与游戏设定一致 */
const CAP = 135, PER = 6 * 60 * 1000;
const LINES = [
  '神经递质补充完毕。',
  '今天也请博士合理安排时间。',
  '源石 Industry 正常运行。',
  'PRTS 已记录本次恢复。',
  '理智已满，terminal 待命。',
  '检测到过度疲劳倾向——开玩笑的。'
];

export default function initSanity() {
  if (document.querySelector('.ak-sanity')) return;
  let st = { v: CAP, t: Date.now() };
  try {
    const raw = JSON.parse(localStorage.getItem('jhd:sanity') || 'null');
    if (raw && typeof raw.v === 'number') st = raw;
  } catch (e) {}
  if (!st.t) st.t = Date.now();
  const gain = Math.floor((Date.now() - st.t) / PER);
  if (gain > 0) {
    st.v = Math.min(CAP, st.v + gain);
    st.t += gain * PER;
    try { localStorage.setItem('jhd:sanity', JSON.stringify(st)); } catch (e) {}
  }

  const el = document.createElement('div');
  el.className = 'ak-sanity';
  el.innerHTML = 'SANITY // <b>' + st.v + '/' + CAP + '</b><div class="ak-sanity__line"></div>';
  document.body.appendChild(el);

  const valEl = el.querySelector('b');
  const line = el.querySelector('.ak-sanity__line');
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
      try { localStorage.setItem('jhd:sanity', JSON.stringify(st)); } catch (e) {}
    }
    valEl.textContent = st.v + '/' + CAP;
  }, 60000);
}
