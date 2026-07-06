// 鼠标视差星空效果
export function initParallax() {
  let mx = 0, my = 0, tx = 0, ty = 0;
  const layers = [
    { sel: '.parallax-slow', factor: 0.008 },
    { sel: '.parallax-mid',  factor: 0.015 },
    { sel: '.parallax-fast', factor: 0.03  }
  ];

  document.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth  - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    mx += (tx - mx) * 0.05;
    my += (ty - my) * 0.05;
    layers.forEach((l) => {
      const el = document.querySelector(l.sel);
      if (el) el.style.transform = `translate(${mx * l.factor * 100}px, ${my * l.factor * 100}px)`;
    });
    requestAnimationFrame(animate);
  }
  animate();
}
