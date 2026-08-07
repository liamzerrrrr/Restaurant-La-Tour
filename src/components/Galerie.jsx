import { TitreSection } from './TitreSection'
import { useReveal } from '../hooks/useReveal'

/**
 * Grille asymétrique : deux grands formats portent la section, trois vignettes
 * complètent le rythme. Sur mobile, tout se réaligne en une colonne.
 */
const visuels = [
  {
    src: '/images/galerie-1.jpg',
    alt: 'La picanha de veau en vitello tonnato, sablé parmesan, copeaux de fromage et pensée',
    classe: 'sm:col-span-2 sm:row-span-2 aspect-[4/5] sm:aspect-auto',
  },
  {
    src: '/images/galerie-2.jpg',
    alt: 'Dos de poisson rôti sur peau, crumble d’herbes et jus de coquillages',
    classe: 'sm:col-span-2 aspect-[4/3]',
  },
  {
    src: '/images/galerie-3.jpg',
    alt: 'Flambée en cuisine : poêlée saisie à la flamme au-dessus du feu',
    classe: 'aspect-square',
  },
  {
    src: '/images/galerie-4.jpg',
    alt: 'Entrée dressée à l’assiette, quenelle, fleurs comestibles et condiments',
    classe: 'aspect-square',
  },
]

export function Galerie() {
  return (
    <section id="galerie" className="bg-creme-fonce py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <TitreSection
          centre
          surtitre="En images"
          titre="Le décor, l’assiette, la lumière"
          chapo="Quelques instants pris en salle, en terrasse et en cuisine."
        />

        <div className="mt-16 grid grid-cols-1 gap-3 sm:mt-20 sm:grid-cols-4 sm:gap-4">
          {visuels.map((visuel, i) => (
            <Visuel key={visuel.src} visuel={visuel} index={i} />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-nuit/60">
          D’autres photos, et les suggestions du jour, sur notre{' '}
          <a
            href="https://www.instagram.com/restaurant_latourmontady/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ocre underline decoration-or/50 underline-offset-4 transition-colors duration-300 hover:text-nuit"
          >
            compte Instagram
          </a>
          .
        </p>
      </div>
    </section>
  )
}

function Visuel({ visuel, index }) {
  const reveal = useReveal({ delai: index * 100 })

  return (
    <figure
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} ${visuel.classe} group relative overflow-hidden`}
    >
      <img
        src={visuel.src}
        alt={visuel.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-nuit/0 transition-colors duration-700 group-hover:bg-nuit/15" />
    </figure>
  )
}
