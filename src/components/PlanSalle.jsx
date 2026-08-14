/**
 * Plan interactif d'une zone : on y choisit sa table comme un fauteuil au
 * cinéma. Dessiné en SVG pour rester net à toute taille et pouvoir être
 * relevé à l'échelle du vrai plan.
 *
 * Une table se refuse pour deux raisons distinctes, et le plan les distingue :
 * elle est déjà réservée, ou elle est trop petite pour le nombre de couverts.
 */

const RAYONS = { 2: 5, 4: 6.2, 6: 7 }
const RECUL_CHAISE = 2.4

/**
 * Place les chaises autour d'une table : réparties sur le cercle pour une
 * table ronde, alignées le long des deux grands côtés pour une rectangulaire —
 * sans quoi une tablée de six ressemble à une ronde mal dessinée.
 */
function positionsChaises(table, rayon) {
  if (table.forme !== 'rectangulaire') {
    return Array.from({ length: table.couverts }, (_, i) => {
      const angle = (i / table.couverts) * 2 * Math.PI - Math.PI / 2
      return {
        x: table.x + Math.cos(angle) * (rayon + RECUL_CHAISE),
        y: table.y + Math.sin(angle) * (rayon + RECUL_CHAISE),
      }
    })
  }

  const demiLargeur = rayon * 1.7
  const demiHauteur = rayon * 0.8
  const parCote = [Math.ceil(table.couverts / 2), Math.floor(table.couverts / 2)]

  return parCote.flatMap((nombre, cote) =>
    Array.from({ length: nombre }, (_, i) => ({
      x: table.x - demiLargeur + ((i + 1) * 2 * demiLargeur) / (nombre + 1),
      y: table.y + (cote === 0 ? -1 : 1) * (demiHauteur + RECUL_CHAISE),
    })),
  )
}

