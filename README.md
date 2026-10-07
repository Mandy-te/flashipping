# Flashipping — les applications web

Trois applications, **un seul** projet Apps Script et **une seule** base
Google Sheets. Chacune colle la même URL `/exec` à son premier lancement.

| Dossier | Application | En-tête | Hors ligne |
|---|---|---|---|
| `logistique/` | scan, réception, suivi, livraison, facturation | marine | mouvements mis en file d'attente |
| `commandes/` | achat par procuration, dépôts, marges | ambre | non — tout touche la caisse |
| `finance/` | comptabilité, parts des associés, clôtures | vert | non — tout touche la caisse |

## Mise en ligne

1. Un dépôt GitHub **public** (Pages gratuit) nommé `flashipping`
2. Déposer les dossiers tels quels à la racine
3. **Settings → Pages** → branche `main`, dossier `/ (root)`

```
https://TON-COMPTE.github.io/flashipping/
```

Cette adresse ouvre une page d'accueil qui mène aux trois applications.
C'est elle à mettre en favori et à donner aux agents.

Le dépôt peut rester public : aucun fichier ne contient de secret.
L'URL de l'API est saisie dans l'application, le code de chaque agent
n'est jamais stocké, seul un jeton de session l'est — et il expire.

## Après chaque modification

**Backend** — Apps Script : *Déployer → Gérer les déploiements → ✏️ →
Version : Nouvelle version*. Jamais « Nouveau déploiement » : l'URL
changerait et tous les téléphones s'arrêteraient.

**PWA** — remplacer le fichier sur GitHub **et** incrémenter `VERSION`
en haut du `sw.js` concerné, sinon les téléphones gardent l'ancienne
version en cache.

Chaque dossier a son propre README avec le détail de son métier.
