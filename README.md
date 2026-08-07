# Restaurant La Tour — Montady

Site vitrine one-page du Restaurant La Tour, à Montady (Hérault).
React + Vite + Tailwind CSS v4, sans dépendance externe au chargement.

---

## ⚠️ À lire avant toute mise en ligne

Deux pièces jointes étaient annoncées dans la commande — **la carte du
restaurant** et **une capture d'écran du site actuel** — mais elles ne sont pas
arrivées avec le message. Le site actuel `latourdemontady.com` est par ailleurs
inaccessible depuis l'environnement de développement (blocage réseau).

Trois éléments sont donc **provisoires** et doivent être remplacés :

| Élément | Où | Ce qu'il faut faire |
|---|---|---|
| **La carte et les tarifs** | `src/data/menu.js` | Remplacer les plats d'exemple par la carte réelle, puis passer `carteProvisoire` à `false`. |
| **La palette** | `src/index.css`, bloc `@theme` | Ajuster les couleurs pour coller à la charte existante. Tout le site suit automatiquement. |
| **Les photos et le logo** | `public/images/`, `src/components/Logo.jsx` | Écraser les fichiers par les vraies photos (mêmes noms). |

En revanche, **les informations pratiques sont réelles** et ont été vérifiées :
adresse, téléphone, horaires, Instagram, noms du chef et du chef exécutif.
Elles sont regroupées dans `src/data/infos.js`.

---

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

**Ambiance** — élégante, épurée, chaleureuse. On laisse respirer : beaucoup de
blanc tournant, des images en grand format, peu d'éléments par écran.

**Palette** (`src/index.css`, bloc `@theme`) — inspirée du lieu lui-même : la
pierre ocre de la tour sarrasine, le vert des vignes et de l'étang, la crème du
calcaire languedocien.

| Jeton | Valeur | Usage |
|---|---|---|
| `--color-nuit` | `#1B1917` | Texte principal, fonds sombres (carte, pied de page) |
| `--color-creme` | `#F7F2E9` | Fond clair dominant |
| `--color-creme-fonce` | `#EDE4D6` | Fond de la galerie, survols |
| `--color-sable` | `#DCCFB8` | Bordures, filets de séparation |
| `--color-ocre` | `#B5793F` | **Accent principal** : boutons, liens, sur-titres |
| `--color-ocre-clair` | `#C99460` | Survol des boutons |
| `--color-vert` | `#3A4A3F` | Accent secondaire (mention végétarien) |
| `--color-or` | `#D8B26A` | Filets précieux, prix, détails |

**Typographie** — le couple demandé, serif pour le cachet + sans-serif pour la
lisibilité :

- **Titres** : Cormorant Garamond. Une didone humaniste, très déliée, qui donne
  immédiatement le registre « table soignée » sans tomber dans le pompeux.
- **Textes** : Inter. Neutre, taillée pour l'écran, parfaitement lisible à
  petite taille sur mobile.

Les deux polices sont **auto-hébergées** (paquets Fontsource) : aucun appel à
Google Fonts. Chargement plus rapide et conformité RGPD acquise.

---

## Structure de la page

L'ordre suit le parcours mental d'un client : on le séduit, on le rassure, on
lui donne envie, puis on lui rend la réservation évidente.

