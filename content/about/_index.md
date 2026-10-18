---
title: "关于"
date: 2026-06-29T17:09:09+08:00
description: "关于 JHD"
draft: false
---

## JHD

记录一个网站的建造。

这个站点的存在只有一个目的——**把这座档案馆自己的建造过程留下来**。它的技术架构、它的设计系统、它的每一次重构，都是它收录的内容。你正在阅读的这套界面，本身就是最新的那份档案。

> 唯一的项目，就是本站自身。

---

## 站点参数

| 参数 | 值 |
|------|-----|
| 生成器 | Hugo Extended |
| 主题基底 | PaperMod（深度定制） |
| 设计系统 | 白银档案 v6 · Silver Archive |
| 部署 | GitHub Actions → GitHub Pages |
| 评论 | giscus（GitHub Discussions） |
| 搜索 | Fuse.js 全文检索 + `Ctrl+K` |

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
