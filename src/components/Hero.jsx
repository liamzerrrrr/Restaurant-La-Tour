import { useEffect, useState } from 'react'
import { infos } from '../data/infos'
import { IconeTelephone } from './Icones'

/**
 * Première impression du site : visuel plein écran, accroche, appel à l'action.
 *
 * Le fond fonctionne en deux temps :
 *   1. la photo s'affiche immédiatement, avec un très lent zoom qui donne de la
 *      vie sans rien coûter en bande passante ;
 *   2. si les fichiers vidéo existent dans public/videos/, la vidéo se charge
 *      par-dessus et prend le relais en fondu une fois prête.
 *
 * Conséquence utile : tant que les vidéos ne sont pas déposées, le hero reste
 * exactement celui d'aujourd'hui. Rien à modifier dans le code le jour où on
 * les ajoute — voir README, section « Le fond vidéo ».
 */
export function Hero() {
  const [videoPrete, setVideoPrete] = useState(false)
  const [videoAutorisee, setVideoAutorisee] = useState(false)

  useEffect(() => {
    // On ne lance la vidéo ni pour qui demande moins d'animations, ni pour qui
    // a activé l'économiseur de données sur son forfait mobile.
    const animationsReduites = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const economieDonnees = navigator.connection?.saveData === true
    setVideoAutorisee(!animationsReduites && !economieDonnees)
  }, [])

  return (
    <section id="accueil" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Visuel de fond */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="La terrasse ombragée du restaurant La Tour, tables dressées face à la plaine de Montady"
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            videoPrete ? 'opacity-0' : 'opacity-100'
          } ${videoAutorisee && !videoPrete ? 'zoom-lent' : ''}`}
          fetchPriority="high"
        />

        {videoAutorisee && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            onCanPlay={() => setVideoPrete(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              videoPrete ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src="/videos/hero.webm" type="video/webm" />
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        )}

        {/* Double voile. Le premier assoit le bas de l'image, le second crée un
            fond sombre côté gauche : le texte reste lisible sur une photo de
            plein jour, sans éteindre la partie droite du visuel. */}
        <div className="absolute inset-0 bg-gradient-to-t from-nuit via-nuit/35 to-nuit/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-nuit/90 via-nuit/45 to-transparent" />
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
            Une cuisine de saison,
            <span className="block font-light text-or italic">face aux vignes.</span>
          </h1>

          <p
            className="mt-7 max-w-xl text-base leading-relaxed text-creme/85 sm:text-lg"
            style={{ animation: 'apparition 1.1s cubic-bezier(0.16,1,0.3,1) 0.55s both' }}
          >
            Des saveurs authentiques et raffinées, composées à partir de produits locaux et de
            saison, servies en salle ou en terrasse face au grand paysage de l’étang de Montady.
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
