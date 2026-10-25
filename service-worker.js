const CACHE_NAME = "prompt-injection-atlas-2026-10-25-v1";
const FILES = [
  "./", "./index.html", "./catalog.html", "./styles.css", "./catalog.css",
  "./notes.css", "./mobile.css", "./app.js", "./catalog.js", "./data.js",
  "./inventory.js", "./method-notes.js", "./curated-notes.js",
  "./paper-abstracts.js", "./paper-notes.js", "./pwa.js",
  "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("prompt-injection-atlas-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || Response.error())));
});
