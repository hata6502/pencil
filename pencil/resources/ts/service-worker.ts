const CACHE_NAME = 'hood-pencil-cache-v0.1.5';
const URLS_TO_CACHE = ['/', '/js/app.js', '/css/app.css'];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event: any) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            const promises: Promise<boolean>[] = [];

            cacheNames.forEach(cacheName => {
                if (cacheName !== CACHE_NAME) {
                    promises.push(caches.delete(cacheName));
                }
            });

            return Promise.all(promises);
        })
    );
});

self.addEventListener('fetch', (event: any) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }

            const fetchedRequest = event.request.clone();

            return fetch(fetchedRequest).then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const cachedResponse = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, cachedResponse);
                });

                return response;
            });
        })
    );
});
