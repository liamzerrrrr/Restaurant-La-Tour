import { Logo } from './Logo'
import { IconeFacebook, IconeInstagram, IconeTikTok } from './Icones'
import { infos } from '../data/infos'

export function Footer() {
  const reseaux = [
    { url: infos.liens.instagram, Icone: IconeInstagram, nom: 'Instagram' },
    { url: infos.liens.facebook, Icone: IconeFacebook, nom: 'Facebook' },
    { url: infos.liens.tiktok, Icone: IconeTikTok, nom: 'TikTok' },
  ].filter((r) => r.url)

  return (
    <footer className="border-t border-creme/10 bg-nuit pt-16 pb-28 text-creme sm:pb-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-10 text-center">
          <Logo />

          <p className="max-w-md text-sm leading-relaxed text-creme/55">
            Une cuisine de saison face aux vignes. Des saveurs authentiques et raffinées, à partir
            de produits locaux, servies en salle ou en terrasse.
          </p>

          <div className="flex gap-4">
            {reseaux.map(({ url, Icone, nom }) => (
              <a
                key={nom}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Suivre le restaurant sur ${nom}`}
                className="flex h-11 w-11 items-center justify-center border border-creme/20 text-lg text-creme/70 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-or hover:text-or"
              >
                <Icone />
              </a>
            ))}
          </div>

          <address className="space-y-1 text-sm text-creme/55 not-italic">
            <p>
              {infos.adresse.rue} · {infos.adresse.codePostal} {infos.adresse.ville}
            </p>
            <p>
              <a
                href={`tel:${infos.telephone}`}
                className="transition-colors duration-300 hover:text-or"
              >
                {infos.telephoneAffiche}
              </a>
            </p>
          </address>
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 border-t border-creme/10 pt-8 text-xs text-creme/35 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {infos.nomComplet}. Tous droits réservés.
          </p>
          <p>Mentions légales · Politique de confidentialité</p>
        </div>
      </div>
    </footer>
  )
}
