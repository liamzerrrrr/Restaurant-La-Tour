# La Tour de Montady — prototype et application préparée

Mise à jour du 4 octobre 2026 : horaires fournis par le propriétaire, capacité provisoire de **100 couverts par service**, intérieur et terrasse réunis. Aucun plan ni choix de table ; les gérants organisent la mise en place. Les préférences ne garantissent pas un placement.

## Horaires partagés

La source commune est `src/data/horaires.json`, utilisée par le site Vite et l’application Next.js. Midi : 12h–13h tous les jours sauf mercredi. Soir : 19h–21h lundi, jeudi, vendredi et samedi. Fermé mercredi, mardi soir et dimanche soir. Les créneaux sont proposés toutes les 30 minutes, jusqu’à 13h et 21h. Les jours fermés n’offrent aucun créneau ; les horaires passés sont refusés dans le prototype.

## Explorer

Dans `apps/web` : `npm ci`, `npm run build`, `npm start` (Node 24).
- `/` : restaurant, carte, réservation simulée et contact.
- `/demo/gerant` : réservations locales, allergies et besoins alimentaires, capacité et services, validation des menus, pluie, journal.
- `/gerant` : connexion privée et consultation de la base de test commune.
- `/partenaires` : partenaires du site existant.

Les données de démonstration sont locales à l’appareil. Les anciennes réservations de test sont conservées ; aucune nouvelle attribution de table n’est créée. Les créneaux utilisent un quota commun par service, sans renouvellement automatique de capacité pendant le service. Les annulations libèrent des couverts ; les demandes en attente comptent dans le quota. La mise en place reste à la main du gérant.

Le champ facultatif « Allergies et besoins alimentaires » conserve les indications dans la réservation et les affiche au gérant. Le formulaire ne promet aucune adaptation automatique ; l’équipe doit la confirmer.

## Pluie

Le gérant doit renseigner les places intérieures libres pour la date et le service choisis. Elles ne sont jamais déduites d’une répartition intérieur/terrasse inventée. Les propositions réservent temporairement ces places ; l’acceptation conserve le nombre total de couverts. Une proposition expirée ne vaut pas acceptation. Aucun SMS n’est envoyé.

## Base de test et accès privé

Une base Neon nommée `montady-test`, région Francfort, est créée et liée au projet Vercel `restaurant-la-tour` pour développement et aperçu uniquement. Les migrations `001-initial.sql` et `002-admin-sessions.sql` sont appliquées. Aucune réservation de démonstration ni aucun service fictif n’y est importé. La connexion utilise TLS et des paramètres secrets côté serveur.

L’accès `/gerant` utilise un compte propriétaire configuré localement, un mot de passe haché avec scrypt, des sessions aléatoires de huit heures stockées sous forme hachée, un cookie HttpOnly/SameSite Strict (Secure sur HTTPS/Vercel), une vérification d’origine, une limitation à huit tentatives par quinze minutes et un journal de connexion. Déconnexion, expiration ou rotation des identifiants révoquent l’accès. La page privée consulte la base commune ; les actions complètes restent à raccorder. Le fichier privé des identifiants est hors du dépôt.

Le formulaire public utilise exclusivement le moteur de démonstration. Les créations concurrentes persistantes, les mutations du gérant, les déplacements persistants, les liens client et les SMS restent à intégrer et à tester. Localement : `APP_MODE=connected`, `DATA_ENV=test`, `SERVICE_CONFIG_APPROVED=false`, `SMS_ENABLED=false`. Les API de réservation restent désactivées. Le transport SMS échoue volontairement même si la variable est changée ; toute activation réelle exige une instruction explicite ultérieure.

`npm run db:migrate` applique les migrations avec verrou et contrôle des empreintes. `npm run admin:setup -- email chemin-vers-un-fichier-prive` crée un compte uniquement si aucun compte n’existe. `.env.local`, `.vercel` et les identifiants ne doivent jamais être ajoutés à Git ni à une archive. Une nouvelle extraction des variables Vercel remplace `.env.local` : sauvegarder les paramètres locaux de l’accès gérant avant de la faire.

## Déploiement et vérifications

Le code est sur la branche GitHub `codex/prototype-reservations`. Le site Vite public reste distinct et aucun nouveau déploiement n’est effectué. Avant un aperçu Next.js, choisir `apps/web` comme racine et configurer les secrets d’authentification ainsi que l’origine HTTPS pour cet aperçu. Ne jamais utiliser les identifiants de production pour ces essais. Les identifiants gérant sont actuellement configurés sur le serveur local uniquement ; les variables de base sont également liées aux environnements Vercel de test.

Tests : `npm test` (11 scénarios du moteur de démonstration) ; `npm run test:connected -- chemin-vers-le-fichier-prive` vérifie contre la base de test l’accès anonyme, les origines, les identifiants, les cookies, l’expiration, la déconnexion, la limitation des tentatives et le maintien des réservations/SMS désactivés. Ces tests connectés ont réussi. La migration a également été rejouée sans recréer les tables. La construction Next.js a réussi. Les réservations persistantes et les SMS ne sont pas encore opérationnels. L’ancien test navigateur de démonstration doit être adapté au calendrier personnalisé et n’a pas été relancé dans cette étape.

Photos réelles, prix du dépôt GitHub, menus JPG et accès aux originaux conservés. Chaque transcription reste à valider avant publication réelle.
