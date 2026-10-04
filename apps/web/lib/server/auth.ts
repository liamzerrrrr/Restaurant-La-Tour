import 'server-only';
import {randomBytes,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {cookies} from 'next/headers';
import {db} from './db';
const cookie='montady-admin';
export function configured(){return Boolean(process.env.DATABASE_URL&&process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD_HASH&&(process.env.AUTH_SECRET?.length??0)>=32&&process.env.APP_MODE==='connected');}
const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export function allowedOrigin(request:Request){const origins=[process.env.APP_ORIGIN,...(process.env.ADMIN_ALLOWED_ORIGINS||'').split(',')].filter(Boolean);return origins.includes(request.headers.get('origin')||'');}
export async function authenticated(){
 if(!configured())return false;const token=(await cookies()).get(cookie)?.value;
 if(!token||!/^[A-Za-z0-9_-]{43}$/.test(token))return false;
 const rows=await db()`SELECT token_hash FROM admin_sessions WHERE token_hash=${digest(token)} AND identity_hash=${digest(process.env.ADMIN_EMAIL!+process.env.ADMIN_PASSWORD_HASH!+process.env.AUTH_SECRET!)} AND expires_at>now()`;
 return rows.length===1;
}
export async function login(email:string,password:string,request:Request){if(!configured()||password.length>200||email.length>254)return false;
 const ip=request.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
 const key=createHash('sha256').update(ip+process.env.AUTH_SECRET).digest('hex');
 const rows=await db()`INSERT INTO auth_attempts(key,window_start,attempts) VALUES(${key},now(),1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN 1 ELSE auth_attempts.attempts+1 END,window_start=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN now() ELSE auth_attempts.window_start END RETURNING attempts`;
 if(rows[0].attempts>8)return false;
 const accountKey=digest('account:'+process.env.ADMIN_EMAIL!+process.env.AUTH_SECRET!);
 const account=await db()`INSERT INTO auth_attempts(key,window_start,attempts) VALUES(${accountKey},now(),1) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN 1 ELSE auth_attempts.attempts+1 END,window_start=CASE WHEN auth_attempts.window_start<now()-interval '15 minutes' THEN now() ELSE auth_attempts.window_start END RETURNING attempts`;
 if(account[0].attempts>8)return false;
 const [salt,expected]=process.env.ADMIN_PASSWORD_HASH!.split(':');if(!salt||!expected||!/^[a-f0-9]{128}$/.test(expected)||password.length>200)return false;
 const actual=scryptSync(password,salt,64);const match=timingSafeEqual(actual,Buffer.from(expected,'hex'));
 if(email.toLowerCase()!==process.env.ADMIN_EMAIL!.toLowerCase()||!match){await db()`INSERT INTO audit_events(actor,event) VALUES('admin-auth','login_failed')`;return false;}
 const token=randomBytes(32).toString('base64url');
 await db().begin(async tx=>{
  await tx`DELETE FROM admin_sessions WHERE expires_at<now()`;
  await tx`INSERT INTO admin_sessions(token_hash,identity_hash,expires_at) VALUES(${digest(token)},${digest(process.env.ADMIN_EMAIL!+process.env.ADMIN_PASSWORD_HASH!+process.env.AUTH_SECRET!)},${new Date(Date.now()+8*3600000)})`;
  await tx`INSERT INTO audit_events(actor,event) VALUES('admin-auth','login_succeeded')`;
 });
 (await cookies()).set(cookie,token,{httpOnly:true,secure:process.env.APP_ORIGIN?.startsWith('https://')||Boolean(process.env.VERCEL),sameSite:'strict',maxAge:8*3600,path:'/'});return true;
}
export async function logout(){const jar=await cookies();const token=jar.get(cookie)?.value;if(token&&/^[A-Za-z0-9_-]{43}$/.test(token)){await db()`DELETE FROM admin_sessions WHERE token_hash=${digest(token)}`;await db()`INSERT INTO audit_events(actor,event) VALUES('admin-auth','logout')`;}jar.delete(cookie);}
