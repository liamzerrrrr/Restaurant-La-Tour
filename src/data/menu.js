/* ==========================================================================
 *  ⚠️  CONTENU PROVISOIRE — À REMPLACER PAR LA CARTE RÉELLE
 *
 *  La carte du restaurant n'a pas pu être récupérée : la pièce jointe annoncée
 *  (photo/PDF du menu) n'est jamais arrivée dans la session, et le site actuel
 *  latourdemontady.com est inaccessible depuis l'environnement de build.
 *
 *  Les plats et les tarifs ci-dessous sont donc des EXEMPLES de remplissage,
 *  écrits dans l'esprit bistronomique et régional de la maison, uniquement
 *  destinés à valider la mise en page. Ils ne doivent en aucun cas être mis en
 *  ligne tels quels.
 *
 *  Pour intégrer la vraie carte : remplacer le contenu des tableaux ci-dessous.
 *  La structure des objets ne change pas, le rendu s'adapte automatiquement au
 *  nombre de plats. Puis passer `carteProvisoire` à false.
 * ========================================================================== */

export const carteProvisoire = true

/**
 * Formules et menus.
 * `lignes` : composition de la formule. `note` : conditions éventuelles.
 */
export const formules = [
  {
    nom: 'Formule du Midi',
    prix: '21',
    lignes: ['Entrée + Plat', 'ou Plat + Dessert'],
    note: 'Servie du lundi au vendredi midi, hors jours fériés.',
    miseEnAvant: false,
  },
  {
    nom: 'Menu du Marché',
    prix: '26',
    lignes: ['Entrée', 'Plat', 'Dessert'],
    note: 'Composé chaque matin selon le retour du marché.',
    miseEnAvant: true,
  },
  {
    nom: 'Menu Découverte',
    prix: '42',
    lignes: ['Mise en bouche', 'Entrée', 'Plat', 'Fromages affinés', 'Dessert'],
    note: 'Servi pour l’ensemble de la table, midi et soir.',
    miseEnAvant: false,
  },
]

/** Sections de la carte. Chaque plat : nom, description, prix (en euros). */
export const sections = [
  {
    id: 'entrees',
    titre: 'Entrées',
    plats: [
      {
        nom: 'Velouté de courge muscade',
        description: 'Châtaignes torréfiées, crème fouettée au thym citron',
        prix: '12',
      },
      {
        nom: 'Tartare de daurade royale',
        description: 'Agrumes du Roussillon, huile d’olive de Bouzigues, aneth',
        prix: '16',
      },
      {
        nom: 'Œuf parfait à 63°',
        description: 'Émulsion de cèpes, lard paysan grillé, jeunes pousses',
        prix: '14',
      },
      {
        nom: 'Terrine de campagne maison',
        description: 'Cornichons croquants, chutney d’oignons doux des Cévennes',
        prix: '11',
      },
    ],
  },
  {
    id: 'plats',
    titre: 'Plats',
    plats: [
      {
        nom: 'Filet de bœuf de l’Aubrac',
        description: 'Pomme fondante, jus corsé au vin de Faugères, légumes de saison',
        prix: '29',
      },
      {
        nom: 'Dos de cabillaud rôti sur peau',
        description: 'Risotto crémeux au safran, coquillages de l’étang de Thau',
        prix: '26',
      },
      {
        nom: 'Souris d’agneau confite sept heures',
        description: 'Écrasé de pomme de terre à l’huile d’olive, romarin et ail doux',
        prix: '25',
      },
      {
        nom: 'Suprême de volaille fermière',
        description: 'Gratin dauphinois, jus perlé à l’estragon',
        prix: '23',
      },
      {
        nom: 'Risotto de petit épeautre',
        description: 'Légumes racines glacés, copeaux de brebis des Pyrénées',
        prix: '20',
        vegetarien: true,
      },
    ],
  },
  {
    id: 'desserts',
    titre: 'Desserts',
    plats: [
      {
        nom: 'Tarte fine aux pommes',
        description: 'Caramel au beurre salé, glace vanille de Madagascar',
        prix: '10',
      },
      {
        nom: 'Cœur coulant au chocolat noir',
        description: 'Grand cru 70 %, crème anglaise à la fève tonka',
        prix: '11',
      },
      {
        nom: 'Baba imbibé au Muscat de Frontignan',
        description: 'Chantilly légère, agrumes confits',
        prix: '11',
      },
      {
        nom: 'Assiette de fromages affinés',
        description: 'Sélection de la région, confiture de figues maison',
        prix: '12',
      },
    ],
  },
]

/** Mention légale affichée sous la carte. */
export const mentionCarte =
  'Nos plats sont élaborés sur place à partir de produits bruts, frais et de saison. La carte évolue au fil du marché : certaines suggestions du jour ne figurent pas ici. Pour toute allergie ou régime particulier, prévenez-nous lors de la réservation.'
