/**
 * Logo de la maison, redessiné en vectoriel d'après la carte du restaurant :
 * la ligne de colline surmontée de la tour, puis « La Tour » et « RESTAURANT ».
 *
 * Redessiné plutôt qu'extrait, pour rester net à toute taille et pouvoir
 * prendre la couleur du contexte (crème sur fond sombre, cuivre sur crème).
 * Si le fichier vectoriel d'origine est fourni, le remplacer est immédiat :
 * <img src="/images/logo.svg" alt="Restaurant La Tour" />
 */
export function Logo({ compact = false, className = '' }) {
  return (
    <span className={`flex flex-col items-center leading-none ${className}`}>
      <svg
        viewBox="0 0 120 30"
        aria-hidden="true"
        className={`w-auto transition-all duration-500 ${compact ? 'h-3.5' : 'h-5'}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {/* La colline, la tour à son sommet, puis la retombée vers la plaine */}
        <path d="M2 26c14-.6 26-3 35-8l7-4h4v-6h3.5V4h7v4H62v6h4l7 4c9 5 21 7.4 35 8" />
      </svg>

      <span
        className={`font-display italic tracking-wide transition-all duration-500 ${
          compact ? 'mt-1 text-xl' : 'mt-1.5 text-2xl'
        }`}
      >
        La Tour
      </span>

      <span className="surtitre mt-1 text-[0.5rem] opacity-70">Restaurant</span>
    </span>
  )
}
