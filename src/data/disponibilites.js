import { toutesLesTables } from './salle'

/* ==========================================================================
 *  DISPONIBILITÉ DES TABLES — SIMULATION
 *
 *  ⚠️  Aucune réservation réelle n'est consultée ici. Les tables « occupées »
 *  sont tirées d'une fonction déterministe : pour une date et un service
 *  donnés, le résultat ne change jamais, ce qui rend la démonstration
 *  crédible et stable. Mais cela reste inventé.
 *
 *  ---------------------------------------------------------------------------
 *  POUR PASSER EN RÉEL
 *  ---------------------------------------------------------------------------
 *  Un vrai choix de table impose un serveur : sans lui, deux clients peuvent
 *  réserver la même table à la même heure. Le jour venu, il suffit de
 *  remplacer le corps de `tablesOccupees` par un appel au planning :
 *
 *      export async function tablesOccupees(date, service) {
 *        const r = await fetch(`/api/disponibilites?date=${date}&service=${service}`)
 *        return new Set(await r.json())
 *      }
 *
 *  L'appelant traite déjà le résultat comme asynchrone : rien d'autre à
 *  changer dans l'interface.
 * ========================================================================== */

/** Hachage FNV-1a : petit, rapide, et surtout stable d'une visite à l'autre. */
function graine(texte) {
  let h = 2166136261
  for (let i = 0; i < texte.length; i += 1) {
    h ^= texte.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * Taux de remplissage simulé, plus élevé le soir et le week-end — c'est ce qui
 * rend la démonstration crédible plutôt que uniformément aléatoire.
 */
function tauxOccupation(date, service) {
  const jour = new Date(`${date}T12:00:00`).getDay() // 0 = dimanche
  const weekEnd = jour === 0 || jour === 5 || jour === 6

  // Volontairement modéré : un plan presque entièrement barré donnerait
  // l'impression d'un restaurant toujours complet et découragerait la demande.
  if (service === 'soir') return weekEnd ? 42 : 26
  return weekEnd ? 30 : 15
}

/**
 * Tables déjà réservées pour une date et un service.
 * @returns {Promise<Set<string>>} identifiants des tables occupées
 */
export async function tablesOccupees(date, service) {
  if (!date) return new Set()

  const seuil = tauxOccupation(date, service)
  const occupees = new Set()

  for (const table of toutesLesTables) {
    if (graine(`${date}|${service}|${table.id}`) % 100 < seuil) {
      occupees.add(table.id)
    }
  }

  return occupees
}
