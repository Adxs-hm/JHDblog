// JHD 星空特效引擎 — ES Modules 入口
import { initParallax } from './modules/parallax.js';
import { initCardGlow } from './modules/card-glow.js';
import { initScrollAnim, initCounting, initPageLoad } from './modules/scroll-anim.js';
import { initTocSpy } from './modules/toc-spy.js';

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
  initCardGlow();
  initScrollAnim();
  initCounting();
  initTocSpy();
  initPageLoad();
});

// 如果 DOM 已加载，立即执行
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initParallax();
  initCardGlow();
  initScrollAnim();
  initCounting();
  initTocSpy();
  initPageLoad();
}
