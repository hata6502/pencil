const CACHE_NAME = 'hood-pencil-cache-v0.2.3';
const URLS_TO_CACHE = [
    '/',

    '/js/app.js',

    '/css/app.css',

    '/images/favicon@32px.png',
    '/images/favicon@192px.png',
    '/images/favicon@512px.png',
    '/images/apple-touch-icon.png',
    '/images/wing.png',
    '/images/ground.png',
    '/images/image.png',
    '/images/clear.png',
    '/images/undo.png',
    '/images/redo.png',
    '/images/transparent.png',
    '/images/pencil-light.png',
    '/images/pencil-medium.png',
    '/images/pencil-bold.png',
    '/images/background-white.png',
    '/images/background-file.png',
    '/images/background-wide.png',

    '/images/animals/お魚.png',
    '/images/animals/イノシシ.png',
    '/images/animals/カエル.png',
    '/images/animals/コブラ.png',
    '/images/animals/ツチノコ.png',
    '/images/animals/フクロウ.png',
    '/images/animals/海老.png',
    '/images/animals/猫.png',
    '/images/animals/イカ.png',
    '/images/animals/ウサギ.png',
    '/images/animals/カバ.png',
    '/images/animals/ゾウ.png',
    '/images/animals/ネズミ.png',
    '/images/animals/リス.png',
    '/images/animals/豚.png',
    '/images/animals/馬.png',

    '/images/landscapes/タージマハル.png',
    '/images/landscapes/チチェン・イッツァ.png',
    '/images/landscapes/ピサの斜塔.png',
    '/images/landscapes/ピラミッド.png',
    '/images/landscapes/街.png',
    '/images/landscapes/教会.png',
    '/images/landscapes/城.png',
    '/images/landscapes/富士山.png'
];

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
                    return response;
                }
            );
        })
    );
});
