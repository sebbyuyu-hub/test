// Service Worker 版本，每次更改內容時必須更新版本號
const CACHE_NAME = 'bookkeeping-v1';

// 應用程式所需緩存的檔案列表
// 必須包含您所有的核心檔案，確保離線可用
const urlsToCache = [
  './', // 根目錄 (index.html)
  './index.html',
  './manifest.json',
  // 如果有其他 CSS/JS/圖片，請在此處添加
];

// 安裝 Service Worker，並緩存所有檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 攔截所有網路請求，優先從緩存中獲取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果緩存中有，直接返回
        if (response) {
          return response;
        }
        // 否則，執行正常的網路請求
        return fetch(event.request);
      })
  );
});

// 激活 Service Worker，清除舊的緩存
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
