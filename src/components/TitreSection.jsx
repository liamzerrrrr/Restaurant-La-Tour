import { useReveal } from '../hooks/useReveal'

/**
 * En-tête de section commun : sur-titre, filet doré, titre serif, chapô.
 * Centralisé pour que toutes les sections respirent exactement pareil.
 */
export function TitreSection({ surtitre, titre, chapo, clair = false, centre = false }) {
  const reveal = useReveal()

  return (
    <div
      ref={reveal.ref}
      className={`${reveal.className} ${centre ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}
    >
      <p className={`surtitre ${clair ? 'text-or' : 'text-ocre'}`}>{surtitre}</p>

      <span className={`filet-or mt-5 ${centre ? 'mx-auto' : ''}`} />

      <h2
        className={`mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] ${
          clair ? 'text-creme' : 'text-nuit'
        }`}
      >
        {titre}
      </h2>

      {chapo && (
        <p
          className={`mt-5 text-base leading-relaxed sm:text-lg ${
            clair ? 'text-creme/75' : 'text-nuit/70'
          }`}
        >
          {chapo}
        </p>
      )}
    </div>
  )
}
