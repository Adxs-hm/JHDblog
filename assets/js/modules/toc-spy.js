// 目录滚动高亮 + 平滑滚动
export function initTocSpy() {
  const tocAuto = document.getElementById('toc-auto');
  const tocLinks = document.querySelectorAll('#toc-auto nav a, #TableOfContents a');
  const headings = document.querySelectorAll('.content h1[id], .content h2[id], .content h3[id], .content h4[id]');

  if (tocAuto && headings.length > 0) {
    if (window.innerWidth > 1024) {
      tocAuto.classList.add('toc-visible');
    }

    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((link) => link.classList.remove('toc-active'));
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`#toc-auto a[href="#${id}"], #TableOfContents a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('toc-active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

    headings.forEach((h) => headingObserver.observe(h));
  }

  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('#', '');
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, null, '#' + id);
      }
    });
  });
}
