import {configured,allowedOrigin,logout} from '../../../../lib/server/auth';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!configured())return Response.json({error:'Accès privé non configuré.'},{status:503});
 if(!allowedOrigin(request))return Response.json({error:'Origine refusée.'},{status:403});
 await logout();
 if(request.headers.get('accept')==='application/json')return Response.json({ok:true});
 return Response.redirect(new URL('/gerant',request.headers.get('origin')!),303);
}
