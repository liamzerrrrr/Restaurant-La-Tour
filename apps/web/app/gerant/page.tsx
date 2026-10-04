import {configured,authenticated} from '../../lib/server/auth';
import {db} from '../../lib/server/db';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!configured())return <main className="admin"><p className="eyebrow">LA TOUR DE MONTADY</p><h1>Accès privé non configuré.</h1><p>L’authentification et la connexion aux données réelles doivent être activées avant la mise en service. Cette page ne donne accès à aucune réservation.</p><a className="text-link" href="/demo/gerant">Explorer l’interface de démonstration →</a></main>;
 if(!await authenticated())return <main className="admin admin-form"><h1>Votre espace privé.</h1><p>Connexion gérant</p><form action="/api/gerant/login" method="post"><label>Email<input name="email" type="email" required autoComplete="username"/></label><label>Mot de passe<input name="password" type="password" required autoComplete="current-password"/></label><button className="button">Se connecter →</button></form></main>;
 const rows=await db()`SELECT id,name,people,starts_at,status,zone,source FROM reservations WHERE starts_at>now()-interval '24 hours' ORDER BY starts_at LIMIT 200`;
 return <main className="admin"><p className="eyebrow">DONNÉES RÉELLES · ACCÈS AUTHENTIFIÉ</p><h1>Les réservations.</h1><p>Lecture persistante connectée. Les actions complètes du gérant sont encore réservées à la démonstration.</p>{rows.map(r=><article className="reservation-row" key={r.id}><strong>{r.name}</strong><span>{r.people} personnes · {new Date(r.starts_at).toLocaleString('fr-FR',{timeZone:'Europe/Paris'})}</span><span>{r.zone} · {r.status} · {r.source}</span></article>)}</main>;
}
