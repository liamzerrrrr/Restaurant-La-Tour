import { TitreSection } from './TitreSection'
import { useReveal } from '../hooks/useReveal'

const piliers = [
  {
    titre: 'Le fait maison, vraiment',
    texte:
      'Ce n’est pas un argument, c’est une contrainte que nous assumons : nos desserts se commandent en même temps que le plat, parce qu’ils se montent à la minute.',
  },
  {
    titre: 'Le pays dans l’assiette',
    texte:
      'Chèvre de Combebelle, taureau de Camargue, thon rouge de Méditerranée, fraises de région : la carte puise dans ce qui pousse, s’élève et se pêche autour de nous.',
  },
  {
    titre: 'Le rythme des saisons',
    texte:
      'La carte se réécrit au fil de l’année. Et « le retour du chef » change selon son humeur et l’arrivage — viande de race ou de chasse, à demander en salle.',
  },
]

export function Concept() {
  const image = useReveal()
  const encart = useReveal({ delai: 120 })

  return (
    <section id="concept" className="bg-creme py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Colonne visuelle : image principale + vignette en débord */}
          <div ref={image.ref} className={`${image.className} relative`}>
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/images/salle.jpg"
                alt="La salle du restaurant, fauteuils de velours terracotta et tables dressées"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
              />
            </div>

            <div className="absolute -right-4 -bottom-10 hidden w-44 overflow-hidden border-8 border-creme sm:block lg:w-56">
              <img
                src="/images/terrasse.jpg"
                alt="Table dressée en terrasse, olives et lumière filtrée par la treille"
                loading="lazy"
                className="aspect-square h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Colonne texte */}
          <div>
            <TitreSection
              surtitre="La maison"
              titre="Une table au bord d’un paysage rare"
              chapo="L’étang de Montady est un cercle parfait dessiné au XIIIᵉ siècle, ses parcelles rayonnant vers un point unique. On le regarde depuis la terrasse comme on regarde un tableau — et c’est ce paysage qui donne le ton de notre cuisine."
            />

            <div ref={encart.ref} className={`${encart.className} mt-10 space-y-8`}>
              <p className="leading-relaxed text-nuit/75">
                Tony Mattu, chef et maître des lieux, conduit la brigade aux côtés de Stéphane
                Galinier. Une cuisine gastronomique qui respecte ses bases classiques, ose ce qu’il
                faut — un berlingot de betterave, un thon rouge fumé minute, un homard bleu à la
                crème iodée — et ne met jamais rien d’inutile dans l’assiette.
              </p>

              <p className="border-l border-or py-1 pl-6 font-display text-2xl leading-snug text-nuit italic">
                Des saveurs authentiques et raffinées, à partir de produits locaux et de saison.
              </p>
            </div>
          </div>
        </div>

        {/* Les trois piliers */}
        <div className="mt-24 grid gap-px border border-sable bg-sable sm:mt-28 sm:grid-cols-3">
          {piliers.map((pilier, i) => (
            <Pilier key={pilier.titre} pilier={pilier} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Pilier({ pilier, index }) {
  const reveal = useReveal({ delai: index * 120 })

  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={`${reveal.className} group bg-creme p-9 transition-colors duration-500 hover:bg-creme-fonce sm:p-10`}
    >
      <span className="font-display text-3xl text-or transition-colors duration-500 group-hover:text-ocre">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-5 font-display text-2xl text-nuit">{pilier.titre}</h3>
      <p className="mt-4 text-sm leading-relaxed text-nuit/70">{pilier.texte}</p>
    </div>
  )
}
