/* ==========================================================================
 *  Carte des vins, reprise de la carte imprimée de la maison.
 *
 *  Les prix sont ceux de la bouteille. `demi` est renseigné pour les deux
 *  références également servies en 50 cl.
 *
 *  Note : aucune page « vins rosés » ne figurait dans les documents fournis.
 *  Les rosés n'apparaissent donc qu'au pichet, dans la carte des boissons.
 * ========================================================================== */

export const vins = [
  {
    id: 'rouges',
    couleur: 'Vins rouges',
    appellations: [
      {
        nom: 'Corbières',
        crus: [
          {
            nom: 'Château Vaugelas — Le Prieuré',
            cepages: 'Domaine Bonfils Cibadiès · Syrah, Grenache, Mourvèdre, Carignan',
            notes: 'Élevé en fûts de chêne, soyeux, fruits noirs, épicé et boisé',
            prix: '28,00',
          },
          {
            nom: 'Domaine Castelmaure — Le Pompadour · AOP',
            cepages: 'Syrah, Grenache, Carignan',
            notes: 'Arômes de fruits rouges, boisé subtil',
            prix: '27,00',
          },
        ],
      },
      {
        nom: 'Faugères',
        crus: [
          {
            nom: 'Les Estanille — Vallongue · AOP',
            cepages: 'Syrah, Grenache, Carignan, Mourvèdre',
            notes: 'Harmonieux, complexe, riche',
            prix: '28,00',
          },
        ],
      },
      {
        nom: 'Pic Saint-Loup',
        crus: [
          {
            nom: 'Rouge La Meute · AOP',
            cepages: 'Grenache',
            notes: 'Vin rond et équilibré',
            prix: '26,00',
          },
          {
            nom: 'La Lune du Loup — Grand Terroir',
            cepages: 'Grenache, Syrah',
            notes: 'Torrent de fruits, finale mûres sauvages, soyeux et gourmand',
            prix: '30,00',
          },
        ],
      },
      {
        nom: 'Côtes de Thongues',
        crus: [
          {
            nom: 'Domaine Saint-Georges d’Ibry — L’Excellence',
            cepages: 'Merlot, Syrah, Cabernet-Sauvignon',
            notes: 'Élégant et équilibré',
            prix: '26,00',
            demi: '20,00',
          },
          {
            nom: 'L’Âme des Pins',
            cepages: 'Cabernet, Sauvignon, Merlot',
            notes:
              'Parfums d’épices, réglisse douce et fruits confits, notes de boisé, chaleureux en bouche',
            prix: '28,00',
          },
        ],
      },
      {
        nom: 'La Clape',
        crus: [
          {
            nom: 'Château Capitoul — Rocaille · AOP',
            cepages: 'Syrah, Grenache noir, Carignan, Cinsault',
            notes: 'Notes de fruits rouges, épicé, vif et frais, tanins puissants',
            prix: '27,00',
          },
        ],
      },
      {
        nom: 'Saint-Chinian',
        crus: [
          {
            nom: 'La Grange des Combes Roquebrun · AOC',
            cepages: 'Syrah, Grenache, Mourvèdre',
            notes: 'Nez riche et puissant, cerises confites, harmonieux',
            prix: '29,00',
          },
          {
            nom: 'Les Orchis du Mazet · AOC',
            cepages: 'Grenache, Carignan',
            notes: 'Élevé en amphore, violette, fruits rouges, élégant et raffiné',
            prix: '28,00',
          },
        ],
      },
      {
        nom: 'Pays d’Oc',
        crus: [
          {
            nom: 'Domaine Bachellery — Baccalarius · IGP',
            cepages: 'Grenache noir',
            notes:
              'Arômes de fruits rouges, notes toastées, légèrement épicé, élevé en fût de chêne',
            prix: '29,00',
          },
          {
            nom: 'Château Mus — Carménère · IGP',
            cepages: '100 % Carménère',
            notes:
              'Registre floral et fruité, finale poivre, framboise et noisette, tanins soyeux, belle longueur',
            prix: '26,00',
          },
        ],
      },
      {
        nom: 'Minervois',
        crus: [
          {
            nom: 'Cave Pouzol Maillac — L’Instant si rare',
            cepages: '100 % Syrah',
            notes: 'Épicé et puissant, bouche ample, généreux et doux',
            prix: '28,00',
          },
          {
            nom: 'Domaine Baroubio — Marie-Thérèse · AOP',
            cepages: 'Syrah, Grenache',
            notes: 'Arômes de pain grillé, épices, truffe, tanins fermes',
            prix: '28,00',
          },
        ],
      },
      {
        nom: 'Terrasses du Larzac',
        crus: [
          {
            nom: 'Domaine L’Estagnol — L’Estagnol',
            cepages: 'Syrah, Grenache, Cinsault, Mourvèdre',
            notes: 'Gelée de mûres, épicé et vanillé, notes de cerises griottées',
            prix: '24,00',
          },
        ],
      },
    ],
  },
  {
    id: 'blancs',
    couleur: 'Vins blancs',
    appellations: [
      {
        nom: 'Côtes de Thongues',
        crus: [
          {
            nom: 'Saint-Georges d’Ibry — L’Excellence · IGP',
            cepages: 'Chardonnay, Sauvignon, Viognier, Muscat',
            notes: 'Élégant et complexe',
            prix: '26,00',
            demi: '20,00',
          },
          {
            nom: 'Closerie d’Ibry — Chemins Partagés',
            cepages: 'Viognier, Chardonnay',
            notes: 'Élevé en barriques',
            prix: '26,00',
          },
        ],
      },
      {
        nom: 'Côtes de Gascogne',
        crus: [
          {
            nom: 'Domaine Uby Gascogne — N° 4',
            cepages: 'Gros et Petit Manseng',
            notes: 'Notes de miel d’acacia, finale gourmande et sucrée',
            prix: '24,00',
          },
        ],
      },
      {
        nom: 'La Clape',
        crus: [
          {
            nom: 'Château Capitoul — Rocaille · AOP',
            cepages: 'Marsanne, Bourboulenc, Grenache blanc',
            notes: 'Accent délicieusement iodé, notes d’acacia et de noix',
            prix: '27,00',
          },
        ],
      },
      {
        nom: 'Saint-Chinian',
        crus: [
          {
            nom: 'Domaine de Fontanche · AOP',
            cepages: '50 % Marsanne, 50 % Roussanne',
            notes: 'Robe jaune, arômes de fruits à chair blanche, fin de bouche grasse',
            prix: '25,00',
          },
        ],
      },
      {
        nom: 'Coteaux d’Ensérune',
        crus: [
          {
            nom: 'Domaine Vila Voltaire — Le Puech Auriol · IGP',
            cepages: 'Chardonnay, Carignan blanc',
            notes: 'Fruits secs, épices, bouche ample',
            prix: '23,00',
          },
        ],
      },
    ],
  },
]

export const mentionVins =
  'Prix à la bouteille. Une sélection resserrée de vignerons du Languedoc et du Sud-Ouest, presque tous à moins d’une heure de la table. Vins au verre et pichets : voir la carte des boissons.'
