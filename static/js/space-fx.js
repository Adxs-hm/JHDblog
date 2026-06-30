/**
 * JHD 星空特效引擎
 * 鼠标视差 · 滚动入场 · 卡片光影追随 · 星际粒子
 */
(function() {
  'use strict';

  // ============ 1. 鼠标视差星空 ============
  let mx = 0, my = 0, tx = 0, ty = 0;
  const parallaxLayers = [
    { sel: '.parallax-slow', factor: 0.008 },
    { sel: '.parallax-mid',  factor: 0.015 },
    { sel: '.parallax-fast', factor: 0.03  }
  ];

  document.addEventListener('mousemove', function(e) {
    tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateParallax() {
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    parallaxLayers.forEach(function(l) {
      var el = document.querySelector(l.sel);
      if (el) {
        el.style.transform = 'translate(' + (mx * l.factor * 100) + 'px, ' + (my * l.factor * 100) + 'px)';
      }
    });
    requestAnimationFrame(animateParallax);
  }
  animateParallax();

  // ============ 2. 卡片光影追随 ============
  document.addEventListener('mousemove', function(e) {
    document.querySelectorAll('.project-card, .post-card, .single-card').forEach(function(card) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = (x / rect.width  - 0.5) * 2;
      var cy = (y / rect.height - 0.5) * 2;
      var dist = Math.sqrt(cx*cx + cy*cy);
      if (dist < 1.5) {
        card.style.setProperty('--mx', cx.toFixed(3));
        card.style.setProperty('--my', cy.toFixed(3));
        card.style.setProperty('--glow-x', (x / rect.width * 100).toFixed(1) + '%');
        card.style.setProperty('--glow-y', (y / rect.height * 100).toFixed(1) + '%');
        card.classList.add('card-hover-active');
      } else {
        card.classList.remove('card-hover-active');
      }
    });
  });

  // ============ 3. 滚动入场动画 (Intersection Observer) ============
  var observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
  var appearObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
        appearObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .project-card, .post-card, .stat-item, blockquote, table, pre').forEach(function(el) {
    if (!el.classList.contains('fade-up')) el.classList.add('fade-up');
    appearObserver.observe(el);
  });

  // ============ 4. 页面加载淡入 ============
  document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('loaded');
  });
  // 如果 DOM 已经加载完毕
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.body.classList.add('loaded');
  }

  // ============ 5. 数值递增动画（首页大字报） ============
  var counted = false;
  var countObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat-number').forEach(function(el) {
          var target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
          if (!target || isNaN(target)) return;
          var start = 0, duration = 1200, step = Math.ceil(target / (duration / 16));
          var timer = setInterval(function() {
            start += step;
            if (start >= target) { start = target; clearInterval(timer); }
            el.textContent = start;
          }, 16);
        });
      }
    });
  }, { threshold: 0.5 });
  var banner = document.querySelector('.stat-banner');
  if (banner) countObserver.observe(banner);

})();
