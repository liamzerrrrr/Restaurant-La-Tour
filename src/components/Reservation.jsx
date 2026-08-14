import { useEffect, useState } from 'react'
import { TitreSection } from './TitreSection'
import { PlanSalle } from './PlanSalle'
import { useReveal } from '../hooks/useReveal'
import { indexJourCourant, infos } from '../data/infos'
import { trouverTable, zones } from '../data/salle'
import { tablesOccupees } from '../data/disponibilites'
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
  table: '',
  message: '',
}

export function Reservation() {
  const [valeurs, setValeurs] = useState(champVide)
  const [etat, setEtat] = useState('repos') // repos | envoi | succes | erreur
  const [occupees, setOccupees] = useState(() => new Set())
  const [chargementPlan, setChargementPlan] = useState(false)
  const [zoneActive, setZoneActive] = useState(zones[0].id)
  const formulaire = useReveal()

  const majChamp = (e) => setValeurs((v) => ({ ...v, [e.target.name]: e.target.value }))

  // « 13+ » n'est pas un nombre : au-delà de douze couverts, on renvoie au
  // téléphone plutôt que de laisser choisir une table qui ne suffira pas.
  const nombreCouverts = Number(valeurs.couverts)
  const grandeTablee = !Number.isFinite(nombreCouverts)

  // Disponibilités du jour et du service choisis
  useEffect(() => {
    if (!valeurs.date) {
      setOccupees(new Set())
      return undefined
    }

    let annule = false
    setChargementPlan(true)

    tablesOccupees(valeurs.date, valeurs.service).then((resultat) => {
      if (annule) return
      setOccupees(resultat)
      setChargementPlan(false)
    })

    return () => {
      annule = true
    }
  }, [valeurs.date, valeurs.service])

  // Une table choisie peut cesser d'être valable si l'on change de date, de
  // service ou de nombre de couverts : on la libère plutôt que de laisser
  // partir une demande incohérente.
  useEffect(() => {
    if (!valeurs.table) return

    const table = trouverTable(valeurs.table)
    const invalide =
      !table || occupees.has(valeurs.table) || grandeTablee || table.couverts < nombreCouverts

    if (invalide) setValeurs((v) => ({ ...v, table: '' }))
  }, [occupees, nombreCouverts, grandeTablee, valeurs.table])

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

        {/* Le plan de salle a besoin de largeur : la colonne du formulaire
            prend nettement le pas sur celle des informations pratiques. */}
        <div className="mt-20 grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-16">
          {/* ---------- Formulaire ---------- */}
          {/* `min-w-0` est indispensable : sans lui, la largeur minimale du
              plan de salle élargit sa colonne et fait déborder toute la page
              horizontalement sur mobile. */}
          <div ref={formulaire.ref} className={`${formulaire.className} min-w-0`}>
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
              <form onSubmit={envoyer} className="mt-8 space-y-11">
                {/* ---------- 1. Quand ? ---------- */}
                <fieldset>
                  <legend className="surtitre text-ocre">1 — Quand ?</legend>

                  <div className="mt-6 grid gap-5 sm:grid-cols-3">
                    <Champ
                      label="Date"
                      name="date"
                      type="date"
                      value={valeurs.date}
                      onChange={majChamp}
                      required
                      min={aujourdhui}
                    />

                    <Champ
                      label="Service"
                      name="service"
                      as="select"
                      value={valeurs.service}
                      onChange={majChamp}
                    >
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
                </fieldset>

                {/* ---------- 2. Où ? ---------- */}
                <fieldset>
                  <legend className="surtitre text-ocre">2 — Où ?</legend>

                  <p className="mt-3 text-sm leading-relaxed text-nuit/60">
                    Choisissez votre table sur le plan, ou laissez-nous vous placer au mieux.
                  </p>

                  <ZoneDeChoix
                    date={valeurs.date}
                    grandeTablee={grandeTablee}
                    chargement={chargementPlan}
                    zoneActive={zoneActive}
                    surChangementZone={setZoneActive}
                    occupees={occupees}
                    couverts={nombreCouverts}
                    selection={valeurs.table}
                    surSelection={(id) =>
                      setValeurs((v) => ({ ...v, table: v.table === id ? '' : id }))
                    }
                  />
                </fieldset>

                {/* ---------- 3. Vos coordonnées ---------- */}
                <fieldset>
                  <legend className="surtitre text-ocre">3 — Vos coordonnées</legend>

                  <div className="mt-6 space-y-5">
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

                    <Champ
                      label="Allergies, occasion particulière, demande…"
                      name="message"
                      as="textarea"
                      value={valeurs.message}
                      onChange={majChamp}
                      optionnel
                    />
                  </div>
                </fieldset>

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

/**
 * Étape « Où ? » : bascule entre les deux espaces et plan cliquable.
 * Le choix reste facultatif — imposer une table ferait perdre des réservations
 * à ceux qui s'en moquent, et prive la maison de sa marge de manœuvre en salle.
 */
function ZoneDeChoix({
  date,
  grandeTablee,
  chargement,
  zoneActive,
  surChangementZone,
  occupees,
  couverts,
  selection,
  surSelection,
}) {
  if (grandeTablee) {
    return (
      <Encart>
        Au-delà de douze couverts, nous organisons la salle sur mesure : appelez-nous au{' '}
        {infos.telephoneAffiche}, nous verrons ensemble la meilleure disposition.
      </Encart>
    )
  }

  if (!date) {
    return (
      <Encart>
        Indiquez d’abord une date et un service : le plan affichera les tables encore libres.
      </Encart>
    )
  }

  const zone = zones.find((z) => z.id === zoneActive) ?? zones[0]
  const choisie = selection ? trouverTable(selection) : null

  const libresIci = zone.tables.filter(
    (table) => !occupees.has(table.id) && table.couverts >= couverts,
  ).length

  const autreZone = zones.find((z) => z.id !== zone.id)
  const libresAilleurs = autreZone
    ? autreZone.tables.filter((table) => !occupees.has(table.id) && table.couverts >= couverts)
        .length
    : 0

  return (
    <div className="mt-6">
      {/* Bascule salle / terrasse */}
      <div className="flex gap-2" role="tablist" aria-label="Espaces du restaurant">
        {zones.map((z) => {
          const actif = z.id === zone.id
          return (
            <button
              key={z.id}
              type="button"
              role="tab"
              aria-selected={actif}
              onClick={() => surChangementZone(z.id)}
              className={`flex-1 border px-4 py-3 font-display text-lg transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-xl ${
                actif
                  ? 'border-ocre bg-ocre text-creme'
                  : 'border-sable text-nuit/60 hover:border-ocre/50 hover:text-nuit'
              }`}
            >
              {z.nom}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-nuit/60">{zone.description}</p>

      <div className="mt-6 border border-sable bg-creme-fonce/40 p-4 sm:p-6">
        {chargement ? (
          <p className="py-20 text-center text-sm text-nuit/50">Recherche des tables libres…</p>
        ) : (
          <PlanSalle
            zone={zone}
            occupees={occupees}
            couverts={couverts}
            selection={selection}
            onSelectionner={surSelection}
          />
        )}
      </div>

      {/* Impasse : on le dit franchement et on propose une porte de sortie,
          plutôt que de laisser le visiteur devant un plan entièrement barré. */}
      {!chargement && libresIci === 0 && (
        <p className="mt-5 border-l-2 border-ocre bg-creme-fonce/50 px-5 py-4 text-sm leading-relaxed text-nuit/70">
          Aucune table de {couverts} couverts n’est libre à ce service dans cet espace.{' '}
          {libresAilleurs > 0
            ? `Il reste de la place ${autreZone.id === 'terrasse' ? 'en terrasse' : 'en salle'} — ou essayez un autre jour.`
            : 'Essayez un autre jour ou un autre service, et appelez-nous : il reste souvent une solution.'}
        </p>
      )}

      {/* Récapitulatif du choix */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-sable pt-5">
        {choisie ? (
          <p className="text-sm text-nuit/75">
            Table <span className="font-medium text-nuit">{choisie.id}</span> — {choisie.zoneNom},{' '}
            {choisie.couverts} couverts.
          </p>
        ) : (
          <p className="text-sm text-nuit/55">
            Aucune table choisie : nous vous placerons au mieux.
          </p>
        )}

        {choisie && (
          <button
            type="button"
            onClick={() => surSelection(choisie.id)}
            className="surtitre text-ocre underline underline-offset-4"
          >
            Sans préférence
          </button>
        )}
      </div>
    </div>
  )
}

function Encart({ children }) {
  return (
    <p className="mt-6 border border-dashed border-sable bg-creme-fonce/40 px-6 py-10 text-center text-sm leading-relaxed text-nuit/55">
      {children}
    </p>
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
              "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%23a85736' stroke-width='1.5'%3E%3Cpath d='M1 1.5 6 6.5l5-5'/%3E%3C/svg%3E\")",
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
  const table = v.table ? trouverTable(v.table) : null

  const corps = [
    `Nom : ${v.nom}`,
    `Téléphone : ${v.telephone}`,
    `E-mail : ${v.email}`,
    `Date : ${v.date}`,
    `Service : ${service}`,
    `Couverts : ${v.couverts}`,
    `Place : ${table ? `table ${table.id} — ${table.zoneNom}` : 'sans préférence'}`,
    '',
    v.message || '(aucune précision)',
  ].join('\n')

  return `mailto:${infos.email}?subject=${encodeURIComponent(
    `Demande de réservation — ${v.nom} — ${v.date}`,
  )}&body=${encodeURIComponent(corps)}`
}
