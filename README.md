# Restaurant La Tour — Montady

Site vitrine one-page du Restaurant La Tour, à Montady (Hérault).
React + Vite + Tailwind CSS v4, sans dépendance externe au chargement.

---

## État du contenu

Le site tourne avec **le contenu réel de la maison** : la carte et les quatre
menus sont repris de la carte officielle, les photos viennent du dossier Drive
et du site existant, la charte est relevée sur les supports du restaurant.

La carte compte cinq onglets : les trois sections de plats (`src/data/menu.js`),
les vins groupés par appellation (`src/data/vins.js`) et les boissons réparties
par famille (`src/data/boissons.js`).

Trois points restent à confirmer par le restaurant :

| Élément | Où | À vérifier |
|---|---|---|
| Digestifs | `src/data/boissons.js` | La carte imprimée annonce Get, Cognac/Calvados/Armagnac et **Loco Loco** ; le site actuel listait Menteuse, Croqueuse et Pulpeuse. La carte imprimée a été retenue. |
| Cocktail « Summer Tour » | `src/data/boissons.js` | Présent sur la carte imprimée, absent du site actuel. Il a été conservé. |
| Vins rosés | `src/data/vins.js` | Aucune page rosé dans les documents fournis. Les rosés n'apparaissent donc qu'au pichet. |

Quelques noms de marque ont par ailleurs été rétablis dans leur orthographe
courante : Clan Campbell, Alaryk, Cabernet, acacia.

---

## Déploiement

Le dépôt est relié au projet Vercel **restaurant-la-tour**. La branche de
production est `claude/restaurant-tour-website-t7ytzj` : chaque push la
redéploie automatiquement, et rien n'est à configurer — Vercel détecte Vite,
lance `npm run build` et sert `dist/`.

Les deux pages sont de vrais fichiers HTML (`dist/index.html` et
`dist/partenaires/index.html`), donc aucune règle de réécriture n'est
nécessaire côté hébergeur.

> Tant que le contenu n'est pas validé par le restaurant, mieux vaut activer la
> protection par mot de passe du projet : un second site public identique peut
> concurrencer `latourdemontady.com` dans les résultats de recherche.

## Démarrer

```bash
npm install
npm run dev      # développement, http://localhost:5173
npm run build    # production, sortie dans dist/
npm run preview  # prévisualiser le build
```

Le dossier `dist/` est un site statique : il se déploie tel quel sur Netlify,
Vercel, o2switch, OVH ou n'importe quel hébergeur classique.

---

## Direction artistique

**Palette** — relevée directement sur la carte PDF et le logo de la maison, pas
inventée. Elle vit dans un seul bloc `@theme` de `src/index.css` : modifier ces
valeurs suffit, tout le site suit.

| Jeton | Valeur | Origine / usage |
|---|---|---|
| `--color-nuit` | `#22201D` | Fond sombre chaud de la carte |
| `--color-nuit-doux` | `#2B2825` | Aplats secondaires |
| `--color-creme` | `#F0E3DA` | Crème rosée des panneaux clairs |
| `--color-creme-fonce` | `#E3D3C6` | Fond de la galerie, survols |
| `--color-sable` | `#CDB7A5` | Bordures et filets |
| `--color-ocre` | `#A85736` | **Le cuivre du logo** : boutons, liens, sur-titres |
| `--color-ocre-clair` | `#C87F55` | Survol des boutons |
| `--color-or` | `#D5AB93` | Cuivre pâle : filets, prix, détails sur fond sombre |

Il n'y a volontairement **aucun doré** : la marque est entièrement construite
sur le cuivre, du logo aux bandeaux de la carte.

**Typographie** — Cormorant Garamond pour les titres, Inter pour les textes,
les deux auto-hébergées (paquets Fontsource, aucun appel à Google Fonts :
chargement plus rapide et conformité RGPD acquise).

