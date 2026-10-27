# La Tour de Montady — essais connectés

## État livré le 4 octobre 2026

Le formulaire public enregistre désormais les essais dans la base Neon commune `montady-test` (Francfort). L'accès `/gerant` est privé et utilise cette même base, avec ajout manuel, sources, édition, déplacement, six statuts, filtres jour/service/préférence, quota restant, fermeture/réouverture de service et journal. Les menus et la gestion de pluie restent séparés en démonstration, sans publication ni SMS réels.

100 couverts par service, sans renouvellement automatique pendant le repas. La durée de 120 minutes est provisoire. La préférence intérieur/terrasse ne garantit pas le placement et aucun plan de table n'est proposé. Les créneaux suivent `apps/web/lib/horaires.json` ; mercredi fermé, mardi/dimanche midi uniquement. Horizon en ligne : 90 jours. Le service est généré au premier accès ; les congés se gèrent par fermeture de chaque service.

## Réservation et gestion

Les insertions et modifications verrouillent les services avant le contrôle du quota. Les modifications concurrentes utilisent aussi une révision, et un changement refusé conserve la réservation initiale. La déduplication par clé de demande évite les doubles créations lors d'une nouvelle tentative. Les réservations en attente et terminées comptent dans le quota ; annulation et absence libèrent les couverts.

Après création, un lien privé permet de consulter l'essai, choisir un autre créneau ou annuler. Le jeton est dans le fragment de l'URL, envoyé en POST, stocké haché et expire après le repas. La réponse de consultation ne contient ni nom ni coordonnées. Les confirmations et rappels sont inscrits dans une file, actualisés après modification/annulation ; aucune distribution SMS n'est connectée.

L'authentification utilise scrypt, sessions aléatoires hachées de 8 heures, cookies HttpOnly/SameSite Strict, Secure sur HTTPS, contrôle d'origine, limitation des tentatives et révocation à la déconnexion. Toutes les actions gérant vérifient la session côté serveur. Une panne de base ne déclenche jamais de repli sur des disponibilités inventées.

## Lancer et configurer

Node 24 ; `npm ci`, `npm run db:migrate`, `npm run build`, `npm start`. `.env.local` reste privé et exclu de Git. Les identifiants sont dans un fichier privé hors dépôt. Ne jamais inclure ces fichiers dans une archive. Mode local : `APP_MODE=connected`, `DATA_ENV=test`, `SERVICE_CONFIG_APPROVED=true` (règles provisoires de test uniquement), `SMS_ENABLED=false`.

La version Vite publique et son déploiement sont conservés. La base est liée aux environnements Vercel développement/aperçu ; les paramètres du gérant sont actuellement locaux. Avant un aperçu Next.js, choisir la racine `apps/web`, installer les secrets d'accès gérant pour cet aperçu et configurer son origine HTTPS. Aucun nouveau déploiement Vercel dans cette étape.

## Vérifications

Construction Next.js et 11 tests du moteur de démonstration réussis. `npm run test:persistent -- chemin-du-fichier-prive` vérifie contre la base de test le quota sous concurrence, les dernières places, l'anti-doublon, les accès, la confidentialité du lien, les déplacements atomiques, les révisions concurrentes, les sources/allergies et la fermeture. Recette réussie ; les essais sont annulés ensuite et le service rouvert, sans suppression d'historique. Le navigateur a également vérifié une création, son annulation et l'accès au tableau de bord.

L'ancien test `test:connected` correspond à l'étape où les réservations étaient désactivées ; il reste à adapter. L'ancien test navigateur de démonstration n'a pas été relancé.

## Suite avant mise en service

Gestion persistante de la pluie et des propositions, validation/publication des menus en base, paramétrage détaillé du gérant, prestataire et programmation des SMS, règles métier finales (capacité, durées, congés), protection contre les demandes abusives, mentions légales et politique de conservation. Aucun envoi SMS réel sans activation explicite.


## Aperçu Vercel de test

L’application Next.js est déployée depuis apps/web avec vercel.json. Les variables Neon et d’authentification sont limitées à l’environnement Preview ; SMS_ENABLED reste false. L’origine exacte du déploiement est autorisée depuis les variables système Vercel, jamais depuis l’en-tête Host du client. Le site Vite de production reste séparé.

Aperçu : https://restaurant-la-tour-2btzjhw65-tomybarbierpro-4352s-projects.vercel.app





## Bons cadeaux — essais connectés
Le montant est libre, la validité est d'un an à compter de l'émission et les utilisations partielles déduisent le solde sans modifier l'échéance. Le gérant crée les bons fictifs et enregistre les dépenses depuis /gerant/cadeaux. Le lien privé /cadeau#code permet de consulter le solde et d'imprimer un bon de démonstration. Les montants sont stockés en centimes ; les débits sont verrouillés en transaction et les clés d'opération empêchent les doublons.

Migration 004 appliquée uniquement à montady-test. Aucun paiement, achat public ou envoi d'email n'est connecté. Le destinataire d'essai autorisé est tomybarbierpro@gmail.com ; aucun email client ni SMS réel ne doit être envoyé. L'installation Resend via Marketplace demande une formule payante car une équipe existe déjà : ne pas souscrire ; connecter l'équipe existante avant de développer les envois. La gestion de la pluie est reportée.

Test : node tests/gift-cards.mjs ../../../Acces-gerant.txt (uniquement DATA_ENV=test et SMS_ENABLED=false). Le test conserve un bon fictif épuisé et expiré avec son historique. Une rotation d'AUTH_SECRET nécessite de conserver les liens cadeaux déjà distribués ; elle empêche de régénérer le code d'une ancienne demande avec sa clé d'idempotence.
