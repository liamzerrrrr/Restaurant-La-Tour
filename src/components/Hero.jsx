import { infos } from '../data/infos'
import { IconeTelephone } from './Icones'

/**
 * Première impression du site : image plein écran, accroche, appel à l'action.
 *
 * Pour passer en fond vidéo, remplacer la balise <img> par :
 *   <video autoPlay muted loop playsInline poster="/images/hero.jpg"
 *          className="h-full w-full object-cover">
 *     <source src="/images/hero.mp4" type="video/mp4" />
 *   </video>
 * (garder le poster : il s'affiche pendant le chargement et sur mobile en
 * mode économie de données).
 */
export function Hero() {
  return (
    <section id="accueil" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Visuel de fond */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="La salle du restaurant La Tour ouverte sur le panorama de l'étang de Montady"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        {/* Double voile : lisibilité du texte en bas à gauche, sans écraser l'image */}
        <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/45 to-nuit/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-nuit/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-28 sm:px-8 sm:pb-32">
        <div className="max-w-2xl">
          <p
            className="surtitre text-or"
            style={{ animation: 'apparition 1s cubic-bezier(0.16,1,0.3,1) 0.2s both' }}
          >
            Montady · Occitanie
          </p>

          <h1
            className="mt-6 font-display text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.95] text-creme"
            style={{ animation: 'apparition 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s both' }}
          >
            Une cuisine de la main,
            <span className="block italic font-light text-or">une vue sans pareille.</span>
          </h1>

          <p
            className="mt-7 max-w-xl text-base leading-relaxed text-creme/85 sm:text-lg"
            style={{ animation: 'apparition 1.1s cubic-bezier(0.16,1,0.3,1) 0.55s both' }}
          >
            Au pied de la tour sarrasine, face au grand cercle de l’étang asséché, nous servons une
            cuisine 100 % faite maison — produits frais, locaux, cueillis au rythme des saisons.
          </p>

          <div
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            style={{ animation: 'apparition 1.1s cubic-bezier(0.16,1,0.3,1) 0.75s both' }}
          >
            <a href="#reservation" className="btn-principal">
              Réserver une table
            </a>
            <a
              href={`tel:${infos.telephone}`}
              className="btn-contour text-creme"
              aria-label={`Appeler le restaurant au ${infos.telephoneAffiche}`}
            >
              <IconeTelephone /> {infos.telephoneAffiche}
            </a>
          </div>
        </div>
      </div>

      {/* Invitation discrète à défiler */}
      <a
        href="#concept"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-creme/60 transition-colors duration-300 hover:text-creme sm:flex"
        aria-label="Découvrir la maison"
      >
        <span className="surtitre text-[0.5625rem]">Découvrir</span>
        <span className="relative block h-12 w-px overflow-hidden bg-creme/25">
          <span
            className="absolute inset-x-0 top-0 block h-5 bg-or"
            style={{ animation: 'glisse 2.4s cubic-bezier(0.16,1,0.3,1) infinite' }}
          />
        </span>
      </a>

      <style>{`
        @keyframes apparition {
          from { opacity: 0; transform: translateY(26px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes glisse {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes apparition { from { opacity: 1; transform: none; } to { opacity: 1; transform: none; } }
          @keyframes glisse { from { transform: none; } to { transform: none; } }
        }
      `}</style>
    </section>
  )
}
