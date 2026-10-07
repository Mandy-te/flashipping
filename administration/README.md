# Flashipping — PWA Administration

Deux métiers dans une seule application, séparés par les droits :

**Super administrateur** — les comptes (créer, changer un rôle, régénérer
un code, débloquer), les agences du réseau, et le journal de tout ce qui
a été fait sur les pouvoirs.

**Service client** — le dossier d'un client ouvert en un clic pendant
qu'il parle au téléphone : ses colis avec le trajet horodaté, ses
commandes, ses factures, ce qu'il doit. La recherche accepte un nom, un
téléphone ou un tracking, parce que c'est souvent le seul numéro dont le
client est sûr.

Même URL d'API que les trois autres applications. En-tête **violet**.

Le serveur refuse lui-même la connexion d'un rôle qui n'a rien à faire
ici : l'écran ne cache pas des onglets, il n'y a pas de jeton délivré.
