# Flashipping — PWA Commandes

L'application du service d'achat par procuration : Shein, Temu, Amazon,
AliExpress, eBay. Elle parle au **même** projet Apps Script que l'app
Logistique, et à la même base.

Le client paie le panier **plus** les frais pour que la commande parte.
Le transport se paie à la livraison, dans l'app Logistique.

---

## Les fichiers

`index.html` · `sw.js` · `manifest.webmanifest` · `icone-192.png` ·
`icone-512.png`

À déposer dans un dossier `commandes/` du même dépôt GitHub, à côté de
`logistique/`. Même URL d'API à coller au premier lancement.

L'en-tête est **ambre** là où celui de la Logistique est marine : avec
les deux applications installées, on voit d'un coup d'œil laquelle est
ouverte.

---

## Le cycle, et la seule action possible à chaque étape

```
Devis → Payée → Commandée → Reçue USA → Clôturée
```

L'écran de détail n'affiche jamais plus d'un bouton d'avancement : celui
que le statut autorise. L'agent ne choisit pas, il exécute.

**Devis → Payée.** Le client règle le total, pas un acompte. Un paiement
partiel reviendrait à avancer l'argent à sa place — exactement le risque
que ce service doit éviter. Deux écritures partent en comptabilité : le
panier en **flux neutre** (c'est l'argent du client qui transite) et la
commission en **produit** (c'est ton revenu). Si la seconde échoue, la
première est annulée : jamais de demi-paiement en caisse.

**Payée → Commandée.** Il faut d'abord rattacher la commande à un dépôt,
parce que c'est le dépôt qui porte les frais de carte. On saisit ensuite
le montant **réellement débité** par le marchand. S'il diffère du devis,
l'app le dit : cet écart sort de ta trésorerie, pas de celle du client.

**Commandée → Reçue USA.** Le colis arrive à Miami, on saisit son
tracking. Il entre dans la logistique avec le numéro de commande
attaché — le rattachement est fait une fois pour toutes.

**Reçue USA → Clôturée.** Automatique, quand le colis est livré et
facturé dans l'app Logistique. Rien à faire ici.

---

## Les frais, et pourquoi ils restent modifiables

Le taux proposé suit cette règle, affichée à l'écran :

1. le taux fidèle du client s'il en a un
2. sinon `TAUX_COMMISSION_DEFAUT`

Trois raccourcis — **0 %**, **8 %**, **10 %** — couvrent la promotion de
décembre, le client fidèle à gros volume, et le cas courant. Seuls un
admin ou un responsable peuvent s'écarter du taux proposé ; le serveur
enregistre qui l'a fait.

Le taux part toujours en **fraction** vers l'API. Le serveur refuse
`10` et exige `0.10` : l'app fait la conversion, personne ne peut
facturer 1 000 % de commission par une faute de frappe.

---

## Le point qui décide de la rentabilité

Les frais de dépôt sont une **charge de Flashipping**, jamais
refacturée au client. Et ils sont calculés sur la **recharge entière**,
puis répartis entre les **seules commandes rattachées**.

D'où la règle contre-intuitive : recharger 300 $ et n'y rattacher qu'une
commande de 75 $ fait porter à cette seule commande les frais des 300 $.

L'onglet **Marges** le chiffre. Avec une recharge de 300 $ à 4 % de
frais, un panier moyen de 75 $ et 10 % demandés au client :

| Commandes rattachées | Marge de chacune |
|---|---|
| 1 | −4,50 $ |
| 2 | +1,50 $ |
| 3 | +3,50 $ |
| 4 | +4,50 $ |

L'app annonce le seuil directement : *« Il faut 2 commandes rattachées à
cette recharge pour que chacune devienne rentable. »*

L'écran de création d'un dépôt fait le même calcul **avant** de valider :
il montre, commande par commande, ce que chacune gardera. C'est la vue
qui manque quand on fait un dépôt par commande.

⚠️ Si l'onglet **Tarifs_Depot** de la base est vide, toutes les marges
estimées supposent 0 % de frais et sont donc trop optimistes. Les
Réglages affichent les paliers en vigueur — si la liste est vide, c'est
la première chose à remplir.

---

## Ce que cette app ne fait pas hors ligne

Rien. Et c'est voulu.

Chaque écriture touche la caisse : un paiement crée deux revenus, un
dépôt crée une charge, un achat crée une sortie. Aucune de ces écritures
ne peut être devinée sur le téléphone. L'app le dit en bandeau rouge au
lieu d'accepter des saisies qu'elle ne pourrait pas tenir.

C'est la différence avec l'app Logistique : là-bas, un scan sur un quai
sans réseau est rejouable sans risque, donc il part en file d'attente.
Ici, non.

---

## Création des clients

Elle se fait depuis l'app **Logistique**. Un seul endroit où créer un
client, donc aucun doublon entre les deux applications — c'est la même
table `Clients`.

---

## En cas de problème

| Symptôme | Cause |
|---|---|
| « Le taux s'écrit en fraction » | un script externe appelle l'API en passant 10 au lieu de 0.10 |
| « Le client paie la commande en entier » | tentative de paiement partiel — c'est la règle, pas un bug |
| « Rattache d'abord la commande à un dépôt » | achat tenté avant la recharge de carte |
| « Le dépôt ne couvre pas les paniers rattachés » | montant déposé inférieur à la somme des paniers cochés |
| Marge estimée toujours égale à la commission | `Tarifs_Depot` est vide |
| Commande bloquée en « reçue USA » | le colis n'est pas encore livré et facturé côté Logistique |
| Impossible d'annuler | une commande déjà achetée ne s'annule pas ici : traite le retour marchand, puis rembourse |
