import 'server-only';
import {createHash,randomUUID} from 'node:crypto';
import {db,assertConnected} from './db';
import {bookingInput} from './reservations';
import {slots} from '../hours';
import {z} from 'zod';
export const updateInput=bookingInput.extend({id:z.uuid(),revision:z.number().int().positive(),status:z.enum(['pending','confirmed','arrived','completed','cancelled','no_show'])});
export async function modify(input:z.infer<typeof updateInput>,actor='admin'){
 assertConnected();return db().begin(async tx=>{
  const [old]=await tx`SELECT service_id FROM reservations WHERE id=${input.id}`;if(!old)throw Error('NOT_FOUND');
  const locked=await tx`SELECT * FROM services WHERE id=${old.service_id} OR id=${input.serviceId} ORDER BY id FOR UPDATE`;
  const [r]=await tx`SELECT * FROM reservations WHERE id=${input.id} FOR UPDATE`;
  if(r.revision!==input.revision||r.service_id!==old.service_id)throw Error('CONFLICT');
  if(!['pending','confirmed','arrived'].includes(r.status))throw Error('INVALID_STATE');
  const s=locked.find(s=>s.id===input.serviceId);if(!s)throw Error('UNAVAILABLE');const start=new Date(input.startsAt),end=new Date(start.getTime()+s.duration_minutes*60000);
  const changes=start.getTime()!==new Date(r.starts_at).getTime()||input.serviceId!==r.service_id||input.people!==r.people||input.preference!==r.preference;
  if(changes||['pending','confirmed'].includes(input.status)){
   const date=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(start);const time=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(start);
   if(s.closed||(s.terrace_closed&&input.preference==='terrace')||start<=new Date()||start<new Date(s.first_arrival)||start>new Date(s.last_arrival)||end>new Date(s.closes_at)||(start.getTime()-new Date(s.first_arrival).getTime())%(s.step_minutes*60000)!==0||!slots(date).includes(time))throw Error('UNAVAILABLE');
  }
  if(!['cancelled','no_show'].includes(input.status)){const [used]=await tx`SELECT coalesce(sum(people),0)::int AS covers FROM reservations WHERE service_id=${s.id} AND id<>${r.id} AND status NOT IN ('cancelled','no_show')`;if(used.covers+input.people>s.capacity)throw Error('UNAVAILABLE');}
  await tx`UPDATE reservations SET service_id=${s.id},starts_at=${start},ends_at=${end},people=${input.people},preference=${input.preference},zone=${input.preference},status=${input.status},name=${input.name},phone=${input.phone},email=${input.email},comment=${input.comment},allergies=${input.allergies},revision=revision+1,token_expires_at=${new Date(end.getTime()+86400000)} WHERE id=${r.id}`;
  await tx`UPDATE notification_jobs SET state='cancelled' WHERE reservation_id=${r.id} AND state IN ('queued','failed')`;
  await tx`UPDATE move_proposals SET status='declined' WHERE reservation_id=${r.id} AND status='pending'`;
  await tx`INSERT INTO audit_events(actor,reservation_id,event,details) VALUES(${actor},${r.id},'updated',${tx.json({revision:r.revision+1,status:input.status})})`;
  if(input.status==='confirmed'){await tx`INSERT INTO notification_jobs(id,reservation_id,revision,kind,due_at) VALUES(${randomUUID()},${r.id},${r.revision+1},'confirmation',now())`;const remind=new Date(start.getTime()-7200000);if(remind>new Date())await tx`INSERT INTO notification_jobs(id,reservation_id,revision,kind,due_at) VALUES(${randomUUID()},${r.id},${r.revision+1},'reminder',${remind})`;}
  return {status:input.status};
 });
}
export async function lookupToken(token:string){assertConnected();if(!/^[A-Za-z0-9_-]{43}$/.test(token))throw Error('INVALID_LINK');const [r]=await db()`SELECT id,service_id,starts_at,ends_at,people,preference,status,revision FROM reservations WHERE token_hash=${createHash('sha256').update(token).digest('hex')} AND token_expires_at>now()`;if(!r)throw Error('INVALID_LINK');return r;}
