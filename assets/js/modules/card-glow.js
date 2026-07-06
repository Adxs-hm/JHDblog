// 卡片光影追随效果
export function initCardGlow() {
  document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.project-card, .post-card, .single-card').forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = (x / rect.width  - 0.5) * 2;
      const cy = (y / rect.height - 0.5) * 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
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
}
