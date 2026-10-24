/* ═══════════════════════════════════════════════════════════
   JHD · GAME-01 MINESWEEPER — Silver Archive v6
   纯逻辑 core（可 Node 测试）+ 浏览器 UI
   ═══════════════════════════════════════════════════════════ */
(function (root, factory) {
  var core = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  root.MinesweeperCore = core;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ─────────── CORE：纯逻辑 ─────────── */

  var DIFFICULTIES = {
    easy:   { label: '初级', rows: 9,  cols: 9,  mines: 10 },
    medium: { label: '中级', rows: 16, cols: 16, mines: 40 },
    hard:   { label: '高级', rows: 16, cols: 30, mines: 99 }
  };
  var LIMITS = { minRows: 5, maxRows: 40, minCols: 5, maxCols: 40, safeZone: 9 };

  function clampMines(rows, cols, mines) {
    var max = rows * cols - LIMITS.safeZone;
    return Math.max(1, Math.min(mines, max));
  }

  function createGame(rows, cols, mines) {
    var g = {
      rows: rows, cols: cols,
      mines: clampMines(rows, cols, mines),
      cells: [], state: 'idle', revealed: 0, flags: 0
    };
    for (var i = 0; i < rows * cols; i++) {
      g.cells.push({ mine: false, revealed: false, mark: 0, count: 0 });
    }
    return g;
  }

  function at(g, r, c) { return g.cells[r * g.cols + c]; }

  function neighborIdx(g, r, c) {
    var out = [];
    for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      var nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr >= g.rows || nc >= g.cols) continue;
      out.push(nr * g.cols + nc);
    }
    return out;
  }

  function placeMines(g, safeR, safeC) {
    var safe = {};
    safe[safeR * g.cols + safeC] = true;
    neighborIdx(g, safeR, safeC).forEach(function (i) { safe[i] = true; });
    var spots = [];
    for (var i = 0; i < g.cells.length; i++) if (!safe[i]) spots.push(i);
    for (var k = spots.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1)), t = spots[k]; spots[k] = spots[j]; spots[j] = t;
    }
    for (var m = 0; m < g.mines; m++) g.cells[spots[m]].mine = true;
    for (var r = 0; r < g.rows; r++) for (var c = 0; c < g.cols; c++) {
      var cell = at(g, r, c), n = 0;
      neighborIdx(g, r, c).forEach(function (i) { if (g.cells[i].mine) n++; });
      cell.count = n;
    }
  }

  function revealAllMines(g, events) {
    g.cells.forEach(function (cell, i) {
      var r = Math.floor(i / g.cols), c = i % g.cols;
      if (cell.mine && cell.mark !== 1) events.push({ type: 'mine', r: r, c: c });
      if (!cell.mine && cell.mark === 1) events.push({ type: 'wrong', r: r, c: c });
    });
  }

  function checkWin(g, events) {
    if (g.revealed !== g.rows * g.cols - g.mines) return;
    g.state = 'win';
    g.cells.forEach(function (cell, i) {
      if (cell.mine && cell.mark !== 1) {
        cell.mark = 1; g.flags++;
        events.push({ type: 'flag', r: Math.floor(i / g.cols), c: i % g.cols, auto: true });
      }
    });
    events.push({ type: 'win' });
  }

  function reveal(g, r, c, events) {
    var cell = at(g, r, c);
    if (cell.revealed || cell.mark === 1) return;
    if (g.state === 'idle') { placeMines(g, r, c); g.state = 'play'; }
    else if (g.state !== 'play') return;
    cell.revealed = true; g.revealed++;
    events.push({ type: 'reveal', r: r, c: c });
    if (cell.mine) {
      g.state = 'lose';
      events.push({ type: 'boom', r: r, c: c });
      revealAllMines(g, events);
      return;
    }
    if (cell.count === 0) {
      var stack = neighborIdx(g, r, c), seen = {};
      seen[r * g.cols + c] = true;
      while (stack.length) {
        var i = stack.pop();
        if (seen[i]) continue; seen[i] = true;
        var nr = Math.floor(i / g.cols), nc = i % g.cols, n = g.cells[i];
        if (n.revealed || n.mark === 1) continue;
        n.revealed = true; g.revealed++;
        events.push({ type: 'reveal', r: nr, c: nc });
        if (n.count === 0) neighborIdx(g, nr, nc).forEach(function (x) { stack.push(x); });
      }
    }
    checkWin(g, events);
  }

  function toggleMark(g, r, c, allowQuestion, events) {
    var cell = at(g, r, c);
    if (cell.revealed || g.state === 'win' || g.state === 'lose') return;
    if (cell.mark === 0) { cell.mark = 1; g.flags++; events.push({ type: 'flag', r: r, c: c }); }
    else if (cell.mark === 1) {
      cell.mark = allowQuestion ? 2 : 0; g.flags--;
      events.push({ type: allowQuestion ? 'question' : 'unflag', r: r, c: c });
    } else { cell.mark = 0; events.push({ type: 'unflag', r: r, c: c }); }
  }

  function flagsAround(g, r, c) {
    var n = 0;
    neighborIdx(g, r, c).forEach(function (i) { if (g.cells[i].mark === 1) n++; });
    return n;
  }

  function hiddenAround(g, r, c) {
    var out = [];
    neighborIdx(g, r, c).forEach(function (i) {
      var cell = g.cells[i];
      if (!cell.revealed && cell.mark !== 1) out.push(i);
    });
    return out;
  }

  function chord(g, r, c, events) {
    var cell = at(g, r, c);
    if (!cell.revealed || cell.count === 0 || g.state !== 'play') return;
    if (flagsAround(g, r, c) !== cell.count) return;
    hiddenAround(g, r, c).forEach(function (i) {
      if (g.state !== 'play') return;
      reveal(g, Math.floor(i / g.cols), i % g.cols, events);
    });
  }

  /* 自动标雷：数字周围「隐藏格数 == 剩余雷数」时自动插旗。
     只插旗、不自动挖开——展开交由玩家手动 chord，保留游戏性。 */
  function autoStep(g, events) {
    var changed = true, guard = 0;
    while (changed && g.state === 'play' && guard++ < 200) {
      changed = false;
      for (var r = 0; r < g.rows; r++) for (var c = 0; c < g.cols; c++) {
        var cell = at(g, r, c);
        if (!cell.revealed || cell.count === 0) continue;
        var hidden = hiddenAround(g, r, c);
        if (!hidden.length) continue;
        var rest = cell.count - flagsAround(g, r, c);
        if (rest === hidden.length && rest > 0) {
          hidden.forEach(function (i) {
            var hc = g.cells[i];
            hc.mark = 1; g.flags++;
            events.push({ type: 'flag', r: Math.floor(i / g.cols), c: i % g.cols, auto: true });
          });
          changed = true;
        }
      }
    }
    checkWin(g, events);
  }

  /* ─────────── UI：浏览器 ─────────── */

  var ICON = {
    flag: '<svg viewBox="0 0 16 16" class="ms-ico" aria-hidden="true"><path d="M4.5 2v12.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M5 2.5h8L10.8 5.6 13 8.5H5z" fill="currentColor"/><path d="M2.5 14.5h11" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>',
    mine: '<svg viewBox="0 0 16 16" class="ms-ico" aria-hidden="true"><circle cx="8" cy="8" r="3.4" fill="currentColor"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M12.6 3.4l-2.1 2.1M5.5 10.5l-2.1 2.1" stroke="currentColor" stroke-width="1.3" fill="none"/></svg>',
    wrong: '<svg viewBox="0 0 16 16" class="ms-ico" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" fill="none"/></svg>'
  };

  function initUI() {
    var boardEl = document.getElementById('ms-board');
    var timeEl = document.getElementById('ms-time');
    var minesEl = document.getElementById('ms-mines');
    var stateEl = document.getElementById('ms-state');
    var bestEl = document.getElementById('ms-best');
    var customEl = document.getElementById('ms-custom');
    var prefs = {};
    try {
      prefs = JSON.parse(localStorage.getItem('ms-prefs') || '{}');
    } catch (e) { /* localStorage 不可用时静默降级 */ }

    var cfg = {
      difficulty: prefs.difficulty || 'easy',
      autoFlag: prefs.autoFlag !== false,
      question: prefs.question !== false,
      rows: prefs.rows || 0, cols: prefs.cols || 0, mines: prefs.mines || 0
    };
    var g = null, timer = null, seconds = 0, touchTimer = null, touchFired = false;

    function savePrefs() {
      try { localStorage.setItem('ms-prefs', JSON.stringify(cfg)); } catch (e) {}
    }

    function dims() {
      if (cfg.difficulty === 'custom') {
        var r = clampInt(cfg.rows, 5, 40, 12), c = clampInt(cfg.cols, 5, 40, 12);
        var m = clampInt(cfg.mines, 1, r * c - 9, Math.floor(r * c * 0.15));
        cfg.rows = r; cfg.cols = c; cfg.mines = m;
        return { rows: r, cols: c, mines: m };
      }
      var d = DIFFICULTIES.hasOwnProperty(cfg.difficulty) ? DIFFICULTIES[cfg.difficulty] : DIFFICULTIES.easy; /* 白名单：原型链污染（如 "constructor"）回落 easy */
      return { rows: d.rows, cols: d.cols, mines: d.mines };
    }
    function clampInt(v, lo, hi, dflt) {
      v = parseInt(v, 10);
      if (isNaN(v)) v = dflt;
      return Math.max(lo, Math.min(hi, v));
    }

    /* ── 渲染 ── */
    function renderBoard() {
      boardEl.innerHTML = '';
      boardEl.style.setProperty('--ms-cols', g.cols);
      boardEl.className = 'ms-board';
      var frag = document.createDocumentFragment();
      for (var r = 0; r < g.rows; r++) for (var c = 0; c < g.cols; c++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'ms-cell';
        b.dataset.r = r; b.dataset.c = c;
        b.setAttribute('aria-label', '格子 ' + (r + 1) + '-' + (c + 1));
        frag.appendChild(b);
      }
      boardEl.appendChild(frag);
      paintAll();
    }

    function cellEl(r, c) { return boardEl.children[r * g.cols + c]; }

    function paintCell(r, c) {
      var el = cellEl(r, c), cell = at(g, r, c);
      if (!el) return;
      var cls = 'ms-cell';
      if (cell.revealed) cls += ' ms-open';
      if (cell.mark === 1) cls += ' ms-flag';
      if (cell.mark === 2) cls += ' ms-ques';
      el.className = cls;
      var html = '';
      if (cell.revealed) {
        if (cell.mine) html = ICON.mine;
        else if (cell.count > 0) html = '<span class="ms-num ms-n' + cell.count + '">' + cell.count + '</span>';
      } else if (cell.mark === 1) html = ICON.flag;
      else if (cell.mark === 2) html = '<span class="ms-ques-mark">?</span>';
      el.innerHTML = html;
    }

    function paintAll() {
      for (var r = 0; r < g.rows; r++) for (var c = 0; c < g.cols; c++) paintCell(r, c);
      updateHUD();
    }

    function updateHUD() {
      timeEl.textContent = pad3(seconds);
      var left = g.mines - g.flags;
      minesEl.textContent = left < 0 ? '-' + String(-left).padStart(2, '0') : pad3(left);
      var st = { idle: '待击', play: '排雷中', win: '已肃清', lose: '触雷' }[g.state];
      stateEl.textContent = st;
      stateEl.className = 'ms-state-value ms-st-' + g.state;
      boardEl.classList.toggle('ms-over', g.state === 'win' || g.state === 'lose');
      boardEl.classList.toggle('ms-win', g.state === 'win');
      boardEl.classList.toggle('ms-lose', g.state === 'lose');
    }
    function pad3(n) { return String(Math.min(999, n)).padStart(3, '0'); }

    function startTimer() {
      stopTimer();
      timer = setInterval(function () {
        seconds++; updateHUD();
        if (seconds >= 999) stopTimer();
      }, 1000);
    }
    function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }

    /* ── 事件应用 ── */
    function applyEvents(events) {
      events.forEach(function (e) {
        var el = cellEl(e.r, e.c);
        if (!el) return;
        if (e.type === 'boom') { el.classList.add('ms-boom'); paintCell(e.r, e.c); return; }
        if (e.type === 'mine') { el.classList.add('ms-mine-show'); el.innerHTML = ICON.mine; return; }
        if (e.type === 'wrong') { el.classList.add('ms-wrong'); el.innerHTML = ICON.wrong; return; }
        paintCell(e.r, e.c);
      });
      updateHUD();
      if (g.state === 'win') {
        stopTimer();
        var key = 'ms-best-' + cfg.difficulty + '-' + g.rows + 'x' + g.cols;
        var prev = null;
        try { prev = parseInt(localStorage.getItem(key), 10); } catch (e2) {}
        if (isNaN(prev) || seconds < prev) {
          try { localStorage.setItem(key, String(seconds)); } catch (e3) {}
          renderBest(key + '|' + seconds);
        } else renderBest();
      }
      if (g.state === 'lose') stopTimer();
    }

    function afterUserAction(events) {
      if (cfg.autoFlag && g.state === 'play') autoStep(g, events);
      applyEvents(events);
    }

    /* ── 交互 ── */
    function primary(r, c) {
      if (g.state === 'win' || g.state === 'lose') return;
      var events = [];
      var cell = at(g, r, c);
      if (cell.revealed && cell.count > 0) chord(g, r, c, events);
      else reveal(g, r, c, events);
      if (g.state === 'play' && !timer) startTimer();
      afterUserAction(events);
    }

    function secondary(r, c) {
      if (g.state === 'win' || g.state === 'lose') return;
      var events = [];
      toggleMark(g, r, c, cfg.question, events);
      afterUserAction(events);
    }

    boardEl.addEventListener('click', function (e) {
      var t = e.target.closest('.ms-cell');
      if (!t || touchFired) { touchFired = false; return; }
      primary(+t.dataset.r, +t.dataset.c);
    });
    boardEl.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      var t = e.target.closest('.ms-cell');
      if (t) secondary(+t.dataset.r, +t.dataset.c);
    });
    /* 触摸：轻触挖开，长按 450ms 标旗 */
    boardEl.addEventListener('touchstart', function (e) {
      var t = e.target.closest('.ms-cell');
      if (!t) return;
      touchFired = false;
      touchTimer = setTimeout(function () {
        touchFired = true;
        secondary(+t.dataset.r, +t.dataset.c);
        if (navigator.vibrate) navigator.vibrate(15);
      }, 450);
    }, { passive: true });
    boardEl.addEventListener('touchend', function (e) {
      if (touchTimer) { clearTimeout(touchTimer); touchTimer = null; }
      var t = e.target.closest('.ms-cell');
      if (t && !touchFired) { touchFired = true; primary(+t.dataset.r, +t.dataset.c); }
      e.preventDefault();
    });
    boardEl.addEventListener('touchmove', function () {
      if (touchTimer) { clearTimeout(touchTimer); touchTimer = null; }
    });

    /* ── 控制条 ── */
    function renderDifficulty() {
      document.querySelectorAll('.ms-diff-btn').forEach(function (b) {
        b.classList.toggle('ms-active', b.dataset.diff === cfg.difficulty);
      });
      customEl.style.display = cfg.difficulty === 'custom' ? 'flex' : 'none';
    }

    document.querySelectorAll('.ms-diff-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        cfg.difficulty = b.dataset.diff;
        savePrefs(); renderDifficulty(); newGame();
      });
    });

    document.querySelectorAll('.ms-switch input').forEach(function (sw) {
      var key = sw.dataset.pref;
      sw.checked = cfg[key];
      sw.addEventListener('change', function () {
        cfg[key] = sw.checked;
        savePrefs();
        if (key === 'question' && !sw.checked) {
          /* 关闭问号时把场上问号清除为无标记 */
          g.cells.forEach(function (cell, i) {
            if (cell.mark === 2) {
              cell.mark = 0;
              paintCell(Math.floor(i / g.cols), i % g.cols);
            }
          });
        }
      });
    });

    ['ms-in-rows', 'ms-in-cols', 'ms-in-mines'].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('change', function () {
        cfg.rows = clampInt(document.getElementById('ms-in-rows').value, 5, 40, 12);
        cfg.cols = clampInt(document.getElementById('ms-in-cols').value, 5, 40, 12);
        var maxM = cfg.rows * cfg.cols - 9;
        cfg.mines = clampInt(document.getElementById('ms-in-mines').value, 1, maxM, Math.floor(cfg.rows * cfg.cols * 0.15));
        document.getElementById('ms-in-mines').max = maxM;
        savePrefs();
        if (cfg.difficulty === 'custom') newGame();
      });
    });

    function renderBest(justSet) {
      var parts = [];
      ['easy', 'medium', 'hard'].forEach(function (k) {
        var d = DIFFICULTIES[k];
        var v = null;
        try { v = localStorage.getItem('ms-best-' + k + '-' + d.rows + 'x' + d.cols); } catch (e) {}
        if (v) parts.push(d.label + ' ' + pad3(+v) + 's');
      });
      bestEl.textContent = parts.length ? 'BEST · ' + parts.join(' / ') : 'BEST · ——';
      if (justSet) bestEl.classList.add('ms-flash');
      setTimeout(function () { bestEl.classList.remove('ms-flash'); }, 1600);
    }

    document.getElementById('ms-restart').addEventListener('click', newGame);

    function newGame() {
      var d = dims();
      g = createGame(d.rows, d.cols, d.mines);
      seconds = 0; stopTimer();
      renderDifficulty();
      renderBoard();
      renderBest();
    }

    /* 初始化输入框提示值 */
    (function initInputs() {
      var d = dims();
      document.getElementById('ms-in-rows').value = d.rows;
      document.getElementById('ms-in-cols').value = d.cols;
      document.getElementById('ms-in-mines').value = d.mines;
      document.getElementById('ms-in-mines').max = d.rows * d.cols - 9;
    })();

    newGame();
  }

  /* 浏览器中自动初始化（Node 下 document 不存在，仅导出 core） */
  if (typeof document !== 'undefined' && document.getElementById('ms-board')) initUI();

  return { createGame: createGame, DIFFICULTIES: DIFFICULTIES, LIMITS: LIMITS,
    neighborIdx: neighborIdx, reveal: reveal, toggleMark: toggleMark, chord: chord,
    autoStep: autoStep, placeMines: placeMines, at: at, flagsAround: flagsAround,
    hiddenAround: hiddenAround, clampMines: clampMines };
});
