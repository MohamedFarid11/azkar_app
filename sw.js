const cacheName = 'azkary-cache-v2'; // [تحديث] تغيير الإصدار إلى v2 لإجبار المتصفح على التحديث
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
    }).then(() => self.skipWaiting()) // إجبار الـ Service Worker الجديد على التنشيط فوراً
  );
});

// تنظيف الكاش القديم (v1) تلقائياً عند تفعيل الكاش الجديد
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// [تحديث] إستراتيجية استدعاء ذكية: جلب الملف من شبكة الإنترنت أولاً لتحديث الداتا، وإذا انقطع النت يتم الجلب من الكاش
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(networkResponse => {
        // لو النت شغال، خذ النسخة الجديدة وخزنها في الكاش ورجعها للمستخدم
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(cacheName).then(cache => cache.put(e.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(() => {
        // لو النت مقطوع (أوفلاين)، رجع النسخة المتخزنة في الكاش فوراً
        return caches.match(e.request);
      })
  );
});