/* 404 页专属入口：PRTS 终端修复游戏（零依赖 Canvas）
   仅 404 页加载（extend_footer 按页分包） */
import initGame from './games/prts-recovery.js';

const stage = document.querySelector('[data-island="prts-game"]');
if (stage) initGame(stage);
