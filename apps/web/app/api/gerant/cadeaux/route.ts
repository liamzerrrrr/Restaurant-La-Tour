import {authenticated,allowedOrigin} from '../../../../lib/server/auth';
import {db,assertConnected} from '../../../../lib/server/db';
import {issueGift,issueInput,debitGift,debitInput} from '../../../../lib/server/gifts';
export const runtime='nodejs';
const headers={'Cache-Control':'no-store'};
export async function GET(){if(!await authenticated())return Response.json({error:'Connexion requise.'},{status:401,headers});
 try{assertConnected();if(process.env.DATA_ENV!=='test')throw Error();
 const cards=await db()`SELECT id,initial_cents,balance_cents,code_suffix,recipient,created_at,expires_at FROM gift_cards ORDER BY created_at DESC LIMIT 100`;
 const transactions=await db()`SELECT gift_card_id,amount_cents,note,at FROM gift_transactions WHERE gift_card_id IN (SELECT id FROM gift_cards ORDER BY created_at DESC LIMIT 100) ORDER BY at DESC`;
 return Response.json({cards,transactions,emailConnected:false,testEmail:'tomybarbierpro@gmail.com'},{headers});
 }catch{return Response.json({error:'Bons cadeaux indisponibles.'},{status:503,headers});}}
export async function POST(request:Request){if(!allowedOrigin(request))return Response.json({error:'Origine refusée.'},{status:403,headers});if(!await authenticated())return Response.json({error:'Connexion requise.'},{status:401,headers});
 try{const body=await request.json();if(body.action==='issue')return Response.json(await issueGift(issueInput.parse(body)),{status:201,headers});if(body.action==='debit')return Response.json(await debitGift(debitInput.parse(body)),{headers});throw Error('INVALID');}
 catch(e){const message=e instanceof Error?e.message:'';return Response.json({error:message==='INSUFFICIENT'?'Solde insuffisant. Aucun débit effectué.':message==='EXPIRED'?'Ce bon est expiré. Aucun débit effectué.':message==='CONFLICT'?'Cette opération a changé. Actualisez avant de réessayer.':'Opération impossible. Aucun changement enregistré.'},{status:409,headers});}}