export function PlanSalle({ zone, occupees, couverts, selection, onSelectionner }) {
  return (
    <div>
      {/* En dessous d'environ 520 px, le plan défile plutôt que de rendre les
          tables trop petites pour le pouce. */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${zone.largeur} ${zone.hauteur}`}
          className="block h-auto w-full min-w-[520px]"
          role="group"
          aria-label={`Plan de ${zone.nom}`}
        >
          {/* Sol */}
          <rect
            x="1"
            y="1"
            width={zone.largeur - 2}
            height={zone.hauteur - 2}
            rx="1.5"
            className="fill-creme stroke-sable"
            strokeWidth="0.6"
          />

          {/* Volumes de service */}
          {zone.blocs.map((bloc) => (
            <g key={bloc.libelle}>
              <rect
                x={bloc.x}
                y={bloc.y}
                width={bloc.l}
                height={bloc.h}
                rx="1"
                className="fill-creme-fonce stroke-sable"
                strokeWidth="0.4"
              />
              <text
                x={bloc.x + bloc.l / 2}
                y={bloc.y + bloc.h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-nuit/45"
                style={{ fontSize: 3.1, letterSpacing: '0.08em' }}
              >
                {bloc.libelle.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Baies, garde-corps : le côté vue */}
          {zone.reperes.map((repere) => {
            const vertical = repere.x1 === repere.x2
            return (
              <g key={repere.libelle}>
                <line
                  x1={repere.x1}
                  y1={repere.y1}
                  x2={repere.x2}
                  y2={repere.y2}
                  className="stroke-ocre"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <text
                  x={vertical ? repere.x1 - 2.5 : (repere.x1 + repere.x2) / 2}
                  y={vertical ? (repere.y1 + repere.y2) / 2 : repere.y1 - 2.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-ocre"
                  style={{
                    fontSize: 2.9,
                    letterSpacing: '0.1em',
                    ...(vertical
                      ? { writingMode: 'vertical-rl', transform: 'rotate(180deg)', transformBox: 'fill-box', transformOrigin: 'center' }
                      : {}),
                  }}
                >
                  {repere.libelle.toUpperCase()}
                </text>
              </g>
            )
          })}

          {zone.tables.map((table) => (
            <Table
              key={table.id}
              table={table}
              occupee={occupees.has(table.id)}
              tropPetite={table.couverts < couverts}
              choisie={selection === table.id}
              onChoisir={() => onSelectionner(table.id)}
            />
          ))}
        </svg>
      </div>

      {/* Sur petit écran le plan est plus large que la fenêtre : sans ce
          repère, rien n'indique qu'il faut le faire glisser. */}
      <p className="mt-3 text-xs text-nuit/45 sm:hidden">
        Faites glisser le plan pour parcourir tout l’espace.
      </p>

      <Legende />
    </div>
  )
}

function Table({ table, occupee, tropPetite, choisie, onChoisir }) {
  const indisponible = occupee || tropPetite
  const rayon = RAYONS[table.couverts] ?? 6

  const motif = occupee
    ? 'Déjà réservée'
    : tropPetite
      ? `Trop petite — ${table.couverts} couverts`
      : `${table.couverts} couverts, libre`

  const surTouche = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onChoisir()
    }
  }

  const remplissage = choisie
    ? 'fill-ocre stroke-ocre'
    : indisponible
      ? 'fill-creme-fonce stroke-sable'
      : 'fill-creme stroke-nuit/35 group-hover:fill-ocre/15 group-hover:stroke-ocre'

  return (
    <g
      role="button"
      aria-label={`Table ${table.id} — ${motif}`}
      aria-pressed={choisie}
      aria-disabled={indisponible}
      tabIndex={indisponible ? -1 : 0}
      onClick={indisponible ? undefined : onChoisir}
      onKeyDown={indisponible ? undefined : surTouche}
      className={`group outline-none ${
        indisponible ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'
      }`}
      style={{ transition: 'opacity 0.3s' }}
    >
      {/* Les chaises disent la capacité sans qu'on ait à l'écrire */}
      {positionsChaises(table, rayon).map((chaise, i) => (
        <circle
          key={i}
          cx={chaise.x}
          cy={chaise.y}
          r="1.5"
          className={choisie ? 'fill-ocre/70' : 'fill-nuit/25'}
        />
      ))}

      {table.forme === 'rectangulaire' ? (
        <rect
          x={table.x - rayon * 1.7}
          y={table.y - rayon * 0.8}
          width={rayon * 3.4}
          height={rayon * 1.6}
          rx="1.2"
          className={remplissage}
          strokeWidth="0.7"
          style={{ transition: 'fill 0.3s, stroke 0.3s' }}
        />
      ) : (
        <circle
          cx={table.x}
          cy={table.y}
          r={rayon}
          className={remplissage}
          strokeWidth="0.7"
          style={{ transition: 'fill 0.3s, stroke 0.3s' }}
        />
      )}

      <text
        x={table.x}
        y={table.y}
        textAnchor="middle"
        dominantBaseline="central"
        className={choisie ? 'fill-creme' : 'fill-nuit/70'}
        style={{ fontSize: 4.2, fontWeight: 500 }}
      >
        {table.id.slice(1)}
      </text>

      {/* Anneau de focus clavier, dessiné à la main : le contour natif ne
          suit pas la forme de la table. */}
      <circle
        cx={table.x}
        cy={table.y}
        r={rayon + 3.6}
        fill="none"
        className="stroke-ocre opacity-0 group-focus-visible:opacity-100"
        strokeWidth="0.8"
        strokeDasharray="2 2"
      />
    </g>
  )
}

function Legende() {
  const entrees = [
    { libelle: 'Libre', classe: 'bg-creme border-nuit/35' },
    { libelle: 'Votre choix', classe: 'bg-ocre border-ocre' },
    { libelle: 'Indisponible', classe: 'bg-creme-fonce border-sable opacity-50' },
  ]

  return (
    <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
      {entrees.map((entree) => (
        <li key={entree.libelle} className="flex items-center gap-2 text-xs text-nuit/60">
          <span className={`h-3.5 w-3.5 rounded-full border ${entree.classe}`} aria-hidden="true" />
          {entree.libelle}
        </li>
      ))}
      <li className="text-xs text-nuit/45">Les points autour d’une table indiquent ses couverts.</li>
    </ul>
  )
}
