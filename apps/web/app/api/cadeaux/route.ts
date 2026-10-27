import {createHash} from 'node:crypto';
import {allowedOrigin} from '../../../lib/server/auth';
import {db} from '../../../lib/server/db';
import {lookupGift} from '../../../lib/server/gifts';
export const runtime='nodejs';
export async function POST(request:Request){const headers={'Cache-Control':'no-store'};if(!allowedOrigin(request))return Response.json({error:'Origine refusée.'},{status:403,headers});
 try{const ip=request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';const key=createHash('sha256').update('gift:'+ip+process.env.AUTH_SECRET).digest('hex');
 const [rate]=await db()`INSERT INTO auth_attempts(key,window_start,attempts) VALUES(${key},now(),1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.window_start<now()-interval '1 minute' THEN 1 ELSE auth_attempts.attempts+1 END,window_start=CASE WHEN auth_attempts.window_start<now()-interval '1 minute' THEN now() ELSE auth_attempts.window_start END RETURNING attempts`;
 if(rate.attempts>30)return Response.json({error:'Réessayez dans une minute.'},{status:429,headers});
 const body=await request.json();return Response.json(await lookupGift(body.code),{headers});
 }catch{return Response.json({error:'Code invalide ou bon indisponible.'},{status:404,headers});}}
