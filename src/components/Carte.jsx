import { useState } from 'react'
import { TitreSection } from './TitreSection'
import { useReveal } from '../hooks/useReveal'
import { formules, mentionCarte, sections } from '../data/menu'
import { mentionVins, vins } from '../data/vins'
import { boissons } from '../data/boissons'

/**
 * Onglets de la carte. Les trois premiers viennent des sections de plats, les
 * deux derniers ont leur propre mise en page : les vins sont groupés par
 * appellation, les boissons se répartissent en colonnes par famille.
 */
const onglets = [
  ...sections.map((section) => ({ id: section.id, titre: section.titre, type: 'plats', section })),
  { id: 'vins', titre: 'Les Vins', type: 'vins' },
  { id: 'boissons', titre: 'Les Boissons', type: 'boissons' },
]

export function Carte() {
  const [ongletActif, setOngletActif] = useState(onglets[0].id)

  return (
    <section id="carte" className="relative bg-nuit py-24 text-creme sm:py-32">
      {/* Texture discrète : évite l'aplat sombre trop plat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, #d5ab93 0, transparent 45%), radial-gradient(circle at 85% 80%, #a85736 0, transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <TitreSection
          clair
          centre
          surtitre="La carte & les menus"
          titre="Ce que l’on sert aujourd’hui"
          chapo="Quatre menus et une carte volontairement courte, qui évoluent avec les saisons. À table, une cave resserrée sur les vignerons du Languedoc — souvent nos voisins de coteau."
        />

        {/* Formules et menus */}
        <div className="mt-16 grid gap-6 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {formules.map((formule, i) => (
            <CarteFormule key={formule.nom} formule={formule} index={i} />
          ))}
        </div>

        {/* Onglets de la carte */}
        <div className="mt-24 sm:mt-28">
          {/* Sur mobile, cinq onglets se répartiraient sur trois lignes et
              rempliraient l'écran : la barre défile horizontalement, et se
              recentre sur une seule ligne dès qu'il y a la place. */}
          <div
            role="tablist"
            aria-label="Sections de la carte"
            className="flex snap-x snap-mandatory gap-x-1 overflow-x-auto border-b border-creme/15 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:gap-x-6 sm:overflow-x-visible [&::-webkit-scrollbar]:hidden"
          >
            {onglets.map((onglet) => {
              const actif = onglet.id === ongletActif
              return (
                <button
                  key={onglet.id}
                  role="tab"
                  id={`onglet-${onglet.id}`}
                  aria-selected={actif}
                  aria-controls={`panneau-${onglet.id}`}
                  onClick={(e) => {
                    setOngletActif(onglet.id)
                    e.currentTarget.scrollIntoView({ block: 'nearest', inline: 'center' })
                  }}
                  className={`relative shrink-0 snap-center px-3 py-4 font-display text-lg whitespace-nowrap transition-colors duration-400 sm:px-4 sm:text-2xl lg:text-3xl ${
                    actif ? 'text-or' : 'text-creme/50 hover:text-creme/85'
                  }`}
                >
                  {onglet.titre}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-px bg-or transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      actif ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {onglets.map((onglet) => (
            <div
              key={onglet.id}
              role="tabpanel"
              id={`panneau-${onglet.id}`}
              aria-labelledby={`onglet-${onglet.id}`}
              hidden={onglet.id !== ongletActif}
              className="mt-12 sm:mt-14"
            >
              {onglet.type === 'plats' && <PanneauPlats section={onglet.section} />}
              {onglet.type === 'vins' && <PanneauVins />}
              {onglet.type === 'boissons' && <PanneauBoissons />}
            </div>
          ))}
        </div>

        <p className="mx-auto mt-20 max-w-2xl text-center text-sm leading-relaxed text-creme/50">
          {mentionCarte}
        </p>

        <div className="mt-10 flex justify-center">
          <a href="#reservation" className="btn-principal">
            Réserver une table
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- Menus --- */

function CarteFormule({ formule, index }) {
  const reveal = useReveal({ delai: index * 120 })

  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} flex flex-col border p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${
        formule.miseEnAvant ? 'border-or bg-creme/[0.06]' : 'border-creme/15 hover:border-creme/35'
      }`}
    >
      {formule.miseEnAvant && <span className="surtitre mb-4 text-or">Le plus demandé</span>}

      <h3 className="font-display text-3xl text-creme">{formule.nom}</h3>

      <ul className="mt-6 space-y-2.5">
        {formule.lignes.map((ligne) => (
          <li key={ligne} className="flex items-baseline gap-3 text-sm text-creme/75">
            <span className="h-px w-3 shrink-0 translate-y-[-3px] bg-or" aria-hidden="true" />
            {ligne}
          </li>
        ))}
      </ul>

      {/* Le bloc tarifaire est poussé en bas de carte : les prix des quatre
          menus s'alignent sur une même ligne quelle que soit leur hauteur. */}
      <div className="mt-auto pt-10">
        <p className="font-display text-4xl text-or">
          {formule.prix}
          <span className="ml-1 text-2xl">€</span>
        </p>

        {/* Hauteur réservée pour la note la plus longue : sans elle, les prix
            des quatre menus ne tomberaient pas sur la même ligne. */}
        <p className="mt-4 min-h-[4rem] text-xs leading-relaxed text-creme/45">{formule.note}</p>
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- Plats --- */

function PanneauPlats({ section }) {
  return (
    <div className="grid gap-x-14 gap-y-9 lg:grid-cols-2">
      {section.plats.map((plat) => (
        <Plat key={plat.nom} plat={plat} />
      ))}
    </div>
  )
}

function Plat({ plat }) {
  return (
    <article className="group">
      <LigneTarif nom={plat.nom} prix={plat.prix} vegetarien={plat.vegetarien} />
      <p className="mt-2 max-w-md text-sm leading-relaxed text-creme/55">{plat.description}</p>
    </article>
  )
}

/* ----------------------------------------------------------------- Vins --- */

function PanneauVins() {
  return (
    <div className="space-y-16">
      {vins.map((famille) => (
        <div key={famille.id}>
          <h3 className="font-display text-3xl text-creme sm:text-4xl">{famille.couleur}</h3>
          <span className="filet-or mt-4" />

          {/* Colonnes CSS plutôt qu'une grille : les appellations n'ont ni le
              même nombre de crus ni la même hauteur, et se répartissent ici
              sans laisser de blancs sous les plus courtes. */}
          <div className="mt-10 gap-x-14 lg:columns-2">
            {famille.appellations.map((appellation) => (
              <section key={famille.id + appellation.nom} className="mb-11 break-inside-avoid">
                <h4 className="surtitre text-or">{appellation.nom}</h4>

                <div className="mt-5 space-y-7">
                  {appellation.crus.map((cru) => (
                    <article key={cru.nom} className="group">
                      <LigneTarif nom={cru.nom} prix={cru.prix} taille="petit" balise="h5" />

                      <p className="mt-1.5 text-sm text-creme/60">{cru.cepages}</p>
                      <p className="mt-1 text-sm text-creme/45 italic">{cru.notes}</p>

                      {cru.demi && (
                        <p className="mt-1.5 text-xs text-creme/45">
                          Également en 50 cl — <span className="text-or">{cru.demi} €</span>
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      ))}

      <p className="max-w-2xl text-sm leading-relaxed text-creme/50">{mentionVins}</p>
    </div>
  )
}

/* ------------------------------------------------------------- Boissons --- */

function PanneauBoissons() {
  return (
    /* Colonnes CSS plutôt qu'une grille : les familles n'ont pas la même
       hauteur et se répartissent ici sans laisser de trous. */
    <div className="gap-x-14 sm:columns-2 lg:columns-3">
      {boissons.map((famille) => (
        <section key={famille.titre} className="mb-11 break-inside-avoid">
          <h3 className="font-display text-2xl text-or">{famille.titre}</h3>

          {famille.note && <p className="mt-1 text-xs text-creme/45">{famille.note}</p>}

          <div className="mt-5 space-y-4">
            {famille.items.map((item) => (
              <article key={item.nom}>
                <LigneTarif nom={item.nom} prix={item.prix} taille="petit" balise="h4" />
                {item.description && (
                  <p className="mt-1 text-xs leading-relaxed text-creme/50">{item.description}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- Commun --- */

/**
 * Ligne « intitulé — points de conduite — prix », commune aux plats, aux vins
 * et aux boissons. Sans tarif communiqué, ni points ni prix ne s'affichent.
 */
function LigneTarif({ nom, prix, vegetarien = false, taille = 'grand', balise: Titre = 'h3' }) {
  const styleNom =
    taille === 'grand'
      ? 'font-display text-xl sm:text-2xl'
      : 'font-display text-base sm:text-lg leading-snug'

  return (
    <div className="flex items-baseline gap-3">
      {/* Le niveau de titre suit la profondeur réelle de l'onglet : un plat est
          un h3, un cru vient sous son appellation, donc un h5. */}
      <Titre className={`${styleNom} text-creme transition-colors duration-300 group-hover:text-or`}>
        {nom}
        {vegetarien && (
          <span className="ml-2 align-middle text-xs text-vert" title="Plat végétarien">
            ●<span className="sr-only"> Plat végétarien</span>
          </span>
        )}
      </Titre>

      {prix && (
        <>
          <span
            aria-hidden="true"
            className="mb-1 h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(240,227,218,0.28)_0_2px,transparent_2px_6px)]"
          />
          <span
            className={`whitespace-nowrap text-or ${
              taille === 'grand' ? 'font-display text-xl sm:text-2xl' : 'text-sm sm:text-base'
            }`}
          >
            {prix} €
          </span>
        </>
      )}
    </div>
  )
}
