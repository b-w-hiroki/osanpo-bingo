const CACHE_NAME = 'osanpo-bingo-v81';
const urlsToCache = [
  'index.html',
  'game.html',
  'terms.html',
  'photo-storage.js',
  'landing.css',
  'styles.css',
  'topics.js',
  'app.js',
  'manifest.json',
  'lib/html2canvas.min.js',
  'icon-192.png',
  'icon-512.png',
  'static/osanpo-bingo-battle.png',
  'static/howto-banner.png',
  'static/battlemode.png',
  'static/camera.png',
  'static/Difficultylevel.png',
  'static/field.png',
  'static/FREEMASU.png',
  'static/startbotan.png',
];

// インストール時にキャッシュを作成
// skipWaiting() はここでは呼ばない → ページ側の「今すぐ更新」ボタンで発動
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache).catch(() => {}))
  );
});

// ページからの skipWaiting 要求を受け付ける
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
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
