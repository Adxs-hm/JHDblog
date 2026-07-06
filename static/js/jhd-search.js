/**
 * JHD 搜索组件 —— 自动补全 · 关键词高亮 · 可点击跳转
 */
(function(){
  'use strict';
  var fuse = null, data = null, activeIdx = -1;
  var input = document.getElementById('search-input-desktop');
  var mobileInput = document.getElementById('search-input-mobile');

  function createDropdown(){
    var dd = document.createElement('div');
    dd.id = 'jhd-search-results';
    dd.className = 'jhd-search-panel';
    dd.setAttribute('role', 'listbox');
    dd.setAttribute('aria-label', '搜索结果');
    dd.style.display = 'none';
    document.body.appendChild(dd);
    return dd;
  }
  var panel = createDropdown();

  function positionPanel(inp){
    var r = inp.getBoundingClientRect();
    panel.style.top = (r.bottom + 8) + 'px';
    panel.style.left = r.left + 'px';
    panel.style.minWidth = Math.max(420, r.width) + 'px';
  }

  function highlight(text, query){
    var esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + esc + ')', 'gi'), '<mark>$1</mark>');
  }

  function doSearch(query){
    if (!fuse || query.length < 2) { panel.style.display = 'none'; return; }
    var results = fuse.search(query).slice(0, 10);
    if (!results.length) {
      panel.innerHTML = '<div class="jsh-empty" role="option" aria-selected="false">没有找到结果</div>';
      panel.style.display = 'block';
      return;
    }
    var html = '';
    results.forEach(function(r, i){
      var item = r.item;
      var title = highlight(item.title || '', query);
      var uri = item.uri || '';
      var snippet = (item.content || '').substring(0, 120);
      snippet = highlight(snippet, query);
      html += '<a class="jsh-item' + (i===0?' active':'') + '" href="' + uri + '" data-idx="' + i + '" role="option" aria-selected="' + (i===0?'true':'false') + '">' +
        '<span class="jsh-title">' + title + '</span>' +
        '<span class="jsh-uri">' + uri + '</span>' +
        '<span class="jsh-snippet">' + snippet + '</span>' +
        '</a>';
    });
    panel.innerHTML = html;
    panel.style.display = 'block';
    activeIdx = 0;
  }

  function setup(inp){
    if (!inp) return;
    inp.setAttribute('role', 'combobox');
    inp.setAttribute('aria-autocomplete', 'list');
    inp.setAttribute('aria-label', '搜索文章');
    inp.setAttribute('aria-expanded', 'false');
    inp.setAttribute('autocomplete', 'off');
    inp.addEventListener('input', function(){
      positionPanel(inp);
      doSearch(this.value.trim());
    });
    inp.addEventListener('focus', function(){
      positionPanel(inp);
      if (this.value.trim().length >= 2) doSearch(this.value.trim());
    });
    inp.addEventListener('keydown', function(e){
      var items = panel.querySelectorAll('.jsh-item');
      if (e.key === 'Escape') { panel.style.display = 'none'; return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        var sel = panel.querySelector('.jsh-item.active');
        if (sel) window.location.href = sel.getAttribute('href');
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx += e.key === 'ArrowDown' ? 1 : -1;
        if (activeIdx < 0) activeIdx = items.length - 1;
        if (activeIdx >= items.length) activeIdx = 0;
        items.forEach(function(el, i){
          var isActive = i === activeIdx;
          el.classList.toggle('active', isActive);
          el.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        items[activeIdx] && items[activeIdx].scrollIntoView({block:'nearest'});
      }
    });
    inp.addEventListener('blur', function(){
      setTimeout(function(){ panel.style.display = 'none'; }, 200);
    });
  }

  function loadIndex(){
    fetch(window.JHD_SEARCH_INDEX || '/index.json')
      .then(function(r){ return r.json(); })
      .then(function(d){
        var cleaned = [];
        var seen = {};
        d.forEach(function(item){
          if (!seen[item.uri]) { seen[item.uri] = true; cleaned.push(item); }
        });
        fuse = new Fuse(cleaned, {
          keys: [
            { name: 'title', weight: 5 },
            { name: 'tags', weight: 2 },
            { name: 'categories', weight: 2 },
            { name: 'content', weight: 1 }
          ],
          threshold: 0.35,
          distance: 100,
          minMatchCharLength: 2,
          includeMatches: false
        });
      })
      .catch(function(e){ console.error('Search index load failed:', e); });
  }

  setup(input);
  setup(mobileInput);

  document.addEventListener('click', function(e){
    if (!e.target.closest('.search') && !e.target.closest('.jsh-panel')) {
      panel.style.display = 'none';
    }
  });

  // Wait for Fuse to load
  if (typeof Fuse !== 'undefined') loadIndex();
  else { var t = setInterval(function(){ if (typeof Fuse !== 'undefined'){ clearInterval(t); loadIndex(); } }, 100); }
})();
