const CACHE_NAME = 'osanpo-bingo-v4';
const urlsToCache = [
  'index.html',
  'game.html',
  'landing.css',
  'styles.css',
  'topics.js',
  'app.js',
  'manifest.json',
  'lib/html2canvas.min.js'
];

// インストール時にキャッシュを作成
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// フェッチ時にキャッシュから取得
self.addEventListener('fetch', (event) => {
  // ナビゲーション（ページ遷移）はSWを通さずブラウザに任せる（リンクエラー回避）
  if (event.request.mode === 'navigate') return;
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// アクティベート時に古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
