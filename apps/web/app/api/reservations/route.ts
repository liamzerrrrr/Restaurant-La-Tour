import {bookingInput,reserve} from '../../../lib/server/reservations';
export const runtime='nodejs';
export async function POST(request:Request){
 if(process.env.APP_MODE!=='connected'||process.env.SERVICE_CONFIG_APPROVED!=='true')return Response.json({error:'Les réservations réelles ne sont pas activées.'},{status:503});
 if(request.headers.get('origin')!==process.env.APP_ORIGIN)return Response.json({error:'Origine refusée.'},{status:403});
 try{const input=bookingInput.parse(await request.json());const result=await reserve(input);return Response.json(result,{status:201,headers:{'Cache-Control':'no-store'}});}catch(e){const code=e instanceof Error?e.message:'';return Response.json({error:code==='UNAVAILABLE'?'Ce créneau n’est plus disponible.':'La réservation n’a pas été enregistrée.'},{status:code==='UNAVAILABLE'?409:400});}
}
