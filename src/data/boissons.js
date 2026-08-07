/* ==========================================================================
 *  Carte des boissons, reprise de la carte imprimée de la maison.
 *
 *  Deux écarts subsistent avec la capture du site actuel, tranchés en faveur
 *  de la carte imprimée (la plus complète, et celle qui porte les vins) :
 *    — les digestifs y sont GET, Cognac/Calvados/Armagnac et Loco Loco,
 *      là où le site listait Menteuse, Croqueuse et Pulpeuse ;
 *    — le cocktail Summer Tour figure sur la carte imprimée, pas sur le site.
 *  À confirmer par le restaurant.
 * ========================================================================== */

export const boissons = [
  {
    titre: 'Apéritifs',
    items: [
      { nom: 'Ricard', prix: '4,50' },
      { nom: 'Martini', prix: '5,00' },
      { nom: 'Muscat', prix: '5,00' },
      { nom: 'Porto', prix: '5,00' },
      { nom: 'Martini gin', prix: '8,00' },
      { nom: 'Campari', prix: '5,00' },
      { nom: 'Gin', prix: '5,00' },
      { nom: 'Kir', prix: '4,50' },
      { nom: 'Whisky Clan Campbell', prix: '6,00' },
      { nom: 'Whisky Jack Daniel’s — Cardhu', prix: '8,00' },
      { nom: 'Coupe de champagne', prix: '8,00' },
    ],
  },
  {
    titre: 'Cocktails',
    items: [
      {
        nom: 'Cocktail de la Tour',
        description: 'Champagne, Cointreau, crème de cassis, framboise fraîche',
        prix: '8,50',
      },
      {
        nom: 'Americano',
        description: 'Gin, Martini blanc et rouge, Campari',
        prix: '8,50',
      },
      {
        nom: 'Apérol Spritz',
        description: 'Prosecco, Apérol, eau gazeuse',
        prix: '8,50',
      },
      {
        nom: 'Summer Tour',
        description: 'Champagne, liqueur du moment, limonade et sirop',
        prix: '8,50',
      },
      {
        nom: 'Cocktail La Tour sans alcool',
        description: 'Sirop de grenadine, jus d’orange, jus d’ananas, jus de pomme',
        prix: '8,00',
      },
    ],
  },
  {
    titre: 'Bières',
    items: [
      { nom: 'Heineken bouteille', prix: '5,00' },
      { nom: 'Pression blonde Alaryk', prix: '4,00' },
      { nom: 'Pression spéciale Alaryk', prix: '4,50' },
      { nom: 'Panaché', prix: '4,00' },
      { nom: 'Monaco', prix: '4,00' },
      { nom: 'Pression blonde 50 cl', prix: '8,00' },
      { nom: 'Pression rousse 50 cl', prix: '9,50' },
      { nom: 'Picon bière', prix: '5,00' },
      { nom: 'Bock pression', prix: '3,00' },
    ],
  },
  {
    titre: 'Sans alcool',
    items: [
      { nom: 'Sirop', prix: '3,00' },
      { nom: 'Coca-Cola', prix: '4,00' },
      { nom: 'Coca Zéro', prix: '4,00' },
      { nom: 'Orangina', prix: '4,00' },
      { nom: 'Ice Tea', prix: '4,00' },
      { nom: 'Perrier', prix: '4,00' },
      { nom: 'Bière sans alcool', prix: '4,50' },
      { nom: 'Diabolo', prix: '3,50' },
      { nom: 'Jus de fruit', prix: '4,00' },
    ],
  },
  {
    titre: 'Eaux',
    items: [
      { nom: 'Vittel 50 cl', prix: '4,50' },
      { nom: 'Vittel 1 L', prix: '5,50' },
      { nom: 'San Pellegrino 50 cl', prix: '4,50' },
      { nom: 'San Pellegrino 1 L', prix: '5,50' },
    ],
  },
  {
    titre: 'Pichets',
    note: 'Pays d’Hérault · IGP — rouge, blanc ou rosé',
    items: [
      { nom: '25 cl', prix: '6,50' },
      { nom: '50 cl', prix: '9,00' },
      { nom: '75 cl', prix: '15,00' },
    ],
  },
  {
    titre: 'Digestifs',
    items: [
      { nom: 'Get', prix: '8,00' },
      { nom: 'Cognac, Calvados, Armagnac', prix: '8,00' },
      {
        nom: 'Loco Loco',
        description: 'Menthe, citron, pomme, poire, pêche, clémentine — selon l’humeur',
        prix: '8,00',
      },
    ],
  },
  {
    titre: 'Boissons chaudes',
    items: [
      { nom: 'Café', prix: '2,00' },
      { nom: 'Décaféiné', prix: '2,00' },
      { nom: 'Noisette', prix: '2,20' },
      { nom: 'Café allongé', prix: '2,00' },
      { nom: 'Café crème', prix: '3,00' },
      { nom: 'Café double', prix: '4,00' },
      { nom: 'Café arrosé', prix: '6,00' },
      { nom: 'Thé ou infusion bio', prix: '5,00' },
      { nom: 'Chocolat chaud', prix: '5,00' },
    ],
  },
]
