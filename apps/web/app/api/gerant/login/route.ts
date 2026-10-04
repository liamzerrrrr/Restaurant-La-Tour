import {login,configured,allowedOrigin} from '../../../../lib/server/auth';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!configured())return Response.json({error:'Accès privé non configuré.'},{status:503});
 if(!allowedOrigin(request))return Response.json({error:'Origine refusée.'},{status:403});
 try{const form=await request.formData();const ok=await login(String(form.get('email')),String(form.get('password')),request);if(request.headers.get('accept')==='application/json')return Response.json(ok?{ok:true}:{error:'Connexion refusée. Vérifiez vos identifiants ou réessayez plus tard.'},{status:ok?200:401});return Response.redirect(new URL(ok?'/gerant':'/gerant?erreur=1',request.headers.get('origin')!),303);}catch{return Response.json({error:'Connexion indisponible.'},{status:503});}
}
