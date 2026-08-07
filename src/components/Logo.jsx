/**
 * Logo provisoire : tour sarrasine stylisée + typographie de la maison.
 *
 * La capture d'écran de l'ancien site n'ayant pas été fournie, le logo
 * d'origine n'a pas pu être repris. Ce dessin vectoriel tient lieu de
 * placeholder cohérent avec la charte. Pour brancher le vrai logo, remplacer
 * le <svg> par une balise <img src="/images/logo.svg" alt="Restaurant La Tour" />.
 */
export function Logo({ compact = false, className = '' }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 40 48"
        aria-hidden="true"
        className={compact ? 'h-8 w-auto' : 'h-10 w-auto'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="square"
      >
        {/* Créneaux */}
        <path d="M11 12h3v-4h3v4h3v-4h3v4h3" />
        {/* Corps de la tour */}
        <path d="M11 12v28M29 12v28" />
        {/* Ouvertures */}
        <path d="M17 20h6M17 27h6" />
        {/* Porte en plein cintre */}
        <path d="M16 40v-6a4 4 0 0 1 8 0v6" />
        {/* Sol */}
        <path d="M4 40h32" />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl tracking-[0.18em] uppercase">La Tour</span>
        <span className="surtitre mt-1 text-[0.5rem] opacity-70">Montady</span>
      </span>
    </span>
  )
}
