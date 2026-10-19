// JHD Blog · Service Worker（v7：导航 network-first，静态 cache-first）
const CACHE = 'jhd-v7';
const ASSETS = [
  '/JHDblog/',
  '/JHDblog/manifest.json',
  '/JHDblog/images/planet-avatar.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // 第三方（giscus 等）不拦截
  // 导航请求：network-first，失败回落缓存（离线可用）
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('/JHDblog/')))
    );
    return;
  }
  // 静态资源：cache-first + 后台更新
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetched = fetch(e.request).then(res => {
        if (res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
        return res;
      });
      return cached || fetched;
    })
  );
});
