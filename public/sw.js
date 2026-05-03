// epix service worker — caches the app shell so the site loads when the
// network is flaky (or the school WiFi is hostile). Game iframes under
// /html/<slug>/ are deliberately NOT cached here: they're huge, often pull
// from third-party CDNs, and would balloon the cache.

const VERSION = 'v1';
const CACHE = `epix-shell-${VERSION}`;
const SHELL = ['/', '/manifest.webmanifest', '/logo.svg', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  // Hands off the heavy game iframes — let them go straight to network.
  if (url.pathname.startsWith('/html/')) return;

  // HTML navigations: network-first, fall back to cached shell when offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(event.request).then((r) => r || caches.match('/'))
        )
    );
    return;
  }

  // Static assets: cache-first, refresh in background.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fresh = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(event.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
