/* 404 页专属入口：终端修复游戏（零依赖 Canvas）
   仅 404 页加载（extend_footer 按页分包） */
import initGame from './games/terminal-recovery.js';

const stage = document.querySelector('[data-island="rec-game"]');
if (stage) initGame(stage);
