/* ═══════════════════════════════════════════════════════════════════
   Service Worker — Flashipping Statistiques

   Deux règles, et pas une de plus :

   1. La coquille (HTML, manifeste, icônes) est servie depuis le cache
      puis rafraîchie en arrière-plan. L'application s'ouvre donc même
      sans réseau, et une mise à jour arrive à la visite suivante.

   2. Les appels à l'API ne sont JAMAIS mis en cache. Un chiffre de
      septembre servi depuis le cache sous l'étiquette « octobre »
      ferait évaluer une succursale sur le mois précédent. Hors ligne,
      l'appel échoue franchement et l'écran le dit.
   ═══════════════════════════════════════════════════════════════════ */

var VERSION = 'fls-stats-v4';
var COQUILLE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icone-192.png',
  './icone-512.png'
];

self.addEventListener('install', function (ev) {
  ev.waitUntil(
    caches.open(VERSION)
      // addAll échoue en entier si un seul fichier manque : on ajoute
      // donc un par un pour qu'une icône absente ne bloque pas tout.
      .then(function (c) {
        return Promise.all(COQUILLE.map(function (u) {
          return c.add(u).catch(function () {});
        }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (ev) {
  ev.waitUntil(
    caches.keys().then(function (cles) {
      return Promise.all(cles.map(function (k) {
        return k === VERSION ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (ev) {
  var req = ev.request;

  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf('/macros/') !== -1) return;

  ev.respondWith(
    caches.match(req).then(function (enCache) {
      var reseau = fetch(req).then(function (rep) {
        if (rep && rep.status === 200 && rep.type === 'basic') {
          var copie = rep.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copie); });
        }
        return rep;
      }).catch(function () {
        if (req.mode === 'navigate') return caches.match('./index.html');
        throw new Error('hors ligne');
      });

      return enCache || reseau;
    })
  );
});