> À noter : les supports imprimés de la maison utilisent plutôt une grande
> linéale à fort interlettrage pour les titres. Le serif a été retenu ici parce
> qu'il apportait le cachet demandé, et l'esprit de la marque est repris par les
> sur-titres en capitales espacées (classe `.surtitre`). Basculer entièrement
> sur une linéale ne demande que de changer `--font-display`.

**Logo** — redessiné en vectoriel d'après la carte (`src/components/Logo.jsx`) :
la ligne de colline surmontée de la tour, puis « La Tour » et « RESTAURANT ».
Redessiné plutôt qu'extrait, pour rester net à toute taille et prendre la
couleur de son contexte. Si le fichier vectoriel d'origine est disponible, le
remplacement est immédiat.

---

## Structure de la page

L'ordre suit le parcours mental d'un client : on le séduit, on le rassure, on
lui donne envie, puis on lui rend la réservation évidente.

| # | Section | Fichier | Parti pris de mise en page |
|---|---|---|---|
| — | Navigation fixe | `Nav.jsx` | Transparente sur le hero, se compacte en barre sombre au défilement. Le lien de la section courante se souligne d'un filet cuivre. En dessous de 1024 px : menu plein écran. |
| 1 | Hero | `Hero.jsx` | Photo de la terrasse en plein écran, accroche calée en bas à gauche. Double voile dégradé : le texte reste lisible sur une photo de plein jour sans éteindre la droite du visuel. |
| 2 | La Maison | `Concept.jsx` | Deux colonnes : la salle en portrait avec la table dressée en débord, le récit en regard. En dessous, trois piliers numérotés. |
| 3 | La Carte | `Carte.jsx` | **Fond sombre**, comme la carte imprimée. Les quatre menus en cartes alignées, puis la carte en onglets (Entrées / Plats chauds / Fromages & desserts) avec ligne de points entre le plat et son prix. |
| 4 | Galerie | `Galerie.jsx` | Grille asymétrique : la picanha de veau en grand format, le poisson en large, la flambée et une entrée en vignettes. |
| 5 | Réservation & Infos | `Reservation.jsx` | Le téléphone en premier, en gros, avant le formulaire. Puis formulaire à gauche, horaires et adresse à droite, carte OpenStreetMap en pleine largeur. Le jour courant est surligné. |
| — | Pied de page | `Footer.jsx` | Logo, réseaux sociaux, coordonnées. |
| — | Barre mobile | `BarreMobile.jsx` | Barre fixe en bas d'écran (mobile) : **Appeler · Réserver**, toujours sous le pouce. Apparaît une fois le hero dépassé. |

---

## Mobile first

La majorité des réservations se font au téléphone, depuis un téléphone :

- **Barre d'action permanente** en bas d'écran (appeler / réserver).
- Le numéro est un lien `tel:` partout — un appui, ça compose.
- Boutons pleine largeur, cibles tactiles d'au moins 44 px.
- Menu de navigation plein écran, fermable à l'Échap comme au doigt.
- Vérifié sans aucun débordement horizontal en 390 px de large.

---

## Micro-interactions

Toutes calées sur une même courbe (`cubic-bezier(0.16, 1, 0.3, 1)`) : une
décélération douce, jamais de rebond.

- Apparition des blocs au défilement (`IntersectionObserver`, `useReveal`), avec
  des décalages en cascade sur les grilles.
- Barre de navigation qui se compacte, lien de section courante souligné.
- Boutons qui se soulèvent de 2 px au survol, avec ombre portée.
- Zoom lent des images en galerie (1,4 s).
- **`prefers-reduced-motion` respecté intégralement.**

---

## Accessibilité

- Contrastes conformes AA sur les textes courants (cuivre `#A85736` sur crème :
  ratio 4,67).
- Navigation clavier complète, focus visible en cuivre.
- Onglets de la carte en ARIA (`tablist` / `tab` / `tabpanel`) ; les panneaux
  inactifs restent dans le HTML, donc lisibles par Google.
- Lien d'évitement en début de page.
- Balises `alt` décrivant réellement chaque photo.

