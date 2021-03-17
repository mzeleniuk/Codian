const staticCacheName = 'codian-static-v1';
const dynamicCacheName = 'codian-dynamic-v1';

const assetUrls = [
    '/index.html',
    '/offline.html',
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

    await Promise.all(cacheNames.filter((name) => {
        return name !== staticCacheName && name !== dynamicCacheName;
    }).map((name) => caches.delete(name)));
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.origin === location.origin) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? await fetch(request);
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName);

    try {
        const response = await fetch(request);

        await cache.put(request, response.clone());
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        return cached ?? await caches.match('/offline.html');
    }
}
