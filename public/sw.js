/* Service Worker - 吉林高考志愿助手 PWA */
const CACHE = 'gaokao-helper-v1';

// 安装：预缓存应用外壳核心资源
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 网络优先、缓存兜底（首页/壳资源）；数据类请求不缓存以保证实时性
self.addEventListener('fetch', (event) => {
  const req = event.request;
  // 只处理同源 GET
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  const url = new URL(req.url);

  // 数据/接口请求不缓存（保证录取数据实时）
  if (url.pathname.includes('/web/api/') || url.pathname.endsWith('.json') && url.pathname.includes('/data/')) {
    event.respondWith(fetch(req));
    return;
  }

  // 静态资源与页面：网络优先，离线兜底
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          // 兜底：任何导航请求失败时回首页缓存
          if (req.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('', { status: 503, statusText: 'Offline' });
        })
      )
  );
});
