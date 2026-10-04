import horaires from './horaires.json'
/**
 * Informations pratiques du restaurant.
 * Ces données alimentent le pied de page, la section contact et les liens
 * d'appel. Elles sont regroupées ici pour être modifiables sans toucher au code
 * des composants.
 */

export const infos = {
  nom: 'La Tour',
  nomComplet: 'Restaurant La Tour de Montady',

  adresse: {
    rue: '4 rue Marcelle Huc et des Résistants',
    codePostal: '34310',
    ville: 'Montady',
    region: 'Occitanie',
  },

  // Format international pour le lien tel:, format lisible pour l'affichage
  telephone: '+33467905073',
  telephoneAffiche: '04 67 90 50 73',

  email: 'contact@latourdemontady.com',

  coordonnees: { lat: 43.3169, lng: 3.1131 },

  liens: {
    itineraire:
      'https://www.google.com/maps/dir/?api=1&destination=Restaurant+La+Tour,+4+rue+Marcelle+Huc+et+des+R%C3%A9sistants,+34310+Montady',
    instagram: 'https://www.instagram.com/restaurant_latourmontady/',
    facebook: 'https://www.facebook.com/p/Restaurant-de-la-tour-montady-100043754966286/',
    // Renseigner l'URL du compte TikTok dès qu'il est ouvert ; le bouton
    // n'apparaît pas dans le pied de page tant que cette valeur est nulle.
    tiktok: null,
  },

  /**
   * Horaires de service (prise de commande).
   * `midi` / `soir` à null = fermé sur ce service.
   */
  horaires: horaires.map(h=>({jour:h.jour,midi:h.midi?h.midi.join(' – '):null,soir:h.soir?h.soir.join(' – '):null})),
  noteHoraires: 'Fermé le mercredi, le mardi soir et le dimanche soir.',

}

/** Index du jour courant dans le tableau `horaires` (lundi = 0). */
export function indexJourCourant(date = new Date()) {
  return (date.getDay() + 6) % 7
}
