const cacheName = 'azkary-cache-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './azkar.json',
  './icon.png'
];

// تثبيت وتخزين الملفات محلياً
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// استدعاء الملفات من الكاش في حال عدم وجود إنترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});