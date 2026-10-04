import 'server-only';
import {createHmac,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {cookies} from 'next/headers';
import {db} from './db';
const cookie='montady-admin';
export function configured(){return Boolean(process.env.DATABASE_URL&&process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD_HASH&&(process.env.AUTH_SECRET?.length??0)>=32&&process.env.APP_MODE==='connected');}
function signature(value:string){return createHmac('sha256',process.env.AUTH_SECRET!).update(value).digest('hex');}
export async function authenticated(){if(!configured())return false;const value=(await cookies()).get(cookie)?.value;if(!value)return false;const [expires,sig]=value.split('.');if(!sig||!/^\d+$/.test(expires)||!/^\w{64}$/.test(sig)||+expires<Date.now())return false;return timingSafeEqual(Buffer.from(sig),Buffer.from(signature(expires)));}
export async function login(email:string,password:string,request:Request){if(!configured())return false;
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
 const key=createHash('sha256').update(ip+process.env.AUTH_SECRET).digest('hex');
 const rows=await db()`INSERT INTO auth_attempts(key,window_start,attempts) VALUES(${key},now(),1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN 1 ELSE auth_attempts.attempts+1 END,window_start=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN now() ELSE auth_attempts.window_start END RETURNING attempts`;
 if(rows[0].attempts>8)return false;
 const [salt,expected]=process.env.ADMIN_PASSWORD_HASH!.split(':');if(!salt||!expected||!/^[a-f0-9]{128}$/.test(expected)||password.length>200)return false;
 const actual=scryptSync(password,salt,64);const match=timingSafeEqual(actual,Buffer.from(expected,'hex'));
 if(email!==process.env.ADMIN_EMAIL||!match)return false;
 const expires=String(Date.now()+8*3600000);(await cookies()).set(cookie,expires+'.'+signature(expires),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',maxAge:8*3600,path:'/'});return true;
}
