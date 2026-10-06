# Flashipping — PWA Logistique

L'application que les agents ouvrent sur leur téléphone. Elle parle au
projet Apps Script `Flashipping_API` et ne contient **aucun secret** :
l'URL de l'API est saisie dans l'application, le code de chaque agent
n'est jamais stocké, seul un jeton de session l'est.

C'est ce qui permet d'héberger le dépôt en public sur GitHub Pages
sans rien exposer.

---

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | toute l'application — écrans, logique, impression |
| `sw.js` | service worker : l'application s'ouvre sans réseau |
| `manifest.webmanifest` | installation sur l'écran d'accueil |
| `icone-192.png` · `icone-512.png` | icônes |

Une seule page, aucune bibliothèque externe. Le code-barres est généré
sur l'appareil : une étiquette s'imprime même sans connexion.

---

## Mise en ligne sur GitHub Pages

1. **github.com** → **New repository** → nom `flashipping`, **Public**
2. **Add file → Upload files** → dépose les 5 fichiers dans un dossier
   `logistique/`
3. **Settings → Pages** → Source : `Deploy from a branch`,
   branche `main`, dossier `/ (root)` → **Save**
4. Après deux ou trois minutes, l'adresse est :

```
https://TON-COMPTE.github.io/flashipping/logistique/
```

---

## Première ouverture

L'application demande l'URL de l'API. Colle celle qui finit par `/exec` :

```
https://script.google.com/macros/s/AKfy…/exec
```

Elle la vérifie avant de l'accepter — si le déploiement n'est pas réglé
sur « Accès : Tout le monde », elle le dit plutôt que de laisser l'agent
buter sur un écran blanc.

Ensuite : choisir son nom, taper son code à 6 chiffres. L'URL et la
session restent sur l'appareil ; un agent ne la saisit qu'une fois.

**Installer sur l'écran d'accueil** — Chrome : menu ⋮ → *Ajouter à
l'écran d'accueil*. L'application s'ouvre alors en plein écran, sans
barre d'adresse.

---

## Les cinq onglets

**Scan** — le cœur du métier. Saisie au clavier, ou caméra sur Chrome
Android. L'application lit le colis, affiche son itinéraire et ne
propose **qu'une seule action** : celle que la route autorise à cet
endroit. L'agent n'a pas à choisir un statut, donc il ne peut pas se
tromper.

Le mode **Rafale** accumule les colis puis les fait tous avancer d'un
cran — c'est le mode du quai, quand le camion se décharge.

**Colis** — recherche et filtres par statut. « Chez moi » montre ce qui
est physiquement à l'agence de l'agent.

**Clients** — fiche complète, colis groupés par statut, bouton WhatsApp.

**Livrer** — coche les colis que le client emporte, calcule le total en
dollars et en gourdes, crée la facture, passe les colis en « livré » et
écrit le revenu en comptabilité, le tout en une seule opération. Puis
imprime le reçu 50 mm.

**Stock** — l'inventaire physique d'une agence, en trois blocs : à
livrer ici, de passage, sortis mais pas encore réceptionnés ailleurs.
Ce troisième bloc n'existe que grâce au double scan.

---

## Ce que le mode hors ligne fait, et ce qu'il ne fait pas

**Mis en file d'attente** — les mouvements : avancement d'un colis,
réception, correction de statut, correction de prix. Ils partent seuls
dès que le réseau revient, dans l'ordre où ils ont été faits.

Un mouvement est rejouable sans danger : c'est le serveur qui décide de
l'étape suivante d'après l'état réel du colis. Un envoi en double ne
fait donc pas avancer deux fois, et une réception en double est refusée.

**Refusé hors ligne** — la facturation. Une facture prend un numéro,
encaisse de l'argent et écrit un revenu en comptabilité. Un numéro
inventé sur le téléphone entrerait en collision avec celui d'un autre
agent, et le reçu remis au client ne correspondrait à rien. L'écran
Livrer le dit clairement au lieu de faire semblant.

La file d'attente est visible dans ⚙️ **Réglages**, avec le détail de
chaque opération et la possibilité d'en retirer une.

---

## L'étiquette 50 mm

Imprimable depuis le scan, le détail d'un colis, ou juste après une
réception. Elle porte le **code client en gros** — c'est ce qu'on lit
de loin dans un dépôt — la ville de destination encadrée, le poids, le
montant, et un code-barres Code 128 du numéro de suivi.

Le code-barres est vrai : il a été relu par un lecteur indépendant lors
des essais. Ce que l'application imprime, l'application peut le
rescanner.

Pour imprimer, le téléphone doit voir l'imprimante thermique — par
Bluetooth avec une application compagnon, ou par le service
d'impression Android.

---

## Après chaque modification du backend

Côté Apps Script : **Déployer → Gérer les déploiements → ✏️ → Version :
Nouvelle version → Déployer**. Jamais « Nouveau déploiement » : l'URL
changerait et tous les téléphones cesseraient de fonctionner.

Côté PWA : remplace le fichier sur GitHub et **change `VERSION` en haut
de `sw.js`** (`fls-log-v1` → `fls-log-v2`). Sans ça les téléphones
garderont l'ancienne version en cache.

---

## En cas de problème

| Symptôme | Cause |
|---|---|
| « L'API a renvoyé une page web » | déploiement réglé sur « Moi seul » au lieu de « Tout le monde » |
| « Session expirée » | normal après 12 h — se reconnecter |
| « Compte bloqué » | 5 codes faux ; un admin remet le compteur à zéro |
| La caméra ne lit rien | iPhone et Firefox ne lisent pas les codes-barres : saisir le numéro |
| L'application ne se met pas à jour | `VERSION` de `sw.js` non changée |
| « Colis hors de ton périmètre » | un agent ne voit que les colis destinés à son agence |
| Rien ne s'imprime | aucune imprimante configurée sur le téléphone |
