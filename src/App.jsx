import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Concept } from './components/Concept'
import { Carte } from './components/Carte'
import { Galerie } from './components/Galerie'
import { Reservation } from './components/Reservation'
import { Footer } from './components/Footer'
import { BarreMobile } from './components/BarreMobile'

/**
 * Landing page en une seule vue. L'ordre des sections suit le parcours d'un
 * client : on le séduit (Hero), on le rassure (Concept), on lui donne envie
 * (Carte, Galerie), puis on lui rend la réservation évidente (Reservation).
 */
export default function App() {
  return (
    <>
      <Nav />
      <main id="contenu">
        <Hero />
        <Concept />
        <Carte />
        <Galerie />
        <Reservation />
      </main>
      <Footer />
      <BarreMobile />
    </>
  )
}
