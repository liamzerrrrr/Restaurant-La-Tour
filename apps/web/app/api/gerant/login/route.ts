import {login,configured} from '../../../../lib/server/auth';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!configured())return Response.json({error:'Accès privé non configuré.'},{status:503});
 if(request.headers.get('origin')!==process.env.APP_ORIGIN)return Response.json({error:'Origine refusée.'},{status:403});
 try{const form=await request.formData();const ok=await login(String(form.get('email')),String(form.get('password')),request);return Response.redirect(new URL(ok?'/gerant':'/gerant?erreur=1',process.env.APP_ORIGIN),303);}catch{return Response.json({error:'Connexion indisponible.'},{status:503});}
}
