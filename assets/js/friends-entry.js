/* 友链页专属入口：GSAP（Flip + Draggable）+ 友链岛屿
   仅 /friends/ 页加载（extend_footer 按页分包），不进主包 */
import { gsap } from './vendor/gsap/index.js';
import { Flip } from './vendor/gsap/Flip.js';
import { Draggable } from './vendor/gsap/Draggable.js';
import initFriends from './islands/friends.js';

gsap.registerPlugin(Flip, Draggable);
const wrap = document.querySelector('[data-island="friends"]');
if (wrap) initFriends(wrap);
