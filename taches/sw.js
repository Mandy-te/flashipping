/* ═══════════════════════════════════════════════════════════════════
   Service Worker — Flashipping Tâches

   1. La coquille (HTML, manifeste, icônes) : réseau d'abord, cache en
      secours. Une nouvelle version arrive dès qu'il y a du réseau, et
      l'app s'ouvre quand même hors ligne.
   2. Les appels au serveur ne passent jamais par le cache.

   Incrémente VERSION à chaque mise en ligne, sinon les téléphones
   gardent l'ancienne version.
   ═══════════════════════════════════════════════════════════════════ */
const VERSION = 'taches-1.3.0';
const COQUILLE = ['./', './index.html', './manifest.webmanifest', './icone-192.png', './icone-512.png', './icone-masquable-512.png'];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(VERSION)
    // un fichier absent ne doit pas bloquer toute l'installation
    .then(c => Promise.all(COQUILLE.map(u => c.add(u).catch(() => {}))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys()
    .then(cles => Promise.all(cles.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', ev => {
  const req = ev.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.indexOf('/macros/') !== -1) return;
  ev.respondWith(
    fetch(req)
      .then(rep => {
        if (rep.ok) { const copie = rep.clone(); caches.open(VERSION).then(c => c.put(req, copie)); }
        return rep;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
