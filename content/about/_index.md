---
title: "关于"
date: 2026-06-29T17:09:09+08:00
description: "JHD 站点参数与运行状态"
draft: false
---

## JHD

本站收录自身建造过程的完整记录，范围包括技术架构、设计系统与历次重构。当前界面即最新版本的可运行档案。

> 收录范围：本站自身。

---

## 站点参数

| 参数 | 值 |
|------|-----|
| 生成器 | Hugo Extended（0.168.0，CI 锁定） |
| 主题基底 | PaperMod（深度定制） |
| 设计系统 | TERMINAL v8 · 金/银 |
| 部署 | GitHub Actions → GitHub Pages |
| 评论 | giscus（GitHub Discussions） |
| 搜索 | Fuse.js 全文检索 + `Ctrl+K` |
| 版本史 | v8.6（[构建日志](../changelog/)） |
| 质量门禁 | Lighthouse CI（perf ≥ 0.9 / a11y ≥ 0.95）+ 63 断言冒烟套件 |

---

## 运行状态

<div class="runtime-counter">
  <div class="runtime-digits" id="site-runtime">
    <span class="rt-num">0</span><span class="rt-label">天</span>
    <span class="rt-num">00</span><span class="rt-label">时</span>
    <span class="rt-num">00</span><span class="rt-label">分</span>
    <span class="rt-num">00</span><span class="rt-label">秒</span>
  </div>
  <p class="runtime-since">起始时间 2026-06-30 10:33:33 +08:00</p>
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
