import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import './globals.css';
export const metadata: Metadata = { title:'La Tour de Montady · Une table, un paysage',description:'Cuisine de saison et plaisir de recevoir à Montady. Prototype de réservation.',robots:{index:false,follow:false},icons:{icon:'/icon.svg'}};
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="fr"><body>{children}</body></html>; }
