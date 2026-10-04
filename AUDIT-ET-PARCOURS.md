# Mise à jour prioritaire — 4 octobre 2026

Les nouvelles décisions du propriétaire remplacent les hypothèses de tables du cadrage initial ci-dessous :
- 100 couverts par service, communs à l’intérieur et à la terrasse, à modifier ultérieurement.
- Aucun plan ni choix de table par le client ; seuls intérieur/terrasse sont proposés comme préférence. Le gérant organise la mise en place.
- Horaires fournis : 12h–13h chaque jour sauf mercredi ; 19h–21h lundi, jeudi, vendredi et samedi. Mardi soir et dimanche soir fermés.
- Champ facultatif allergies et besoins alimentaires (exemple sans gluten), conservé et visible au gérant.
- Pluie : le gérant renseigne les places intérieures disponibles avant proposition ; aucune répartition fictive intérieur/terrasse n’est inventée.

Le prototype et la copie du site Vite existant appliquent les horaires partagés. L’application serveur préparée utilise un quota verrouillé par service, au lieu d’un plan de tables. Les prérequis de plan de tables mentionnés dans l’historique ne sont plus nécessaires. Le code serveur, la base et les SMS restent non connectés.

---

## Historique du cadrage initial (hypothèses de tables remplacées)

# La Tour de Montady — audit et parcours

État du 4 octobre 2026. Étape livrée : prototype navigable et fondations de l’application. Déploiement existant conservé.

## Audit de l’existant

