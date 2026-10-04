import {cancelWithToken} from '../../../../lib/server/reservations';
import {allowedOrigin} from '../../../../lib/server/auth';
export const runtime='nodejs';
export async function POST(request:Request){
 if(!allowedOrigin(request))return Response.json({error:'Origine refusée.'},{status:403});
 if(process.env.APP_MODE!=='connected'||process.env.SERVICE_CONFIG_APPROVED!=='true')return Response.json({error:'Gestion réelle non activée.'},{status:503});
 try{const {token}=await request.json();if(typeof token!=='string')throw Error();return Response.json(await cancelWithToken(token),{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Lien invalide, expiré ou réservation non modifiable.'},{status:400});}
}
