# Tâches

Suivi des tâches des associés, puis des employés : tâches du jour, de la
semaine et du mois, circuits à étapes (concevoir → valider → publier),
preuves de réalisation, projets, objectifs et rapport du mois.

## Un serveur à part

Contrairement aux autres dossiers, cette app ne parle pas à
`Flashipping_v2` : elle a son propre projet Apps Script,
**`Flashipping_Taches`**, posé sur le même classeur. Il lit la table
`Utilisateurs` sans jamais y écrire, et n'écrit que dans les tables
`Taches*`.

Chacun se connecte avec **son téléphone ou son courriel** et le **code à
6 chiffres** qu'il utilise déjà dans les apps. L'écran de connexion
n'affiche aucun nom.

## Premier lancement

Comme pour les autres apps, l'adresse du serveur n'est écrite nulle part
dans ce dépôt public. Elle se saisit au premier lancement, ou arrive par
le **lien d'invitation** :

```
https://mandy-te.github.io/flashipping/taches/?api=IDENTIFIANT_DU_DEPLOIEMENT
```

L'administrateur le copie depuis *Réglages → Serveur → Copier le lien
d'invitation* et l'envoie sur WhatsApp. L'app enregistre l'adresse et la
retire aussitôt de la barre d'adresse.

Le déploiement doit être **Exécuter en tant que : Moi** et **Accès : Tout
le monde**. Sinon l'app répond que le serveur ne répond pas.

## Après chaque modification

- `index.html` remplacé → incrémenter `VERSION` en haut de `sw.js`.
- `Code.gs` modifié → *Déployer → Gérer les déploiements → ✏️ → Nouvelle
  version*. Jamais un nouveau déploiement : l'adresse changerait.
