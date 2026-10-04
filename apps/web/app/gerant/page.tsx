import LoginForm from '../login-form';
import ConnectedManager from '../connected-manager';
import {configured,authenticated} from '../../lib/server/auth';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<{erreur?:string}>}){
 if(!configured())return <main className="admin"><p className="eyebrow">LA TOUR DE MONTADY</p><h1>Accès privé non configuré.</h1><p>L’authentification et la connexion aux données réelles doivent être activées avant la mise en service. Cette page ne donne accès à aucune réservation.</p><a className="text-link" href="/demo/gerant">Explorer l’interface de démonstration →</a></main>;
 if(!await authenticated())return <main className="admin admin-form"><p className="eyebrow">LA TOUR DE MONTADY · ACCÈS GÉRANT</p><h1>Votre espace privé.</h1><p>Connectez-vous pour accéder aux données de la base de test.</p>{(await searchParams).erreur&&<p role="alert" className="warning">Connexion refusée. Vérifiez vos identifiants ou réessayez plus tard.</p>}<LoginForm/><a className="text-link" href="/">Retour au restaurant →</a></main>;
 return <ConnectedManager/>;
}
