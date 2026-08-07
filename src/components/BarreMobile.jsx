import { IconeTelephone } from './Icones'
import { useDefilement } from '../hooks/useReveal'
import { infos } from '../data/infos'

/**
 * Barre d'action fixe en bas d'écran, sur mobile uniquement.
 * La majorité des réservations se font depuis un téléphone : appeler et
 * réserver doivent rester à portée de pouce en permanence.
 * Elle apparaît une fois le hero dépassé, pour ne pas masquer l'image d'accueil.
 */
export function BarreMobile() {
  const visible = useDefilement(560)

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-creme/10 bg-nuit/95 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <a
        href={`tel:${infos.telephone}`}
        className="flex items-center justify-center gap-2 py-4 text-xs font-medium tracking-[0.16em] text-creme uppercase"
      >
        <IconeTelephone className="text-base" /> Appeler
      </a>

      <a
        href="#reservation"
        className="flex items-center justify-center bg-ocre py-4 text-xs font-medium tracking-[0.16em] text-creme uppercase"
      >
        Réserver
      </a>
    </div>
  )
}
