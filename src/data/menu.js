/* ==========================================================================
 *  Carte et menus du Restaurant La Tour.
 *  Contenu repris fidèlement de la carte officielle fournie par la maison.
 *
 *  Seule réserve : les tarifs à l'unité des entrées ne figuraient pas sur le
 *  document. Leur champ `prix` est donc à null — la mise en page les affiche
 *  proprement sans prix. Il suffit de renseigner les valeurs pour qu'ils
 *  apparaissent, aucune autre modification n'est nécessaire.
 * ========================================================================== */

/**
 * Les menus. `lignes` résume la composition ; le détail des plats se trouve
 * dans les onglets de la carte, juste en dessous sur la page.
 */
export const formules = [
  {
    nom: 'Le Découverte',
    prix: '34,90',
    lignes: ['Une entrée au choix', 'Un plat au choix', 'Assiette de fromages ou dessert'],
    note: 'Berlingot ou picanha de veau, puis bar sauvage ou taureau de Camargue.',
    miseEnAvant: false,
  },
  {
    nom: 'L’Oppidum',
    prix: '40,90',
    lignes: [
      'Une entrée au choix',
      'Un plat au choix',
      'Assiette de fromages',
      'Dessert au choix',
    ],
    note: 'Trois entrées et trois plats au choix, dont le retour du chef.',
    miseEnAvant: true,
  },
  {
    nom: 'Le Dégustation',
    prix: '69,00',
    lignes: [
      'Makis de canard fermier',
      'Homard bleu',
      'Le retour du chef',
      'Assiette de fromages',
      'Dessert au choix',
    ],
    note: 'Cinq services. Ce menu doit être choisi par toutes les personnes de la table.',
    miseEnAvant: false,
  },
  {
    nom: 'Menu Enfant',
    prix: '12,00',
    lignes: ['Fingers de poulet ou filet de poisson et frites', 'Crème chocolat ou glace', 'Un sirop au choix'],
    note: 'Jusqu’à 12 ans.',
    miseEnAvant: false,
  },
]

/** Sections de la carte. `prix` à null = tarif non communiqué. */
export const sections = [
  {
    id: 'entrees',
    titre: 'Les Entrées',
    plats: [
      {
        nom: 'Le Berlingot',
        description:
          'de betterave au chèvre de Combebelle, éclat croustillant, sorbet betterave-framboise, ketchup réduit',
        prix: null,
      },
      {
        nom: 'Le Bras de Poupe',
        description:
          'en médaillon et gelée de crustacés, aïoli blanco andalou, perles de hareng fumé, chips de guanciale',
        prix: null,
      },
      {
        nom: 'Les Makis de Canard Fermier',
        description: 'mousseline de foie gras à la truffe',
        prix: null,
      },
      {
        nom: 'La Picanha de Veau',
        description: 'en basse température comme un vitello tonnato, sablé parmesan',
        prix: null,
      },
      {
        nom: 'Le Thon Rouge',
        description: 'de Méditerranée en mosaïque fumé minute et crème d’artichauts barigoule',
        prix: null,
      },
    ],
  },
  {
    id: 'plats',
    titre: 'Les Plats Chauds',
    plats: [
      {
        nom: 'Le Taureau de Camargue',
        description: 'en noisette, jus réduit à la sangria',
        prix: '24',
      },
      {
        nom: 'Le Croustillant de Pigeonneau',
        description: 'bardé au foie gras, gastrique aux fruits rouges',
        prix: '25',
      },
      {
        nom: 'Le Dos de Bar Sauvage',
        description: 'sur peau, jus de coquillages monté au beurre noisette',
        prix: '24',
      },
      {
        nom: 'Le Dos de Cabillaud Skrei',
        description: 'sauce tamarin',
        prix: '25',
      },
      {
        nom: 'Le Retour du Chef',
        description: 'selon son humeur, viande de race ou de chasse — suggestion à demander',
        prix: '26',
      },
      {
        nom: 'Le Homard Bleu',
        description: 'crème iodée et salicornes',
        prix: '43',
      },
    ],
  },
  {
    id: 'desserts',
    titre: 'Fromages & Desserts',
    plats: [
      {
        nom: 'Assiette de Fromages',
        description: 'sélection affinée',
        prix: '9',
      },
      {
        nom: 'La Pavlova',
        description: 'aux fraises de région et fruits rouges, chiboust à la stracciatella',
        prix: '9',
      },
      {
        nom: 'Le Finger Chocolat',
        description: 'grand cru, cœur crémeux aux éclats de caramel et cacahuètes torréfiées',
        prix: '9',
      },
      {
        nom: 'La Pêche Texturée',
        description: 'autour d’un cheesecake crémeux, gel citron et sorbet pêche',
        prix: '9',
      },
    ],
  },
]

/** Mention affichée sous la carte, reprise du document de la maison. */
export const mentionCarte =
  'Le « fait maison » impose de commander votre dessert en même temps que votre plat. La carte évolue au fil des saisons : certaines suggestions du jour ne figurent pas ici. Pour toute allergie ou régime particulier, prévenez-nous lors de la réservation.'
