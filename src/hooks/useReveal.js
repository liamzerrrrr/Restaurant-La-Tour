import { useEffect, useRef, useState } from 'react'

/**
 * Révèle un élément lorsqu'il entre dans le champ de vision.
 * Retourne une ref à poser sur l'élément et les classes à lui appliquer.
 *
 * L'observateur se déconnecte après la première apparition : l'élément ne
 * disparaît jamais au défilement inverse, ce qui serait fatigant à la lecture.
 *
 * @param {{ delai?: number, seuil?: number }} options délai en ms, seuil 0→1
 */
export function useReveal({ delai = 0, seuil = 0.15 } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Sans IntersectionObserver (navigateurs anciens), on affiche directement.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observateur = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setVisible(true)
          observateur.disconnect()
        }
      },
      { threshold: seuil, rootMargin: '0px 0px -60px 0px' },
    )

    observateur.observe(element)
    return () => observateur.disconnect()
  }, [seuil])

  return {
    ref,
    className: visible ? 'reveal reveal-visible' : 'reveal',
    style: delai ? { transitionDelay: `${delai}ms` } : undefined,
  }
}

/**
 * Renvoie true dès que la page a défilé au-delà du seuil indiqué.
 * Utilisé pour faire passer la barre de navigation en mode « compact ».
 */
export function useDefilement(seuil = 40) {
  const [depasse, setDepasse] = useState(false)

  useEffect(() => {
    const surDefilement = () => setDepasse(window.scrollY > seuil)
    surDefilement()
    window.addEventListener('scroll', surDefilement, { passive: true })
    return () => window.removeEventListener('scroll', surDefilement)
  }, [seuil])

  return depasse
}

/**
 * Surligne dans la navigation la section actuellement à l'écran.
 * @param {string[]} ids identifiants des sections, dans l'ordre de la page
 */
export function useSectionActive(ids) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observateur = new IntersectionObserver(
      (entrees) => {
        const visibles = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visibles[0]) setActive(visibles[0].target.id)
      },
      // La bande centrale de l'écran décide de la section « courante »
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((element) => observateur.observe(element))

    return () => observateur.disconnect()
  }, [ids])

  return active
}
