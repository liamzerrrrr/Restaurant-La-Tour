import { introPartenaires, partenaires } from '../data/partenaires'
import { useReveal } from '../hooks/useReveal'
import { IconeEpingle, IconeFleche, IconeTelephone } from './Icones'

export function Partenaires() {
  return (
    <>
      {/* En-tête de page. Plus compact que le hero de l'accueil : c'est une
          page de contenu, pas une vitrine — on va droit au sujet. */}
      <header className="bg-nuit pt-36 pb-20 text-creme sm:pt-44 sm:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="surtitre text-or">La Tour de Montady</p>
          <span className="filet-or mt-5" />
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02]">
            Nos partenaires
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-creme/70 sm:text-lg">
            {introPartenaires}
          </p>
        </div>
      </header>

      <main id="contenu" className="bg-creme py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {partenaires.map((partenaire, i) => (
              <Fiche key={partenaire.id} partenaire={partenaire} index={i} />
            ))}
          </div>

          {/* Retour vers l'accueil : une page de contenu ne doit jamais être
              un cul-de-sac. */}
          <div className="mt-20 border-t border-sable pt-14 text-center">
            <h2 className="font-display text-3xl text-nuit sm:text-4xl">
              Envie de passer à table ?
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
              <a href="/#reservation" className="btn-principal">
                Réserver une table
              </a>
              <a href="/#carte" className="btn-contour text-nuit hover:!bg-nuit hover:!text-creme">
                Voir la carte <IconeFleche />
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function Fiche({ partenaire, index }) {
  const reveal = useReveal({ delai: (index % 2) * 100 })

  return (
    <article
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} group flex flex-col border border-sable bg-creme p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-ocre/45 sm:p-10`}
    >
      {partenaire.logo && (
        <div className="mb-8 flex h-24 items-center">
          <img
            src={partenaire.logo}
            alt={`Logo ${partenaire.nom}`}
            loading="lazy"
            className="max-h-24 w-auto max-w-[70%] object-contain"
          />
        </div>
      )}

      <p className="surtitre text-ocre">{partenaire.categorie}</p>

      <h2 className="mt-4 font-display text-3xl text-nuit sm:text-4xl">
        {partenaire.nom}
        {partenaire.ville && (
          <span className="mt-1 block font-sans text-xs tracking-[0.2em] text-nuit/40 uppercase">
            {partenaire.ville}
          </span>
        )}
      </h2>

      {partenaire.description && (
        <p className="mt-5 text-sm leading-relaxed text-nuit/70">{partenaire.description}</p>
      )}

      {partenaire.prestations && (
        <ul className="mt-4 space-y-1.5">
          {partenaire.prestations.map((prestation) => (
            <li key={prestation} className="flex items-baseline gap-3 text-sm text-nuit/70">
              <span
                className="h-px w-3 shrink-0 translate-y-[-3px] bg-ocre"
                aria-hidden="true"
              />
              {prestation}
            </li>
          ))}
        </ul>
      )}

      {/* Bloc de contact poussé en bas : les fiches n'ont pas la même longueur
          de texte, leurs coordonnées s'alignent malgré tout. */}
      <div className="mt-auto pt-8">
        <div className="space-y-2.5">
          {partenaire.adresse && (
            <p className="flex items-baseline gap-3 text-sm text-nuit/70">
              <IconeEpingle className="shrink-0 translate-y-0.5 text-base text-ocre" />
              {partenaire.adresse}
            </p>
          )}

          {partenaire.telephone && (
            <p className="flex items-baseline gap-3 text-sm text-nuit/70">
              <IconeTelephone className="shrink-0 translate-y-0.5 text-base text-ocre" />
              <span>
                {partenaire.libelleTelephone && `${partenaire.libelleTelephone} `}
                <a
                  href={`tel:${partenaire.telephone}`}
                  className="text-nuit underline decoration-sable underline-offset-4 transition-colors duration-300 hover:text-ocre"
                >
                  {partenaire.telephoneAffiche}
                </a>
              </span>
            </p>
          )}
        </div>

        {partenaire.site && (
          <a
            href={partenaire.site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-principal mt-7 !px-6 !py-3 !text-xs"
          >
            {partenaire.site.libelle} <IconeFleche />
          </a>
        )}
      </div>
    </article>
  )
}