| # | Section | Fichier | Parti pris de mise en page |
|---|---|---|---|
| — | Navigation fixe | `Nav.jsx` | Transparente sur le hero, se compacte en barre sombre au défilement. Le lien de la section courante se souligne d'un filet doré. En dessous de 1024 px : menu plein écran. |
| 1 | Hero | `Hero.jsx` | Image plein écran, texte calé en bas à gauche (l'œil y va naturellement), double voile dégradé pour garantir la lisibilité quelle que soit la photo. Deux actions : réserver, appeler. |
| 2 | Le Concept & La Vue | `Concept.jsx` | Deux colonnes : visuel en portrait 4/5 avec vignette en débord d'un côté, récit + citation du chef de l'autre. En dessous, trois piliers numérotés (fait maison / local / saison). |
| 3 | La Carte | `Carte.jsx` | **Fond sombre** — c'est la respiration du parcours et ça met les prix dorés en valeur. Les formules en trois cartes en haut, puis la carte en onglets (Entrées / Plats / Desserts) avec ligne de points à l'ancienne entre le plat et son prix. |
| 4 | Galerie | `Galerie.jsx` | Grille asymétrique : deux grands formats portent la section, deux vignettes rythment. Léger zoom au survol. |
| 5 | Réservation & Infos | `Reservation.jsx` | Le téléphone en premier, en gros, avant même le formulaire. Puis formulaire à gauche, horaires + adresse à droite, carte OpenStreetMap en pleine largeur. Le jour courant est surligné dans le tableau des horaires. |
| — | Pied de page | `Footer.jsx` | Logo, réseaux sociaux, coordonnées. |
| — | Barre mobile | `BarreMobile.jsx` | Barre fixe en bas d'écran (mobile uniquement) : **Appeler · Réserver**, toujours sous le pouce. Apparaît une fois le hero dépassé. |

---

## Mobile first

La majorité des réservations se font au téléphone, depuis un téléphone. Le site
en tire les conséquences :

- **Barre d'action permanente** en bas d'écran (appeler / réserver).
- Le numéro est un lien `tel:` partout où il apparaît — un appui, ça compose.
- Boutons pleine largeur, cibles tactiles d'au moins 44 px.
- Menu de navigation plein écran, fermable à l'Échap comme au doigt.
- Vérifié sans aucun débordement horizontal en 390 px de large.

---

## Micro-interactions

Toutes calées sur une même courbe (`cubic-bezier(0.16, 1, 0.3, 1)`) : une
décélération douce, jamais de rebond. C'est ce qui fait la différence entre
« animé » et « haut de gamme ».

- Apparition des blocs au défilement (`IntersectionObserver`, `useReveal`), avec
  des décalages en cascade sur les grilles.
- Barre de navigation qui se compacte, lien de section courante souligné.
- Boutons qui se soulèvent de 2 px au survol, avec ombre portée.
- Zoom lent des images en galerie (1,4 s).
- **`prefers-reduced-motion` respecté intégralement** : toute animation est
  neutralisée pour les personnes qui en font la demande au niveau système.

---

## Accessibilité

- Contrastes conformes AA sur les textes courants.
- Navigation clavier complète, focus visible en ocre.
- Onglets de la carte en ARIA (`tablist` / `tab` / `tabpanel`) ; les panneaux
  inactifs restent dans le HTML, donc lisibles par Google.
- Lien d'évitement en début de page.
- Balises `alt` descriptives sur toutes les images.

---

## Le formulaire de réservation

Il fonctionne **sans serveur** : sans configuration, il ouvre le logiciel de
messagerie avec la demande pré-remplie.

Pour recevoir les demandes directement par e-mail, créer un fichier `.env` :

```bash
VITE_RESERVATION_ENDPOINT=https://formspree.io/f/xxxxxxxx
```

Le formulaire enverra alors un POST JSON à cette adresse (Formspree, Brevo,
Resend, Make, ou n'importe quel endpoint maison). Voir `.env.example`.

> Le formulaire est volontairement présenté comme une **demande**, pas comme une
> confirmation : la table n'est réservée qu'une fois la réponse du restaurant
> envoyée. C'est la formulation honnête, et elle évite les malentendus.

---

## Les visuels

Les fichiers de `public/images/` sont des **visuels provisoires générés**, tous
marqués comme tels. Il suffit de les écraser en gardant les mêmes noms.

| Fichier | Format conseillé | Sujet |
|---|---|---|
| `hero.jpg` | 2400 × 1500 | La salle ou la terrasse avec la vue — l'image qui doit donner envie |
| `salle.jpg` | 1200 × 1500 (portrait) | L'intérieur, tables dressées |
| `terrasse.jpg` | 900 × 900 (carré) | La terrasse |
| `galerie-1.jpg` | 1200 × 1500 (portrait) | Une assiette |
| `galerie-2.jpg` | 1600 × 1200 | Le panorama de l'étang |
| `galerie-3.jpg` | 900 × 900 | En cuisine |
| `galerie-4.jpg` | 900 × 900 | Une table dressée |
| `og-image.jpg` | 1200 × 630 | Aperçu lors des partages sur les réseaux |

**Pour passer le hero en vidéo** : la marche à suivre est commentée en tête de
`src/components/Hero.jsx`.

---

## Référencement

- Titre et description rédigés pour la recherche locale.
- Données structurées `schema.org/Restaurant` complètes (horaires, téléphone,
  adresse, coordonnées GPS) : Google peut afficher les horaires directement dans
  les résultats.
- Balises Open Graph pour les partages.
- Langue `fr`, HTML sémantique, un seul `<h1>`.

À faire à la mise en ligne : renseigner l'URL réelle dans les balises
`canonical` et `og:image` de `index.html`, et rédiger les pages Mentions légales
et Politique de confidentialité (obligatoires, liens présents en pied de page).
