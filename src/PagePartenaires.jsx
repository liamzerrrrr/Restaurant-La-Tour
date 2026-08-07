import { Nav } from './components/Nav'
import { Partenaires } from './components/Partenaires'
import { Footer } from './components/Footer'
import { BarreMobile } from './components/BarreMobile'

/**
 * Page « Partenaires ». Elle réutilise la navigation, le pied de page et la
 * barre mobile de l'accueil ; seul le contenu change. La navigation passe en
 * mode « hors accueil » : ses liens repartent vers la page d'accueil et la
 * barre reste opaque, faute de hero derrière elle.
 */
export default function PagePartenaires() {
  return (
    <>
      <Nav accueil={false} />
      <Partenaires />
      <Footer />
      <BarreMobile toujoursVisible />
    </>
  )
}
