/**
 * Jeu d'icônes minimal, dessiné à la main en SVG.
 * Aucune librairie d'icônes n'est chargée : le site reste léger et sans
 * dépendance externe.
 */

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const IconeTelephone = (props) => (
  <svg {...base} {...props}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.2 2 2 0 0 1 6 4z" />
  </svg>
)

export const IconeHorloge = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>
)

export const IconeEpingle = (props) => (
  <svg {...base} {...props}>
    <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const IconeInstagram = (props) => (
  <svg {...base} {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const IconeFacebook = (props) => (
  <svg {...base} {...props}>
    <path d="M14.5 8.5h2.5V5.2h-2.6c-2.3 0-3.9 1.6-3.9 4v2.3H8v3.3h2.5V21h3.4v-6.2h2.6l.5-3.3h-3.1V9.6c0-.7.3-1.1 1.1-1.1z" />
  </svg>
)

export const IconeTikTok = (props) => (
  <svg {...base} {...props}>
    <path d="M15 4c.4 2.2 1.8 3.7 4 4v3c-1.6 0-3-.5-4-1.3V15a5.5 5.5 0 1 1-5.5-5.5c.3 0 .6 0 .9.1v3.1a2.4 2.4 0 1 0 1.6 2.3V4z" />
  </svg>
)

export const IconeFleche = (props) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconeMenu = (props) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const IconeCroix = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
