const CACHE_NAME = 'hood-pencil-cache-v0.1.13';
const URLS_TO_CACHE = ['/', '/js/app.js', '/css/app.css'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('install', (event: any): void => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(
            (cache): Promise<void> => {
                return cache.addAll(URLS_TO_CACHE);
            }
        )
    );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('activate', (event: any): void => {
    event.waitUntil(
        caches.keys().then(
            (cacheNames): Promise<boolean[]> => {
                const promises: Promise<boolean>[] = [];

                cacheNames.forEach((cacheName): void => {
                    if (cacheName !== CACHE_NAME) {
                        promises.push(caches.delete(cacheName));
                    }
                });

                return Promise.all(promises);
            }
        )
    );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('fetch', (event: any): void => {
    event.respondWith(
        caches.match(event.request).then((response): Response | Promise<Response> => {
            if (response) {
                return response;
            }

            const fetchedRequest = event.request.clone();

            return fetch(fetchedRequest).then(
                (response): Response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const cachedResponse = response.clone();

                    caches.open(CACHE_NAME).then((cache): void => {
                        cache.put(event.request, cachedResponse);
                    });

                    return response;
                }
            );
        })
    );
});
