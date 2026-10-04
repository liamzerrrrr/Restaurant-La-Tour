import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID,createHash} from 'node:crypto';
import postgres from 'postgres';
process.loadEnvFile('.env.local');assert.equal(process.env.DATA_ENV,'test');assert.equal(process.env.SMS_ENABLED,'false');
const origin=process.env.APP_ORIGIN,sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1});const receipts=[];let cookie='',stage='préparation',closedService='';
const post=async(path,body,authenticated=false)=>{const r=await fetch(origin+path,{method:'POST',headers:{origin,'Content-Type':'application/json',...(authenticated?{cookie}:{})},body:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
const slots=async(date)=>{const r=await fetch(origin+'/api/availability?date='+date+'&people=2&preference=interior');assert.equal(r.status,200);return (await r.json()).choices.filter(c=>c.available);};
const fixture=c=>({serviceId:c.serviceId,startsAt:c.startsAt,people:12,preference:'interior',name:'Essai concurrence',phone:'0000000000',email:'test@example.com',comment:'Recette connectée',allergies:'Sans gluten',requestKey:randomUUID()});
try{
 let day=new Date(Date.now()+30*86400000),date=day.toISOString().slice(0,10),available=await slots(date);while(!available.length){day=new Date(day.getTime()+86400000);date=day.toISOString().slice(0,10);available=await slots(date);}const choice=available[0];
 const creds=await readFile(process.argv[2],'utf8');const login=await fetch(origin+'/api/gerant/login',{method:'POST',redirect:'manual',headers:{origin},body:new URLSearchParams({email:creds.match(/^Email : (.+)$/m)[1],password:creds.match(/^Mot de passe : (.+)$/m)[1]})});cookie=login.headers.get('set-cookie').split(';')[0];
 stage='concurrence';const results=await Promise.all(Array.from({length:10},()=>post('/api/reservations',fixture(choice))));for(const r of results)if(r.status===201)receipts.push(r.data);assert.equal(receipts.length,8);assert.equal(results.filter(r=>r.status===409).length,2);
 stage='dernières places';const lastBody={...fixture(choice),people:4};const secondBody={...lastBody,requestKey:randomUUID()};const last=await Promise.all([post('/api/reservations',lastBody),post('/api/reservations',secondBody)]);assert.equal(last.filter(r=>r.status===201).length,1);for(const r of last)if(r.status===201)receipts.push(r.data);
 stage='idempotence';const winner=last[0].status===201?0:1;const duplicate=await post('/api/reservations',winner===0?lastBody:secondBody);assert.equal(duplicate.data.id,last[winner].data.id);
 const [total]=await sql`SELECT sum(people)::int AS used FROM reservations WHERE service_id=${choice.serviceId} AND status NOT IN ('cancelled','no_show')`;assert.equal(total.used,100);
 stage='authentification';assert.equal((await fetch(origin+'/api/gerant/reservations?date='+date)).status,401);
 stage='lien privé';const view=await post('/api/reservations/manage',{action:'get',token:receipts[0].token});assert.equal(view.status,200);assert.equal('email' in view.data,false);assert.equal('phone' in view.data,false);
 assert.equal((await post('/api/reservations/manage',{action:'get',token:'invalide'})).status,409);
 stage='échec modification';const failed=await post('/api/reservations/manage',{action:'move',token:receipts[0].token,revision:view.data.revision,serviceId:choice.serviceId,startsAt:new Date(Date.now()-3600000).toISOString()});assert.equal(failed.status,409);assert.equal((await post('/api/reservations/manage',{action:'get',token:receipts[0].token})).data.starts_at,view.data.starts_at);
 stage='déplacement validé';let otherDay=new Date(day.getTime()+86400000),next=await slots(otherDay.toISOString().slice(0,10));while(!next.length){otherDay=new Date(otherDay.getTime()+86400000);next=await slots(otherDay.toISOString().slice(0,10));}assert.equal((await post('/api/reservations/manage',{action:'move',token:receipts[0].token,revision:view.data.revision,serviceId:next[0].serviceId,startsAt:next[0].startsAt})).status,200);
 stage='source manuelle';const manual=await post('/api/gerant/reservations',{...fixture(choice),people:2,source:'phone',action:'add'},true);assert.equal(manual.status,201);
 const records=await (await fetch(origin+'/api/gerant/reservations?date='+date,{headers:{cookie}})).json();const record=records.bookings.find(r=>r.id===manual.data.id);assert.equal(record.source,'phone');assert.equal(record.allergies,'Sans gluten');
 stage='révision concurrente';const update={...record,action:'update',serviceId:record.service_id,startsAt:record.starts_at,status:'arrived'};assert.equal((await post('/api/gerant/reservations',update,true)).status,200);assert.equal((await post('/api/gerant/reservations',update,true)).status,409);
 stage='annulation gérant';assert.equal((await post('/api/gerant/reservations',{...update,revision:record.revision+1,status:'cancelled'},true)).status,200);
 stage='fermeture';closedService=choice.serviceId;assert.equal((await post('/api/gerant/reservations',{action:'closure',serviceId:closedService,closed:true},true)).status,200);assert.equal((await slots(date)).filter(c=>c.serviceId===choice.serviceId).length,0);
 console.log('Réussi : quota 100 sous concurrence, dernières places, anti-doublon, accès privé, allergies et source, modification atomique, conflits de révision, annulation et fermeture.');
}catch{console.error('Échec de recette : '+stage+' (aucun secret affiché).');process.exitCode=1;}finally{
 for(const r of receipts)await post('/api/reservations/manage',{action:'cancel',token:r.token});
 if(closedService)await post('/api/gerant/reservations',{action:'closure',serviceId:closedService,closed:false},true);
 if(cookie)await fetch(origin+'/api/gerant/logout',{method:'POST',redirect:'manual',headers:{origin,cookie}});
 const digest=v=>createHash('sha256').update(v).digest('hex');await sql`DELETE FROM auth_attempts WHERE key=${digest('unknown'+process.env.AUTH_SECRET)} OR key=${digest('account:'+process.env.ADMIN_EMAIL+process.env.AUTH_SECRET)}`;await sql.end();
}
