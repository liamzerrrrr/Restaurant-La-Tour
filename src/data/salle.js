/* ==========================================================================
 *  PLAN DES DEUX ESPACES — DONNÉES FICTIVES
 *
 *  ⚠️  Ce plan est inventé. Il sert à valider le principe et la mise en page.
 *  Pour passer au vrai plan, il suffit de réécrire les tableaux ci-dessous :
 *  aucun composant n'a à être modifié.
 *
 *  Repère de dessin : chaque zone définit sa propre grille (`largeur` ×
 *  `hauteur`), en unités arbitraires. Les positions des tables et du décor
 *  s'expriment dans cette grille — on peut donc relever des cotes réelles
 *  (en mètres, par exemple) et les reporter telles quelles.
 * ========================================================================== */

export const zones = [
  {
    id: 'salle',
    nom: 'La Salle',
    description:
      'À l’abri, sous les suspensions et face aux baies vitrées. Le choix des soirs de vent ou de pluie.',
    largeur: 120,
    hauteur: 84,

    // Volumes fixes : mobilier de service et accès
    blocs: [
      { x: 6, y: 6, l: 26, h: 11, libelle: 'Bar' },
      { x: 6, y: 66, l: 20, h: 12, libelle: 'Entrée' },
      { x: 92, y: 6, l: 22, h: 9, libelle: 'Office' },
    ],

    // Traits remarquables : baies, garde-corps, cloisons
    reperes: [{ x1: 117, y1: 22, x2: 117, y2: 78, libelle: 'Baies vitrées — vue sur la plaine' }],

    // Répartition volontairement variée : sans plusieurs tables de 4 et de 6,
    // une tablée de cinq ou six ne trouve jamais rien et le plan décourage.
    tables: [
      { id: 'S1', x: 100, y: 27, couverts: 2, forme: 'ronde' },
      { id: 'S2', x: 100, y: 46, couverts: 2, forme: 'ronde' },
      { id: 'S3', x: 100, y: 65, couverts: 4, forme: 'ronde' },
      { id: 'S4', x: 70, y: 24, couverts: 4, forme: 'ronde' },
      { id: 'S5', x: 70, y: 45, couverts: 2, forme: 'ronde' },
      { id: 'S6', x: 76, y: 70, couverts: 6, forme: 'rectangulaire' },
      { id: 'S7', x: 40, y: 30, couverts: 2, forme: 'ronde' },
      { id: 'S8', x: 42, y: 52, couverts: 4, forme: 'ronde' },
      { id: 'S9', x: 44, y: 70, couverts: 6, forme: 'rectangulaire' },
      { id: 'S10', x: 16, y: 40, couverts: 4, forme: 'ronde' },
    ],
  },

  {
    id: 'terrasse',
    nom: 'La Terrasse',
    description:
      'Sous la pergola, face au grand cercle de l’étang. La plus demandée dès les beaux jours.',
    largeur: 150,
    hauteur: 66,

    blocs: [{ x: 4, y: 22, l: 17, h: 21, libelle: 'Accès' }],

    reperes: [{ x1: 20, y1: 61, x2: 146, y2: 61, libelle: 'Garde-corps — vue sur l’étang' }],

    tables: [
      { id: 'T1', x: 30, y: 47, couverts: 2, forme: 'ronde' },
      { id: 'T2', x: 52, y: 47, couverts: 2, forme: 'ronde' },
      { id: 'T3', x: 78, y: 47, couverts: 4, forme: 'ronde' },
      { id: 'T4', x: 106, y: 47, couverts: 4, forme: 'ronde' },
      { id: 'T5', x: 132, y: 47, couverts: 2, forme: 'ronde' },
      { id: 'T6', x: 34, y: 19, couverts: 4, forme: 'ronde' },
      { id: 'T7', x: 70, y: 18, couverts: 6, forme: 'rectangulaire' },
      { id: 'T8', x: 104, y: 19, couverts: 4, forme: 'ronde' },
      { id: 'T9', x: 134, y: 18, couverts: 6, forme: 'rectangulaire' },
    ],
  },
]

/** Toutes les tables, à plat, avec leur zone d'appartenance. */
export const toutesLesTables = zones.flatMap((zone) =>
  zone.tables.map((table) => ({ ...table, zoneId: zone.id, zoneNom: zone.nom })),
)

/** Retrouve une table par son identifiant. */
export function trouverTable(id) {
  return toutesLesTables.find((table) => table.id === id) ?? null
}