Le [site officiel](https://www.latourdemontady.com/) présente la cuisine, le restaurant, les avis, les informations pratiques et l’offre cadeau. La [carte actuelle](https://www.latourdemontady.com/la-carte/) dispose déjà d’un texte lisible ; son parcours oriente la réservation vers le téléphone. Le lien d’appel du pied de page de la carte ne correspond pas au numéro affiché : corriger partout vers `tel:+33467905073`.

La [page contact](https://www.latourdemontady.com/contact/) précise les horaires de dernières commandes et les jours fermés. L’annonce de congés en page d’accueil ne précise pas l’année : à confirmer, sans l’importer automatiquement dans les nouvelles disponibilités. L’email du site officiel est `tony.mattu0017@orange.fr`, alors que le dépôt utilise `contact@latourdemontady.com` : l’adresse publique doit être reconfirmée. Le prototype conserve celle du site officiel.

Le [dépôt autorisé](https://github.com/liamzerrrrr/Restaurant-La-Tour), révision `d91c504`, contient un site React/Vite responsive, des polices locales, de vraies photos, la carte, les vins, les boissons, des partenaires et un plan de salle. Sa propre documentation signale des tables et disponibilités fictives. Le formulaire crée une demande par email ou un endpoint configurable ; ce n’est pas une attribution centralisée de table. La réception automatique de messages privés Instagram/Facebook n’existe pas.

Le projet Vercel `restaurant-la-tour` a été retrouvé et est configuré pour Vite, avec une dernière production indiquée READY. Le prototype est ajouté dans `apps/web` afin de conserver le site existant et son mode de déploiement. Aucune modification de Vercel n’a été faite.

## Direction artistique

Ivoire pour l’espace et la lisibilité, cuivre pour le caractère de la maison, olive sombre pour les actions. Cormorant Garamond pour les titres, Inter pour les informations et les formulaires, polices hébergées localement. Photographies réelles en grand format, cadrage généreux, menus lisibles en texte et accès aux JPG. Animations d’apparition de 400 ms, sans masquer le contenu si JavaScript échoue ; désactivation avec réduction des mouvements. Bouton de réservation permanent sur mobile.

## Parcours client

Accueil → restaurant/terrasse ou carte → date et personnes → préférence de placement → créneau compatible → coordonnées → confirmation immédiate ou état d’attente selon le mode choisi. Le propriétaire a retenu **la confirmation immédiate au lancement**.

L’aperçu présente explicitement la simulation à chaque étape. Pour une réservation réelle durant cette étape, le téléphone reste disponible. Les réservations confirmées doivent être conservées tant qu’un nouveau créneau ou placement n’a pas été validé. Le rappel ne demande pas de réponse ; une proposition de déplacement exige une acceptation explicite et comporte une échéance.

Parcours de carte : catégorie → nom/description/prix → document original ; côté gérant : comparer → corriger → valider la révision → publier. Les transcriptions sont encore à valider. Les prix des entrées proviennent du dépôt, car le JPG correspondant ne les indique pas. Summer Tour et Loco Loco sont conservés comme données de travail, à reconfirmer. Les vins rosés en bouteille ne sont pas inventés.

## Parcours gérant

Authentification réelle, puis vue du jour → filtres service/espace → couverts et tables disponibles par créneau → création manuelle avec source → changement de statut → clôture du service. Le prototype comporte une interface publique séparée, avec données locales fictives ; elle n’est pas présentée comme l’accès privé réel.

Statuts : en attente, confirmée, arrivée, terminée, annulée, absence. Les propositions sont séparées des statuts de réservation. La simulation maintient les demandes en attente comme des allocations bloquantes ; cette règle doit être confirmée avec le gérant.

Pluie : choisir date et service → examiner les clients concernés, allocations intérieures compatibles et cas sans solution → aperçu des messages → fermer la terrasse et proposer → accepter/refuser/expirer → suivi humain des clients sans réponse. Les clients sans solution ne sont pas automatiquement annulés par le prototype ; le gérant doit confirmer l’annulation. La proposition conserve l’allocation initiale et bloque la table cible temporairement.

## Informations métier attendues

Le propriétaire confirmera les couverts avec le gérant. Attendre aussi le **nombre de tables**, leurs capacités minimum/maximum, leurs emplacements et les associations autorisées. Un nombre global de couverts ne suffit pas à empêcher la double réservation.

À préciser : durées midi/soir et grandes tablées, délai entre groupes, intervalle des créneaux, limite de réservation en ligne, marge avant arrivée, horizon de réservation, heures de fermeture réelle, saison été/hiver et congés. Faut-il proposer une autre zone quand la préférence est complète ? Quelles tables de terrasse restent utilisables sous pluie et quelles réservations sont concernées ? Quel délai de réponse, quel processus d’appel pour les clients sans réponse, et qui peut confirmer une annulation ?

À confirmer pour la mise en service : utilisateurs et rôles du gérant, prestataire et budget SMS, politique de conservation des coordonnées, email public, politique d’annulation, textes légaux, dates d’effet des menus, contenu boissons en divergence et éventuels accès déjà détenus à une base centrale. Le choix et l’activation du SMS exigent une instruction explicite ultérieure ; aucun envoi réel n’est autorisé durant cette étape.

## Séparation des états

| Fonction | État livré |
|---|---|
| Site responsive, vraies photos, carte, originaux | Navigable localement |
| Prix/menu éditables et validation | Simulation locale, aucune publication réelle |
| Réservation et back-office | Simulation locale sur l’appareil |
| Pluie et acceptation de proposition | Simulation locale, aucun SMS |
| PostgreSQL et prévention de concurrence | Schéma et code préparés, non connectés/non vérifiés en base |
| Authentification et lecture gérant réelles | Code préparé, accès fermé sans configuration |
| Création et annulation persistantes | API préparées, désactivées ; formulaire non connecté |
| Calendrier, édition réelle tables/services, déplacements persistants | À développer après validation du plan métier |
| Rappels, SMS, nouvelles tentatives et coûts | File préparée ; transport et programmation à implémenter |
| Déploiement Vercel du prototype | Préparé, non effectué |

## Scénarios de recette pour la suite

Deux clients demandent simultanément la dernière table : un seul obtient une allocation. Une association de tables bloque chacun de ses membres. Une demande en attente empêche le surbooking selon la règle validée. La terrasse ferme pour un seul service. Deux groupes ne reçoivent pas la même table intérieure. Une proposition expirée libère son blocage sans être acceptée. Un changement échoue sans perte de l’ancienne réservation. Une annulation retire les rappels. Une réservation créée à H−1 reçoit la confirmation sans rappel immédiat en double. Un fournisseur au résultat inconnu doit être réconcilié avant nouvel envoi. Ces scénarios doivent être exécutés sur la base connectée et le prestataire de test avant activation réelle.
