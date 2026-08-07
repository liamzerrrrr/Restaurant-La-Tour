import { useEffect, useState } from 'react'
import { Logo } from './Logo'
import { IconeCroix, IconeMenu, IconeTelephone } from './Icones'
import { useDefilement, useSectionActive } from '../hooks/useReveal'
import { infos } from '../data/infos'

/** Sections de la page d'accueil, dans l'ordre de lecture. */
const liens = [
  { id: 'concept', libelle: 'La Maison' },
  { id: 'carte', libelle: 'La Carte' },
  { id: 'galerie', libelle: 'Galerie' },
  { id: 'reservation', libelle: 'Nous trouver' },
]

/** Pages à part entière, atteignables depuis n'importe où. */
const pages = [{ href: '/partenaires/', libelle: 'Partenaires' }]

const idsSections = ['accueil', ...liens.map((l) => l.id)]
const aucuneSection = []

/**
 * @param {{ accueil?: boolean }} props `accueil` à false sur les autres pages :
 *   les ancres repartent vers l'accueil et la barre reste opaque, faute de
 *   hero derrière elle.
 */
export function Nav({ accueil = true }) {
  const defile = useDefilement(40)
  const sectionActive = useSectionActive(accueil ? idsSections : aucuneSection)
  const [menuOuvert, setMenuOuvert] = useState(false)

  const compact = defile || !accueil
  const base = accueil ? '' : '/'

  // Bloque le défilement de la page derrière le menu plein écran
  useEffect(() => {
    document.body.style.overflow = menuOuvert ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOuvert])

  // La touche Échap referme le menu : réflexe attendu au clavier
  useEffect(() => {
    if (!menuOuvert) return
    const surTouche = (e) => e.key === 'Escape' && setMenuOuvert(false)
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [menuOuvert])

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-nuit focus:px-4 focus:py-2 focus:text-creme"
      >
        Aller au contenu
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          compact
            ? 'bg-nuit/95 py-3 shadow-[0_1px_0_0_rgba(213,171,147,0.18)] backdrop-blur-md'
            : 'bg-gradient-to-b from-nuit/70 to-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
          <a
            href={accueil ? '#accueil' : '/'}
            className="text-creme transition-opacity duration-300 hover:opacity-80"
            aria-label="Restaurant La Tour, retour à l’accueil"
          >
            <Logo compact={compact} />
          </a>

          {/* Navigation bureau. Six liens, le téléphone et le bouton ne tiennent
              pas sur une ligne en dessous de 1280 px : en deçà, on garde le
              menu plein écran plutôt que de laisser les libellés se couper. */}
          <nav className="hidden items-center gap-7 xl:flex" aria-label="Navigation principale">
            {liens.map((lien) => (
              <a
                key={lien.id}
                href={`${base}#${lien.id}`}
                className="lien-nav whitespace-nowrap text-creme/85 hover:text-creme"
                aria-current={accueil && sectionActive === lien.id ? 'true' : undefined}
              >
                {lien.libelle}
              </a>
            ))}

            {pages.map((page) => (
              <a
                key={page.href}
                href={page.href}
                className="lien-nav whitespace-nowrap text-creme/85 hover:text-creme"
                aria-current={!accueil ? 'true' : undefined}
              >
                {page.libelle}
              </a>
            ))}

            <a
              href={`tel:${infos.telephone}`}
              className="lien-nav flex items-center gap-2 whitespace-nowrap text-creme/85 hover:text-creme"
            >
              <IconeTelephone className="text-base" />
              {infos.telephoneAffiche}
            </a>

            <a href={`${base}#reservation`} className="btn-principal !px-6 !py-3">
              Réserver
            </a>
          </nav>

          {/* Déclencheur mobile */}
          <button
            type="button"
            onClick={() => setMenuOuvert(true)}
            className="flex items-center gap-2 p-2 text-creme xl:hidden"
            aria-label="Ouvrir le menu de navigation"
            aria-expanded={menuOuvert}
          >
            <IconeMenu className="text-2xl" />
          </button>
        </div>
      </header>

      {/* Menu plein écran mobile */}
      <div
        className={`fixed inset-0 z-[55] bg-nuit transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden ${
          menuOuvert ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        aria-hidden={!menuOuvert}
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex items-center justify-between">
            <span className="text-creme">
              <Logo compact />
            </span>
            <button
              type="button"
              onClick={() => setMenuOuvert(false)}
              className="p-2 text-creme"
              aria-label="Fermer le menu"
            >
              <IconeCroix className="text-2xl" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1" aria-label="Navigation mobile">
            {[
              ...liens.map((lien) => ({ href: `${base}#${lien.id}`, libelle: lien.libelle })),
              ...pages,
            ].map((lien, i) => (
              <a
                key={lien.href}
                href={lien.href}
                onClick={() => setMenuOuvert(false)}
                className="font-display text-4xl text-creme transition-colors duration-300 hover:text-or"
                style={{
                  transitionDelay: menuOuvert ? `${120 + i * 60}ms` : '0ms',
                  opacity: menuOuvert ? 1 : 0,
                  transform: menuOuvert ? 'none' : 'translateY(12px)',
                  transitionProperty: 'opacity, transform, color',
                  transitionDuration: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {lien.libelle}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pb-4">
            <a href={`tel:${infos.telephone}`} className="btn-contour w-full text-creme">
              <IconeTelephone /> {infos.telephoneAffiche}
            </a>
            <a
              href={`${base}#reservation`}
              onClick={() => setMenuOuvert(false)}
              className="btn-principal w-full"
            >
              Réserver une table
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
