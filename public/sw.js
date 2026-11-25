const CACHE_VERSION = "zaheen-v1";

const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

// Files cached during installation
const PRECACHE_URLS = [
    "/",
    "/index.html",
    "/offline.html"
];

// Install
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// Activate
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name.startsWith("zaheen-") &&
                        name !== STATIC_CACHE &&
                        name !== PAGE_CACHE)
                    .map((name) => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// Network-first navigation
async function handleNavigation(request) {
    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(PAGE_CACHE);
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {
        const cachedPage = await caches.match(request);

        if (cachedPage) {
            return cachedPage;
        }

        return await caches.match("/offline.html");
    }
}

// Cache-first static assets
async function handleStaticAsset(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const response = await fetch(request);

        if (response.ok && response.type === "basic") {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }

        return response;

    } catch (error) {
        return Response.error();
    }
}

// Fetch handler
self.addEventListener("fetch", (event) => {

    const request = event.request;
    const url = new URL(request.url);

    // Only handle GET requests
    if (request.method !== "GET") {
        return;
    }

    // Only handle same-origin requests
    if (url.origin !== self.location.origin) {
        return;
    }

    // Never cache API, authentication or payment requests
    if (
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/auth/") ||
        url.pathname.startsWith("/payment/") ||
        url.pathname.startsWith("/checkout/")
    ) {
        return;
    }

    // Website navigation
    if (request.mode === "navigate") {
        event.respondWith(handleNavigation(request));
        return;
    }

    // Do not cache large media or dynamic documents
    if (/\.(m3u8|mp4|mp3|pdf|m4a|aac|webm)$/i.test(url.pathname)) {
        return;
    }

    // Cache static files
    if (
        /\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?|ttf)$/i.test(url.pathname)
    ) {
        event.respondWith(handleStaticAsset(request));
    }

});