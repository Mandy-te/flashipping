/* ═══════════════════════════════════════════════════════════════════
   Service Worker — Flashipping Logistique

   Deux règles, et pas une de plus :

   1. La coquille (HTML, manifeste, icônes) est servie depuis le cache
      puis rafraîchie en arrière-plan. L'application s'ouvre donc même
      sans réseau, et une mise à jour arrive à la visite suivante.

   2. Les appels à l'API ne sont JAMAIS mis en cache. Un inventaire
      servi depuis le cache ferait croire à un agent qu'un colis est
      encore là alors qu'il est parti. Hors ligne, l'appel échoue
      franchement et l'application met l'écriture en file d'attente.
   ═══════════════════════════════════════════════════════════════════ */

var VERSION = 'fls-log-v27';
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

  // Les écritures ne passent pas par ici.
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  /* Le lecteur de codes-barres de secours.
     Safari et Brave n'exposent pas BarcodeDetector ; l'app charge
     alors une bibliothèque depuis un CDN. Sans cette exception, elle
     serait retéléchargée à chaque ouverture de la caméra et
     deviendrait introuvable dès la première coupure — une succursale
     perdrait son scanner au pire moment. On la garde donc en cache,
     à sa version épinglée.

     La réponse est opaque (requête vers une autre origine) : on ne
     peut ni lire son code de statut, ni savoir si elle a réussi. Une
     erreur du CDN serait donc mise en cache comme un succès, et
     rejouée indéfiniment. On ne met en cache que ce qui a une taille
     plausible, et la montée de VERSION purge l'ensemble. */
  var lecteurTiers = /\/@zxing\/library@/.test(url.href);

  if (url.origin !== self.location.origin && !lecteurTiers) return;
  if (url.pathname.indexOf('/macros/') !== -1) return;

  if (lecteurTiers) {
    ev.respondWith(
      caches.match(req).then(function (enCache) {
        if (enCache) return enCache;
        return fetch(req).then(function (rep) {
          if (!rep || (rep.type !== 'opaque' && rep.status !== 200)) return rep;

          /* Les deux copies se prennent MAINTENANT. `rep` part au
             navigateur qui va consommer son corps ; un clone demandé
             plus tard, une fois la taille connue, échouerait sur
             « body already used ». */
          var pourTaille = rep.clone();
          var pourCache = rep.clone();

          ev.waitUntil(
            pourTaille.blob().then(function (b) {
              if (b.size < 50000) return;      // page d'erreur du CDN
              return caches.open(VERSION).then(function (c) {
                return c.put(req, pourCache);
              });
            }).catch(function () {})
          );

          return rep;
        });
      })
    );
    return;
  }

  ev.respondWith(
    caches.match(req).then(function (enCache) {
      var reseau = fetch(req).then(function (rep) {
        if (rep && rep.status === 200 && rep.type === 'basic') {
          var copie = rep.clone();
          caches.open(VERSION).then(function (c) { c.put(req, copie); });
        }
        return rep;
      }).catch(function () {
        // Navigation hors ligne : on retombe sur la page d'accueil,
        // sinon l'utilisateur voit l'écran d'erreur du navigateur.
        if (req.mode === 'navigate') return caches.match('./index.html');
        throw new Error('hors ligne');
      });

      return enCache || reseau;
    })
  );
});
