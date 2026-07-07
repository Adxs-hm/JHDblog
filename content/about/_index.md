---
title: "关于"
date: 2026-06-29T17:09:09+08:00
description: "关于 JHD"
draft: false
---

## JHD

记录每一个完成的成品。

这个站点的存在只有一个目的——**把做出来的东西留下来**。无论是工具、项目、想法，还是某个瞬间的成果，都在这里。

> 在星轨中留下足迹。

---

## ⏱ 本站已运行

<div class="runtime-counter">
  <div class="runtime-digits" id="site-runtime">
    <span class="rt-num">0</span><span class="rt-label">天</span>
    <span class="rt-num">00</span><span class="rt-label">时</span>
    <span class="rt-num">00</span><span class="rt-label">分</span>
    <span class="rt-num">00</span><span class="rt-label">秒</span>
  </div>
  <p class="runtime-since">自 2026 年 6 月 30 日起</p>
</div>

<script>
(function(){
  var launch = new Date('2026-06-30T10:33:33+08:00').getTime();
  var el = document.getElementById('site-runtime');
  if(!el) return;
  function tick(){
    var diff = Date.now() - launch;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    el.innerHTML =
      '<span class="rt-num">'+d+'</span><span class="rt-label">天</span>'+
      '<span class="rt-num">'+String(h).padStart(2,'0')+'</span><span class="rt-label">时</span>'+
      '<span class="rt-num">'+String(m).padStart(2,'0')+'</span><span class="rt-label">分</span>'+
      '<span class="rt-num">'+String(s).padStart(2,'0')+'</span><span class="rt-label">秒</span>';
  }
  tick();setInterval(tick,1000);
})();
</script>
