import 'server-only';
import {randomBytes,randomUUID,createHash,createHmac} from 'node:crypto';
import {db,assertConnected} from './db';
import {z} from 'zod';
import {slots} from '../hours';
export const bookingInput=z.object({serviceId:z.uuid(),startsAt:z.iso.datetime({offset:true}),people:z.number().int().min(1).max(12),preference:z.enum(['interior','terrace']),name:z.string().trim().min(2).max(80),phone:z.string().regex(/^\+?[0-9 ()-]{8,20}$/),email:z.email().max(254),comment:z.string().max(500).default(''),allergies:z.string().max(300).default('')});
const hash=(token:string)=>createHash('sha256').update(token).digest('hex');
export async function reserve(input:z.infer<typeof bookingInput>,source='site',actor='client',requestKey?:string){assertConnected();if(requestKey&&!z.uuid().safeParse(requestKey).success)throw Error('INVALID');const token=requestKey?createHmac('sha256',process.env.AUTH_SECRET!).update('reservation:'+requestKey).digest('base64url'):randomBytes(32).toString('base64url');const id=randomUUID();return db().begin(async tx=>{
 const fingerprint=hash(JSON.stringify({input,source,actor}));
 if(requestKey){await tx`SELECT pg_advisory_xact_lock(hashtextextended(${requestKey},0))`;const [existing]=await tx`SELECT id,status,request_fingerprint,token_hash FROM reservations WHERE request_key=${requestKey}`;if(existing){if(existing.request_fingerprint!==fingerprint||existing.token_hash!==hash(token))throw Error('CONFLICT');return {id:existing.id,status:existing.status,token};}}
 const [service]=await tx`SELECT * FROM services WHERE id=${input.serviceId} FOR UPDATE`;
 if(!service||service.closed||(service.terrace_closed&&input.preference==='terrace'))throw Error('UNAVAILABLE');
 const start=new Date(input.startsAt);const first=new Date(service.first_arrival),last=new Date(service.last_arrival);const end=new Date(start.getTime()+service.duration_minutes*60000);
 if(start<first||start>last||start<=new Date()||end>new Date(service.closes_at)||(start.getTime()-first.getTime())%(service.step_minutes*60000)!==0)throw Error('UNAVAILABLE');
 const parisDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(start);
 const parisTime=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',hour12:false}).format(start);
 if(!slots(parisDate).includes(parisTime))throw Error('UNAVAILABLE');
 // The service row lock serializes capacity checks across all customers.
 const [used]=await tx`SELECT coalesce(sum(people),0)::int AS covers FROM reservations WHERE service_id=${service.id} AND status NOT IN ('cancelled','no_show')`;
 if(used.covers+input.people>service.capacity)throw Error('UNAVAILABLE');
 const status=service.mode==='immediate'?'confirmed':'pending';
 await tx`INSERT INTO reservations(id,service_id,starts_at,ends_at,people,preference,zone,status,name,phone,email,comment,allergies,source,token_hash,token_expires_at) VALUES(${id},${service.id},${start},${end},${input.people},${input.preference},${input.preference},${status},${input.name},${input.phone},${input.email},${input.comment},${input.allergies},${source},${hash(token)},${new Date(end.getTime()+86400000)})`;
 await tx`INSERT INTO audit_events(actor,reservation_id,event) VALUES(${actor},${id},'created')`;
 if(requestKey)await tx`UPDATE reservations SET request_key=${requestKey},request_fingerprint=${fingerprint} WHERE id=${id}`;
 await tx`INSERT INTO notification_jobs(id,reservation_id,revision,kind,due_at) VALUES(${randomUUID()},${id},1,'confirmation',now())`;
 const reminder=new Date(start.getTime()-7200000);if(status==='confirmed'&&reminder>new Date())await tx`INSERT INTO notification_jobs(id,reservation_id,revision,kind,due_at) VALUES(${randomUUID()},${id},1,'reminder',${reminder})`;
 return {status,token,id};
 });}
export async function cancelWithToken(token:string){assertConnected();if(!/^[A-Za-z0-9_-]{43}$/.test(token))throw Error('INVALID_LINK');return db().begin(async tx=>{
 const [r]=await tx`SELECT * FROM reservations WHERE token_hash=${hash(token)} AND token_expires_at>now() FOR UPDATE`;
 if(!r)throw Error('INVALID_LINK');if(r.status==='cancelled')return {status:'cancelled'};if(!['pending','confirmed'].includes(r.status))throw Error('INVALID_STATE');
 await tx`UPDATE reservations SET status='cancelled',revision=revision+1 WHERE id=${r.id}`;
 await tx`UPDATE move_proposals SET status='declined' WHERE reservation_id=${r.id} AND status='pending'`;
 await tx`UPDATE notification_jobs SET state='cancelled' WHERE reservation_id=${r.id} AND state IN('queued','failed')`;
 await tx`INSERT INTO audit_events(actor,reservation_id,event) VALUES('client',${r.id},'cancelled')`;
 await tx`INSERT INTO notification_jobs(id,reservation_id,revision,kind,due_at) VALUES(${randomUUID()},${r.id},${r.revision+1},'cancellation',now())`;
 return {status:'cancelled'};
 });}
