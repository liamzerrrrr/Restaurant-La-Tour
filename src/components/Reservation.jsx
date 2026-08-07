import { useState } from 'react'
import { TitreSection } from './TitreSection'
import { useReveal } from '../hooks/useReveal'
import { indexJourCourant, infos } from '../data/infos'
import {
  IconeEpingle,
  IconeFleche,
  IconeHorloge,
  IconeInstagram,
  IconeTelephone,
} from './Icones'

/**
 * Endpoint de réception des demandes de réservation.
 * S'il est défini (fichier .env → VITE_RESERVATION_ENDPOINT), le formulaire y
 * envoie un POST JSON. Sinon, il bascule automatiquement sur un lien mailto
 * pré-rempli : le site reste fonctionnel sans aucun serveur.
 */
const ENDPOINT = import.meta.env.VITE_RESERVATION_ENDPOINT

// Libellés courts : ils doivent rester lisibles dans un select étroit sur mobile
const creneaux = [
  { valeur: 'midi', libelle: 'Déjeuner · 12h00' },
  { valeur: 'soir', libelle: 'Dîner · 19h15' },
]

const champVide = {
  nom: '',
  telephone: '',
  email: '',
  date: '',
  service: 'soir',
  couverts: '2',
  message: '',
}

export function Reservation() {
  const [valeurs, setValeurs] = useState(champVide)
  const [etat, setEtat] = useState('repos') // repos | envoi | succes | erreur
  const formulaire = useReveal()

  const majChamp = (e) => setValeurs((v) => ({ ...v, [e.target.name]: e.target.value }))

  const envoyer = async (e) => {
    e.preventDefault()
    setEtat('envoi')

    if (!ENDPOINT) {
      // Repli sans serveur : ouvre le client mail avec la demande pré-remplie
      window.location.href = lienMailto(valeurs)
      setEtat('succes')
      return
    }

    try {
      const reponse = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(valeurs),
      })
      if (!reponse.ok) throw new Error(`Réponse ${reponse.status}`)
      setEtat('succes')
      setValeurs(champVide)
    } catch {
      setEtat('erreur')
    }
  }

  const aujourdhui = new Date().toISOString().split('T')[0]

  return (
    <section id="reservation" className="bg-creme py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <TitreSection
          centre
          surtitre="Réserver"
          titre="Votre table vous attend"
          chapo="Le plus simple reste le téléphone — nous répondons pendant les heures de service. Vous pouvez aussi nous laisser une demande ci-dessous, nous vous confirmons dans la journée."
        />

        <div className="mt-10 flex justify-center">
          <a href={`tel:${infos.telephone}`} className="btn-principal text-base">
            <IconeTelephone /> {infos.telephoneAffiche}
          </a>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          {/* ---------- Formulaire ---------- */}
          <div ref={formulaire.ref} className={formulaire.className}>
            <h3 className="font-display text-3xl text-nuit">Demande de réservation</h3>

            {etat === 'succes' ? (
              <div className="mt-8 border border-or bg-creme-fonce p-8">
                <p className="font-display text-2xl text-nuit">Merci, c’est bien noté.</p>
                <p className="mt-3 text-sm leading-relaxed text-nuit/70">
                  {ENDPOINT
                    ? 'Nous revenons vers vous très vite pour confirmer votre table. En cas d’urgence, appelez-nous directement.'
                    : 'Votre logiciel de messagerie vient de s’ouvrir avec la demande pré-remplie : il ne reste qu’à l’envoyer.'}
                </p>
                <button
                  type="button"
                  onClick={() => setEtat('repos')}
                  className="surtitre mt-6 text-ocre underline underline-offset-4"
                >
                  Faire une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={envoyer} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Champ
                    label="Nom"
                    name="nom"
                    value={valeurs.nom}
                    onChange={majChamp}
                    required
                    autoComplete="name"
                  />
                  <Champ
                    label="Téléphone"
                    name="telephone"
                    type="tel"
                    value={valeurs.telephone}
                    onChange={majChamp}
                    required
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>

                <Champ
                  label="E-mail"
                  name="email"
                  type="email"
                  value={valeurs.email}
                  onChange={majChamp}
                  required
                  autoComplete="email"
                  inputMode="email"
                />

                <div className="grid gap-5 sm:grid-cols-3">
                  <Champ
                    label="Date"
                    name="date"
                    type="date"
                    value={valeurs.date}
                    onChange={majChamp}
                    required
                    min={aujourdhui}
                  />

                  <Champ label="Service" name="service" as="select" value={valeurs.service} onChange={majChamp}>
                    {creneaux.map((c) => (
                      <option key={c.valeur} value={c.valeur}>
                        {c.libelle}
                      </option>
                    ))}
                  </Champ>

                  <Champ
                    label="Couverts"
                    name="couverts"
                    as="select"
                    value={valeurs.couverts}
                    onChange={majChamp}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>
                        {n} {n > 1 ? 'personnes' : 'personne'}
                      </option>
                    ))}
                    <option value="13+">Plus de 12 — nous appeler</option>
                  </Champ>
                </div>

                <Champ
                  label="Allergies, occasion particulière, demande…"
                  name="message"
                  as="textarea"
                  value={valeurs.message}
                  onChange={majChamp}
                  optionnel
                />

                {etat === 'erreur' && (
                  <p role="alert" className="text-sm text-ocre">
                    L’envoi n’a pas abouti. Merci de nous appeler au {infos.telephoneAffiche}.
                  </p>
                )}

                <button type="submit" disabled={etat === 'envoi'} className="btn-principal w-full disabled:opacity-60">
                  {etat === 'envoi' ? 'Envoi en cours…' : 'Envoyer la demande'}
                  {etat !== 'envoi' && <IconeFleche />}
                </button>

                <p className="text-xs leading-relaxed text-nuit/50">
                  Une demande n’est pas une confirmation : votre table est réservée dès que nous
                  vous avons répondu. Vos coordonnées servent uniquement à traiter cette demande.
                </p>
              </form>
            )}
          </div>

          {/* ---------- Infos pratiques ---------- */}
          <InfosPratiques />
        </div>

        <CarteLocalisation />
      </div>
    </section>
  )
}

