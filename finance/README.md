# Flashipping — PWA Finance

La comptabilité, les parts des associés et les clôtures. Réservée aux
administrateurs : l'écran de connexion ne propose qu'eux, et un compte
sans le droit `voir_finance` est refusé après identification.

Même URL d'API que les deux autres applications. En-tête **vert**, pour
la reconnaître d'un coup d'œil.

---

## Quatre onglets

**💰 Caisse** — le bénéfice en gros, revenus et dépenses, trésorerie,
la clé de répartition expliquée en toutes lettres, et le solde de
chaque associé. Un bouton ouvre le compte de résultat et le bilan.

**✍️ Saisie** — dépense, revenu, apport. La conversion s'affiche
**avant** d'enregistrer : un montant en dollars ne vaut pas le même
nombre de gourdes selon qu'il entre ou qu'il sort, et il vaut mieux le
voir ici que le découvrir dans le classeur.

Deux avertissements y sont écrits à l'écran plutôt que laissés à la
mémoire :
- une dépense marquée « entre en stock » n'est pas une perte — l'argent
  s'est transformé en marchandise, le bénéfice ne bouge pas ;
- une source comme « Avance Commande » ou « Encaissement emprunt » est
  un **flux neutre** : la caisse monte, le bénéfice non. Cet argent
  appartient au client, ou il sera rendu.

**👥 Associés** — parts détenues et acquises, vesting avec sa jauge,
rôle actif, solde détaillé, journal des parts. Et surtout l'entrée d'un
nouvel associé.

**🔒 Clôture** — préparer, vérifier, exécuter. La répartition s'affiche
**avant** de clôturer, nom par nom.

---

## Faire entrer un associé

C'est l'écran qui remplace la saisie à la main dans le Sheet.

La part d'entrée se saisit, et l'application **simule aussitôt** : les
six règles s'affichent, vertes et rouges, toutes en même temps. Savoir
qu'une entrée viole deux règles vaut mieux que de n'en voir qu'une. La
dilution de chaque associé existant est montrée avant toute écriture, et
le bouton reste gris tant qu'une règle n'est pas respectée.

On saisit ensuite ses spécificités : apport en espèces, fonction, rôle
réellement exercé, vesting, cliff, téléphone.

**Ne crée jamais un associé à la main dans le Sheet.** La dilution de
tous les autres et le journal des parts seraient faux, et
`verifierIntegrite()` le signalerait.

---

## Le plafond d'associés n'est plus dans le code

Il y était, et c'était un défaut : un huitième associé était refusé non
par une règle, mais par un trou dans une table qui s'arrêtait au rang 7.

Tout est désormais paramétrable depuis ⚙️ **Réglages → Règles d'entrée** :

| Règle | Par défaut |
|---|---|
| Nombre maximum d'associés | 7 |
| Plancher du fondateur | 30 % |
| Plafond collectif des rangs 5+ | 25 % |
| Part maximale au rang 5 | 10 % |
| Dégressivité par rang | 2 points |
| Plancher du plafond | 3 % |

La dégressivité est une **formule**, donc sans fin : 10, 8, 6, 4, puis
3 indéfiniment. Avec les valeurs par défaut elle redonne exactement
l'ancienne table. En deçà du rang 5, aucun plafond : ce sont les
fondateurs, leur part relève du pacte, pas d'une règle d'entrée.

La clé de répartition se règle au même endroit — statutaire,
financement ou mixte, avec ses deux poids.

⚠️ Cette clé ne touche **pas** aux parts du capital social. Elle ne
partage que le bénéfice. Juridiquement un apport en travail ouvre droit
aux bénéfices, jamais au capital : c'est exactement ce que fait le mode
mixte. À faire écrire dans un accord entre associés, séparé des statuts.

---

## Hors ligne

Rien. Comme l'app Commandes, et pour la même raison : chaque écriture
touche la caisse. L'application le dit en bandeau plutôt que d'accepter
des saisies qu'elle ne pourrait pas tenir.

---

## En cas de problème

| Symptôme | Cause |
|---|---|
| « La comptabilité est réservée aux administrateurs » | le compte n'a pas le droit `voir_finance` |
| Entrée refusée, règle « nombre max » | relever MAX_ASSOCIES dans Règles d'entrée |
| Entrée refusée, règle « ancienneté » | la part demandée dépasse celle du rang précédent après dilution |
| Parts incohérentes avec le journal | un associé a été créé à la main dans le Sheet |
| Bilan déséquilibré | vérifier les onglets Actifs, Dettes et Stock |
| Bénéfice qui semble faux | un flux neutre a été saisi comme un vrai revenu |
