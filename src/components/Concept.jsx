import { TitreSection } from './TitreSection'
import { useReveal } from '../hooks/useReveal'

const piliers = [
  {
    titre: 'Tout est fait ici',
    texte:
      'Fonds, pâtes, glaces, pains : rien n’arrive tout prêt en cuisine. Chaque assiette part de produits bruts, travaillés le jour même.',
  },
  {
    titre: 'Le pays dans l’assiette',
    texte:
      'Maraîchers du Biterrois, pêche de l’étang de Thau, agneau des garrigues, vins de Faugères et Saint-Chinian : nos fournisseurs sont nos voisins.',
  },
  {
    titre: 'Le rythme des saisons',
    texte:
      'La carte se réécrit au fil du marché. Ce qui est bon maintenant remplace ce qui l’était le mois dernier — sans exception.',
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
                alt="La salle du restaurant, tables dressées face aux baies vitrées"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
              />
            </div>

            <div className="absolute -right-4 -bottom-10 hidden w-44 overflow-hidden border-8 border-creme sm:block lg:w-56">
              <img
                src="/images/terrasse.jpg"
                alt="La terrasse ombragée surplombant l'étang de Montady"
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
              chapo="L’étang de Montady est un cercle parfait dessiné au XIIIᵉ siècle, ses parcelles rayonnant vers un point unique. On le regarde depuis notre terrasse comme on regarde un tableau — et c’est ce paysage qui donne le ton de notre cuisine."
            />

            <div ref={encart.ref} className={`${encart.className} mt-10 space-y-8`}>
              <p className="leading-relaxed text-nuit/75">
                Tony Mattu, chef et maître des lieux, conduit la brigade aux côtés de Stéphane
                Galinier. Deux passionnés qui ont fait le choix d’une cuisine bistronomique
                sincère : des bases classiques respectées, une pointe d’audace, et jamais rien
                d’inutile dans l’assiette.
              </p>

              <blockquote className="border-l border-or py-1 pl-6">
                <p className="font-display text-2xl leading-snug text-nuit italic">
                  « On ne cherche pas à impressionner. On cherche à ce que les gens reviennent. »
                </p>
                <cite className="surtitre mt-4 block text-ocre not-italic">
                  Tony Mattu — Chef
                </cite>
              </blockquote>
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
