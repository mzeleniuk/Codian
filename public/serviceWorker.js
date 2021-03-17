const staticCacheName = 'codian-static-v1';

const assetUrls = [
    '/static/index.html',
    '/static/app.js',
    '/static/index.css',
    '/static/brand.svg',
    '/static/icon-144-144.png'
];

self.addEventListener('install', async () => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(assetUrls);
});

self.addEventListener('activate', async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name !== staticCacheName).map((name) => caches.delete(name)));
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? await fetch(request);
}
