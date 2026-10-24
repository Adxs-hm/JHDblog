---
hiddenInRss: true
title: "扫雷"
url: "/minesweeper"
description: "扫雷实现：支持自动标雷与自定义棋盘"
comments: false
---

<div class="ms-kicker">GAME-01 · MINESWEEPER</div>

## 概述

本站内置的扫雷实现。规则采用标准扫雷规则，界面遵循本站设计系统。

<div class="ms-panel">
  <div class="ms-hud">
    <div class="ms-diff">
      <button type="button" class="ms-diff-btn ms-active" data-diff="easy">初级</button>
      <button type="button" class="ms-diff-btn" data-diff="medium">中级</button>
      <button type="button" class="ms-diff-btn" data-diff="hard">高级</button>
      <button type="button" class="ms-diff-btn" data-diff="custom">自定义</button>
    </div>
    <div class="ms-stats">
      <span><span class="ms-stat-label">TIME</span><span class="ms-stat-value" id="ms-time">000</span></span>
      <span><span class="ms-stat-label">MINES</span><span class="ms-stat-value" id="ms-mines">010</span></span>
      <span><span class="ms-stat-label">STATE</span><span class="ms-state-value ms-st-idle" id="ms-state">待击</span></span>
    </div>
  </div>
  <div class="ms-board-wrap"><div id="ms-board" class="ms-board" style="--ms-cols:9"></div></div>
  <div class="ms-controls">
    <button type="button" class="ms-btn" id="ms-restart">重开 RESET</button>
    <label class="ms-switch"><input type="checkbox" data-pref="autoFlag" checked>自动标雷</label>
    <label class="ms-switch"><input type="checkbox" data-pref="question" checked>问号标记</label>
    <div class="ms-custom" id="ms-custom">
      <span>行<input id="ms-in-rows" type="number" min="5" max="40" value="12"></span>
      <span>列<input id="ms-in-cols" type="number" min="5" max="40" value="12"></span>
      <span>雷<input id="ms-in-mines" type="number" min="1" value="20"></span>
    </div>
  </div>
  <div class="ms-best" id="ms-best">BEST · ——</div>
</div>

## 规则

- **左键**挖开格子，数字表示周围八格中的雷数
- **右键**循环标记：旗 → 问号 → 清除（问号可在控制栏关闭）
- 数字格周围旗数够了，**左键点数字**自动挖开其余格子（Chord）
- 触屏：轻触挖开，**长按插旗**
- **自动标雷**（默认开启）：当某数字周围隐藏格数等于剩余雷数时自动插旗；展开操作仍需手动。关闭后为纯手动模式
- 首次点击及其邻域保证无雷。难度、开关与最佳用时记录于本机 localStorage