---

## Le choix de la table

La réservation se fait en trois temps : **quand**, **où**, **qui**. L'étape
« où » affiche un plan cliquable de l'espace choisi — la salle ou la terrasse —
sur lequel on prend sa table comme un fauteuil au cinéma.

| Fichier | Rôle |
|---|---|
| `src/data/salle.js` | **Le plan — fictif.** Chaque zone a sa propre grille de coordonnées : on peut relever les cotes réelles et les reporter telles quelles. |
| `src/data/disponibilites.js` | **Les tables occupées — simulées.** Fonction déterministe : même date, même résultat. |
| `src/components/PlanSalle.jsx` | Le rendu SVG et l'interaction. Ne connaît ni le plan ni les disponibilités : il reçoit tout. |

Le choix reste **facultatif** : imposer une table ferait perdre les réservations
de ceux que ça n'intéresse pas, et prive la maison de sa marge de manœuvre en
salle. Une table choisie se libère automatiquement si elle cesse d'être valable
— changement de date, de service, ou de nombre de couverts.

> ⚠️ **Le choix de table n'a de sens qu'avec un serveur.** Aujourd'hui la
> disponibilité est inventée : sans planning partagé, deux clients peuvent
> réserver la même table à la même heure. La marche à suivre pour brancher un
> vrai planning est commentée en tête de `src/data/disponibilites.js` — la
> fonction est déjà asynchrone, l'interface n'a pas à changer.

## Le formulaire de réservation

Il fonctionne **sans serveur** : sans configuration, il ouvre le logiciel de
messagerie avec la demande pré-remplie.

Pour recevoir les demandes par e-mail, créer un fichier `.env` :

```bash
VITE_RESERVATION_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

Le formulaire enverra alors un POST JSON à cette adresse (Formspree, Brevo,
Resend, Make, ou un endpoint maison). Voir `.env.example`.

> Le formulaire est présenté comme une **demande**, pas comme une confirmation :
> la table n'est réservée qu'une fois la réponse du restaurant envoyée. C'est la
> formulation honnête, et elle évite les malentendus.

---

## Les visuels

Toutes les photos de `public/images/` sont des **photos réelles du restaurant**,
recadrées aux formats de la maquette. Pour en changer, écraser le fichier en
gardant le même nom.

| Fichier | Format | Sujet |
|---|---|---|
| `hero.jpg` | 1536 × 960 | La terrasse ombragée et la vue |
| `salle.jpg` | 819 × 1024 | La salle, fauteuils de velours terracotta |
| `terrasse.jpg` | 1024 × 1024 | Table dressée en terrasse |
| `galerie-1.jpg` | 1080 × 1350 | La picanha de veau |
| `galerie-2.jpg` | 1365 × 1024 | Dos de poisson sur peau |
| `galerie-3.jpg` | 1080 × 1080 | Flambée en cuisine |
| `galerie-4.jpg` | 1080 × 1080 | Entrée dressée à l'assiette |
| `og-image.jpg` | 1200 × 630 | Aperçu lors des partages |

Le dossier Drive contient aussi des originaux en très haute définition
(`5X1A….jpg`, `DSC….jpg`) et une vidéo. Pour passer le hero en fond vidéo, la
marche à suivre est commentée en tête de `src/components/Hero.jsx`.

---

## Référencement

- Titre et description rédigés pour la recherche locale, à partir du discours de
  la maison (« Une cuisine de saison face aux vignes »).
- Données structurées `schema.org/Restaurant` complètes : horaires, téléphone,
  adresse, coordonnées GPS, gamme de prix. Google peut afficher les horaires
  directement dans les résultats.
- Balises Open Graph pour les partages.
- Langue `fr`, HTML sémantique, un seul `<h1>`.

À faire à la mise en ligne : vérifier l'URL dans les balises `canonical` et
`og:image` de `index.html`, et rédiger les pages Mentions légales et Politique
de confidentialité (obligatoires, liens présents en pied de page).