function InfosPratiques() {
  const reveal = useReveal({ delai: 140 })
  const jour = indexJourCourant()

  return (
    <div ref={reveal.ref} style={reveal.style} className={`${reveal.className} space-y-10`}>
      {/* Horaires */}
      <div>
        <h3 className="flex items-center gap-3 font-display text-3xl text-nuit">
          <IconeHorloge className="text-2xl text-ocre" /> Horaires
        </h3>

        <ul className="mt-6 divide-y divide-sable border-y border-sable">
          {infos.horaires.map((ligne, i) => {
            const ferme = !ligne.midi && !ligne.soir
            const cJour = i === jour
            return (
              <li
                key={ligne.jour}
                className={`flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 ${
                  cJour ? 'bg-creme-fonce/60 px-3 -mx-3' : ''
                }`}
              >
                <span
                  className={`text-sm ${cJour ? 'font-medium text-nuit' : 'text-nuit/75'}`}
                >
                  {ligne.jour}
                  {cJour && <span className="surtitre ml-2 text-ocre">Aujourd’hui</span>}
                </span>

                <span className={`text-sm tabular-nums ${ferme ? 'text-nuit/40 italic' : 'text-nuit/75'}`}>
                  {ferme ? 'Fermé' : [ligne.midi, ligne.soir].filter(Boolean).join('  ·  ')}
                </span>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-nuit/50">{infos.noteHoraires}</p>
      </div>

      {/* Adresse & contact */}
      <div>
        <h3 className="flex items-center gap-3 font-display text-3xl text-nuit">
          <IconeEpingle className="text-2xl text-ocre" /> Nous trouver
        </h3>

        <address className="mt-6 space-y-1 text-sm leading-relaxed text-nuit/75 not-italic">
          <p>{infos.adresse.rue}</p>
          <p>
            {infos.adresse.codePostal} {infos.adresse.ville}
          </p>
        </address>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={infos.liens.itineraire}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contour !px-6 !py-3 text-nuit hover:!bg-nuit hover:!text-creme"
          >
            Itinéraire <IconeFleche />
          </a>
          <a
            href={infos.liens.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-contour !px-6 !py-3 text-nuit hover:!bg-nuit hover:!text-creme"
          >
            <IconeInstagram /> Instagram
          </a>
        </div>
      </div>
    </div>
  )
}

/** Carte interactive, chargée en différé pour ne pas ralentir la page. */
function CarteLocalisation() {
  const reveal = useReveal()
  const [chargee, setChargee] = useState(false)
  const { lat, lng } = infos.coordonnees
  const delta = 0.006
  const bbox = `${lng - delta}%2C${lat - delta / 2}%2C${lng + delta}%2C${lat + delta / 2}`

  return (
    <div
      ref={reveal.ref}
      className={`${reveal.className} mt-20 border border-sable bg-creme-fonce`}
    >
      {chargee ? (
        <iframe
          title="Carte de localisation du restaurant La Tour à Montady"
          className="block h-[380px] w-full sm:h-[440px]"
          style={{ filter: 'grayscale(0.35) sepia(0.12) contrast(1.05)' }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`}
        />
      ) : (
        /* La carte ne se charge qu'à la demande : aucun appel à un service
           tiers tant que le visiteur ne l'a pas décidé, et l'adresse reste
           lisible même derrière un bloqueur ou hors connexion. */
        <div className="flex h-[380px] flex-col items-center justify-center gap-5 px-6 text-center sm:h-[440px]">
          <IconeEpingle className="text-3xl text-ocre" />

          <p className="text-sm leading-relaxed text-nuit/70">
            {infos.adresse.rue}
            <br />
            {infos.adresse.codePostal} {infos.adresse.ville}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setChargee(true)}
              className="btn-contour !px-6 !py-3 text-nuit hover:!bg-nuit hover:!text-creme"
            >
              Afficher la carte
            </button>
            <a
              href={infos.liens.itineraire}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-principal !px-6 !py-3"
            >
              Itinéraire <IconeFleche />
            </a>
          </div>

          <p className="mt-1 text-xs text-nuit/45">Carte fournie par OpenStreetMap.</p>
        </div>
      )}
    </div>
  )
}

/** Champ de formulaire unifié : input, select ou textarea selon `as`. */
function Champ({ label, name, as = 'input', optionnel = false, children, ...props }) {
  const styleCommun =
    'w-full border border-sable bg-white/60 px-4 py-3 text-sm text-nuit transition-colors duration-300 placeholder:text-nuit/35 hover:border-ocre/50 focus:border-ocre focus:bg-white focus:outline-none'

  return (
    <label className="block">
      <span className="surtitre mb-2 block text-nuit/55">
        {label}
        {optionnel && <span className="ml-2 normal-case tracking-normal opacity-70">(facultatif)</span>}
      </span>

      {as === 'textarea' ? (
        <textarea name={name} rows={4} className={`${styleCommun} resize-none`} {...props} />
      ) : as === 'select' ? (
        // Le chevron natif est supprimé pour rester homogène ; on le redessine
        // en fond, sinon plus rien n'indique que le champ est déroulant.
        <select
          name={name}
          className={`${styleCommun} appearance-none bg-no-repeat pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%23b5793f' stroke-width='1.5'%3E%3Cpath d='M1 1.5 6 6.5l5-5'/%3E%3C/svg%3E\")",
            backgroundPosition: 'right 1rem center',
          }}
          {...props}
        >
          {children}
        </select>
      ) : (
        <input name={name} className={styleCommun} {...props} />
      )}
    </label>
  )
}

/** Construit le lien mailto de repli quand aucun endpoint n'est configuré. */
function lienMailto(v) {
  const service = creneaux.find((c) => c.valeur === v.service)?.libelle ?? v.service
  const corps = [
    `Nom : ${v.nom}`,
    `Téléphone : ${v.telephone}`,
    `E-mail : ${v.email}`,
    `Date : ${v.date}`,
    `Service : ${service}`,
    `Couverts : ${v.couverts}`,
    '',
    v.message || '(aucune précision)',
  ].join('\n')

  return `mailto:${infos.email}?subject=${encodeURIComponent(
    `Demande de réservation — ${v.nom} — ${v.date}`,
  )}&body=${encodeURIComponent(corps)}`
}
