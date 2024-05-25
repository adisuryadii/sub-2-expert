const CACHE_NAME = 'version-1';
const urlsToCache = [
    'index.html',
    'favorites.html',
    'detail.html',
    'index.js',
    'favorites.js',
    'detail.js',
    'index.css',
    'favorites.css',
    'detail.css',
];

// Install a service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        }),
    );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => console.log('offline'));
        }),
    );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});