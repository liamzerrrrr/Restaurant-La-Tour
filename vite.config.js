import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const chemin = (relatif) => fileURLToPath(new URL(relatif, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Site à deux pages réellement distinctes : chacune a son URL, son titre et
    // sa description. Pas de routeur, donc rien à configurer côté hébergeur.
    rollupOptions: {
      input: {
        accueil: chemin('index.html'),
        partenaires: chemin('partenaires/index.html'),
      },
    },
  },
})
