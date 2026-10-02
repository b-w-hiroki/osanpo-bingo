const CACHE_NAME = 'osanpo-bingo-v158';
const urlsToCache = [
  'index.html',
  'sister-apps.js',
  'game.html',
  'news.html',
  'news.css',
  'news-data.js',
  'news-page.js',
  'terms.html',
  'topics.html',
  'photo-storage.js',
  'landing.css',
  'styles.css',
  'topics.js',
  'app.js',
  'manifest.json',
  'sitemap.xml',
  'robots.txt',
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
  'static/title-banner-1l.png',
  'static/center_01.png',
  'static/center_02.png',
  'static/center_03.png',
  'static/center_04.png',
  'static/center_05.png',
  'static/center_06.png',
  'static/center_07.png',
  'static/center_08.png',
  'static/center_09.png',
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

// フェッチ時にキャッシュから取得（キャッシュにない場合はネットワーク取得 → 自動キャッシュ保存）
self.addEventListener('fetch', (event) => {
  // ゲーム本体のページ遷移は従来どおりブラウザに任せる。
  // お知らせだけは、圏外でも最後に取得したページを読めるようネットワーク優先＋キャッシュ復帰。
  if (event.request.mode === 'navigate') {
    const path = new URL(event.request.url).pathname;
    if (!path.endsWith('/news.html')) return;
    event.respondWith(
      fetch(event.request).catch(() => caches.match('news.html', { ignoreSearch: true }))
    );
    return;
  }
  // 外部ドメイン（Supabase API等）はキャッシュせずネットワークに直接パス
  // APIレスポンスをキャッシュすると古いデータが返り続けるため
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((networkRes) => {
        // GET リクエストのみ動的キャッシュに保存（アイコン等の初回取得を記録）
        if (event.request.method === 'GET' && networkRes.ok) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkRes;
      }).catch(() => cached); // ネットワークもキャッシュも失敗した場合は空レスポンス
    })
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
