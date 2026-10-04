# La Tour de Montady — prototype et application préparée

Mise à jour du 4 octobre 2026 : horaires fournis par le propriétaire, capacité provisoire de **100 couverts par service**, intérieur et terrasse réunis. Aucun plan ni choix de table ; les gérants organisent la mise en place. Les préférences ne garantissent pas un placement.

## Horaires partagés

La source commune est `src/data/horaires.json`, utilisée par le site Vite et l’application Next.js. Midi : 12h–13h tous les jours sauf mercredi. Soir : 19h–21h lundi, jeudi, vendredi et samedi. Fermé mercredi, mardi soir et dimanche soir. Les créneaux sont proposés toutes les 30 minutes, jusqu’à 13h et 21h. Les jours fermés n’offrent aucun créneau ; les horaires passés sont refusés dans le prototype.

## Explorer

Dans `apps/web` : `npm ci`, `npm run build`, `npm start` (Node 24).
- `/` : restaurant, carte, réservation simulée et contact.
- `/demo/gerant` : réservations locales, allergies et besoins alimentaires, capacité et services, validation des menus, pluie, journal.
- `/gerant` : accès privé réel fermé sans configuration.
- `/partenaires` : partenaires du site existant.

Les données de démonstration sont locales à l’appareil. Les anciennes réservations de test sont conservées ; aucune nouvelle attribution de table n’est créée. Les créneaux utilisent un quota commun par service, sans renouvellement automatique de capacité pendant le service. Les annulations libèrent des couverts ; les demandes en attente comptent dans le quota. La mise en place reste à la main du gérant.

Le champ facultatif « Allergies et besoins alimentaires » conserve les indications dans la réservation et les affiche au gérant. Le formulaire ne promet aucune adaptation automatique ; l’équipe doit la confirmer.

## Pluie

Le gérant doit renseigner les places intérieures libres pour la date et le service choisis. Elles ne sont jamais déduites d’une répartition intérieur/terrasse inventée. Les propositions réservent temporairement ces places ; l’acceptation conserve le nombre total de couverts. Une proposition expirée ne vaut pas acceptation. Aucun SMS n’est envoyé.

## Serveur préparé, non connecté

Le schéma PostgreSQL prévoit une capacité par service (100 par défaut), réservations, allergies, propositions de déplacement, jetons hachés, journal, file de notifications et validation de carte. La création persistante verrouille le service avant de compter les couverts et d’insérer la réservation, pour sérialiser les créations concurrentes. Elle contrôle également les horaires partagés. Ce code n’a pas été testé contre une base connectée.

Le formulaire utilise exclusivement le moteur de démonstration. La connexion PostgreSQL, les mutations complètes du gérant, les déplacements persistants, les liens client, l’ordonnancement SMS et le transport prestataire restent à terminer. `APP_MODE=demo`, `SERVICE_CONFIG_APPROVED=false`, `SMS_ENABLED=false`. Le transport SMS échoue volontairement même si la variable est changée ; toute activation réelle exige une instruction explicite ultérieure.

## Déploiement et vérifications

Le projet Vite à la racine reste distinct. Pour une preview Next.js séparée sur Vercel, choisir `apps/web` comme racine et conserver le mode demo. Aucun push ni déploiement effectué.

Tests : `npm test` (11 scénarios : horaires des sept jours, quota partagé de 100, attente/annulation, heures passées, fermeture et pluie) ; après lancement du site et installation du navigateur avec `npx playwright install chromium`, `npm run test:e2e` vérifie également formulaire, allergies côté gérant, responsive et accès réel désactivé. Les constructions Next.js et Vite ont réussi. Les systèmes connectés et les SMS ne sont pas vérifiés ni opérationnels.

Photos réelles, prix du dépôt GitHub, menus JPG et accès aux originaux conservés. Chaque transcription reste à valider avant publication réelle.
