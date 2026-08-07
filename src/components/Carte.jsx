import { useState } from 'react'
import { TitreSection } from './TitreSection'
import { useReveal } from '../hooks/useReveal'
import { formules, mentionCarte, sections } from '../data/menu'

export function Carte() {
  const [ongletActif, setOngletActif] = useState(sections[0].id)

  return (
    <section id="carte" className="relative bg-nuit py-24 text-creme sm:py-32">
      {/* Texture discrète : évite l'aplat sombre trop plat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, #d8b26a 0, transparent 45%), radial-gradient(circle at 85% 80%, #b5793f 0, transparent 40%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <TitreSection
          clair
          centre
          surtitre="La carte"
          titre="Ce que l’on sert aujourd’hui"
          chapo="Une carte courte, qui change avec le marché. C’est la condition pour que tout reste frais et fait maison."
        />

        {/* Formules et menus */}
        <div className="mt-16 grid gap-6 sm:mt-20 md:grid-cols-3">
          {formules.map((formule, i) => (
            <CarteFormule key={formule.nom} formule={formule} index={i} />
          ))}
        </div>

        {/* Onglets de la carte */}
        <div className="mt-24 sm:mt-28">
          <div
            role="tablist"
            aria-label="Sections de la carte"
            className="flex flex-wrap justify-center gap-2 border-b border-creme/15 sm:gap-8"
          >
            {sections.map((section) => {
              const actif = section.id === ongletActif
              return (
                <button
                  key={section.id}
                  role="tab"
                  id={`onglet-${section.id}`}
                  aria-selected={actif}
                  aria-controls={`panneau-${section.id}`}
                  onClick={() => setOngletActif(section.id)}
                  className={`relative px-4 py-4 font-display text-2xl transition-colors duration-400 sm:px-6 sm:text-3xl ${
                    actif ? 'text-or' : 'text-creme/50 hover:text-creme/85'
                  }`}
                >
                  {section.titre}
                  <span
                    className={`absolute inset-x-3 bottom-0 h-px bg-or transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      actif ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {sections.map((section) => (
            <div
              key={section.id}
              role="tabpanel"
              id={`panneau-${section.id}`}
              aria-labelledby={`onglet-${section.id}`}
              hidden={section.id !== ongletActif}
              className="mt-12 grid gap-x-14 gap-y-9 sm:mt-14 lg:grid-cols-2"
            >
              {section.plats.map((plat) => (
                <Plat key={plat.nom} plat={plat} />
              ))}
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

function CarteFormule({ formule, index }) {
  const reveal = useReveal({ delai: index * 120 })

  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} flex flex-col border p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 ${
        formule.miseEnAvant
          ? 'border-or bg-creme/[0.06]'
          : 'border-creme/15 hover:border-creme/35'
      }`}
    >
      {formule.miseEnAvant && (
        <span className="surtitre mb-4 text-or">Le plus demandé</span>
      )}

      <h3 className="font-display text-3xl text-creme">{formule.nom}</h3>

      <ul className="mt-6 space-y-2.5">
        {formule.lignes.map((ligne) => (
          <li key={ligne} className="flex items-baseline gap-3 text-sm text-creme/75">
            <span className="h-px w-3 shrink-0 translate-y-[-3px] bg-or" aria-hidden="true" />
            {ligne}
          </li>
        ))}
      </ul>

      {/* Le bloc tarifaire est poussé en bas de carte : les prix des trois
          formules s'alignent sur une même ligne quelle que soit leur hauteur. */}
      <div className="mt-auto pt-10">
        <p className="font-display text-4xl text-or">
          {formule.prix}
          <span className="ml-1 text-2xl">€</span>
        </p>

        <p className="mt-4 min-h-[2.75rem] text-xs leading-relaxed text-creme/45">
          {formule.note}
        </p>
      </div>
    </div>
  )
}

function Plat({ plat }) {
  return (
    <article className="group">
      <div className="flex items-baseline gap-4">
        <h3 className="font-display text-xl text-creme transition-colors duration-300 group-hover:text-or sm:text-2xl">
          {plat.nom}
          {plat.vegetarien && (
            <span className="ml-2 align-middle text-xs text-vert" title="Plat végétarien">
              ●<span className="sr-only"> Plat végétarien</span>
            </span>
          )}
        </h3>

        {/* Ligne de points à l'ancienne, qui relie le plat à son prix */}
        <span
          aria-hidden="true"
          className="mb-1 h-px flex-1 bg-[repeating-linear-gradient(to_right,rgba(247,242,233,0.28)_0_2px,transparent_2px_6px)]"
        />

        <span className="font-display text-xl text-or sm:text-2xl">{plat.prix} €</span>
      </div>

      <p className="mt-2 max-w-md text-sm leading-relaxed text-creme/55">{plat.description}</p>
    </article>
  )
}
