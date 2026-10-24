/* ============================================================
   扫雷 core 回归测试（Node，零依赖）
   运行：node .tools/test-minesweeper.js
   覆盖：建局 / 雷数钳制 / 首击安全区 / 揭格与洪水填充 /
         插旗与问号 / flagsAround / chord 门控 / 踩雷判负 /
         autoStep「只插旗不自动挖开」设计决策
   ============================================================ */
'use strict';

var core = require('../static/js/minesweeper.js');

var pass = 0, fail = 0;
function t(name, cond) {
  if (cond) { pass++; console.log('  PASS  ' + name); }
  else { fail++; console.log('  FAIL  ' + name); }
}

/* ── 1. 建局与钳制 ── */
var g = core.createGame(9, 9, 10);
t('createGame 尺寸与雷数', g.rows === 9 && g.cols === 9 && g.mines === 10);
t('初始 state=idle 全隐藏', g.state === 'idle' && g.revealed === 0 && g.flags === 0);
t('雷数上限钳制（5x5 → 16）', core.clampMines(5, 5, 999) === 16);
t('雷数下限钳制（≥1）', core.clampMines(5, 5, -3) === 1);

/* ── 2. 首击安全与布雷 ── */
var ev = [];
core.reveal(g, 4, 4, ev);
t('首击后 state=play', g.state === 'play');
t('首击格已揭开且非雷', core.at(g, 4, 4).revealed && !core.at(g, 4, 4).mine);
t('首击 3x3 安全区无雷', core.neighborIdx(g, 4, 4).every(function (i) { return !g.cells[i].mine; }));
t('全场雷数精确 = 10', g.cells.filter(function (c) { return c.mine; }).length === 10);

/* ── 3. 插旗 / 问号 / 计数 ── */
var g2 = core.createGame(9, 9, 10);
core.reveal(g2, 0, 0, []);
/* 首击洪水填充区域随机，须选一个确定性隐藏格做标记测试 */
var hiddenIdx = -1;
g2.cells.forEach(function (c, i) { if (hiddenIdx < 0 && !c.revealed && c.mark === 0) hiddenIdx = i; });
var hr = Math.floor(hiddenIdx / g2.cols), hc = hiddenIdx % g2.cols;
core.toggleMark(g2, hr, hc, false, []);
t('插旗后 flags=1', g2.flags === 1 && core.at(g2, hr, hc).mark === 1);
var flagsConsistent = g2.cells.every(function (c, i) {
  var r = Math.floor(i / g2.cols), cc = i % g2.cols;
  var expected = core.neighborIdx(g2, r, cc).filter(function (j) { return g2.cells[j].mark === 1; }).length;
  return core.flagsAround(g2, r, cc) === expected;
});
t('flagsAround 全场一致', flagsConsistent && g2.flags === 1);
core.toggleMark(g2, hr, hc, false, []);
t('无问号档再点即取消', g2.flags === 0 && core.at(g2, hr, hc).mark === 0);
core.toggleMark(g2, hr, hc, true, []);
core.toggleMark(g2, hr, hc, true, []);
t('问号档 mark=2', core.at(g2, hr, hc).mark === 2);
t('已揭开格不可插旗', (function () {
  var c = core.at(g2, 0, 0);
  var before = c.mark;
  core.toggleMark(g2, 0, 0, false, []);
  return core.at(g2, 0, 0).mark === before;
})());

/* ── 4. chord 门控（旗数不匹配时无动作） ── */
var g4 = core.createGame(4, 4, 1);
core.reveal(g4, 0, 0, []);
var ev4 = [];
core.chord(g4, 0, 0, ev4);
t('chord 旗数不匹配时无动作', ev4.length === 0);

/* ── 5. 踩雷判负 ── */
/* 用 9×9/10 雷：小棋盘少雷时首击洪水填充可能直接满足胜利条件
   （5×5 单雷即如此），须保证首击后仍是 play 态才能测踩雷 */
var g5 = core.createGame(9, 9, 10);
core.reveal(g5, 4, 4, []);
t('首击后仍为 play（未意外通关）', g5.state === 'play');
var mineIdx = -1;
g5.cells.forEach(function (c, i) { if (c.mine && mineIdx < 0) mineIdx = i; });
core.reveal(g5, Math.floor(mineIdx / 9), mineIdx % 9, []);
t('踩雷判负', g5.state === 'lose');

/* ── 6. autoStep 设计决策：只插旗，绝不自动挖开 ── */
var g3 = core.createGame(9, 9, 10);
core.reveal(g3, 4, 4, []);
var revealedBefore = g3.revealed;
var ev3 = [];
core.autoStep(g3, ev3);
t('autoStep 不产生 reveal 事件', ev3.filter(function (e) { return e.type === 'reveal'; }).length === 0);
t('autoStep 不改变已揭开数', g3.revealed === revealedBefore);
t('autoStep 事件仅标记类', ev3.every(function (e) {
  return e.type === 'flag' || e.type === 'question' || e.type === 'unflag';
}));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
