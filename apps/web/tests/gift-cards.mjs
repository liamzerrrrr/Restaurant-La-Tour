import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import postgres from 'postgres';
process.loadEnvFile('.env.local');assert.equal(process.env.DATA_ENV,'test');assert.equal(process.env.SMS_ENABLED,'false');
const origin=process.env.APP_ORIGIN;let cookie='';const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1});let stage='connexion';let id='';
const post=async(path,body,auth=true)=>{const r=await fetch(origin+path,{method:'POST',headers:{origin,'Content-Type':'application/json',...(auth?{cookie}:{})},body:JSON.stringify(body)});return {status:r.status,body:await r.json()};};
try{
 const creds=await readFile(process.argv[2],'utf8');const r=await fetch(origin+'/api/gerant/login',{method:'POST',headers:{origin,Accept:'application/json'},body:new URLSearchParams({email:creds.match(/^Email : (.+)$/m)[1],password:creds.match(/^Mot de passe : (.+)$/m)[1]})});assert.equal(r.status,200);cookie=r.headers.get('set-cookie').split(';')[0];
 assert.equal((await fetch(origin+'/api/gerant/cadeaux')).status,401);
 const rejected=await fetch(origin+'/api/gerant/cadeaux',{method:'POST',headers:{origin:'https://example.invalid',cookie,'Content-Type':'application/json'},body:'{}'});assert.equal(rejected.status,403);
 stage='création';const body={action:'issue',requestKey:randomUUID(),amountCents:10000,recipient:'Essai solde',message:'Bon fictif sans valeur.'};const first=await post('/api/gerant/cadeaux',body);assert.equal(first.status,201);id=first.body.id;
 const duplicate=await post('/api/gerant/cadeaux',body);assert.equal(duplicate.body.id,id);assert.equal(duplicate.body.code,first.body.code);
 assert.equal((await post('/api/gerant/cadeaux',{...body,amountCents:12000})).status,409);
 const [expiry]=await sql`SELECT expires_at=created_at+interval '1 year' AS valid FROM gift_cards WHERE id=${id}`;assert.equal(expiry.valid,true);
 stage='concurrence';const debit={action:'debit',id,amountCents:7000,note:'Essai concurrence',requestKey:randomUUID()};const other={...debit,requestKey:randomUUID()};const attempts=await Promise.all([post('/api/gerant/cadeaux',debit),post('/api/gerant/cadeaux',other)]);assert.equal(attempts.filter(x=>x.status===200).length,1);assert.equal(attempts.filter(x=>x.status===409).length,1);
 const winner=attempts[0].status===200?debit:other;assert.equal((await post('/api/gerant/cadeaux',winner)).body.balanceCents,3000);
 stage='solde privé';let view=await post('/api/cadeaux',{code:first.body.code},false);assert.equal(view.status,200);assert.equal(view.body.balance_cents,3000);assert.equal(view.body.transactions.length,1);assert.equal('code_hash' in view.body,false);assert.equal('email' in view.body,false);assert.equal('note' in view.body.transactions[0],false);
 assert.equal((await post('/api/cadeaux',{code:'invalide'},false)).status,404);
 stage='épuisement';assert.equal((await post('/api/gerant/cadeaux',{...debit,amountCents:3000,requestKey:randomUUID()})).body.balanceCents,0);assert.equal((await post('/api/gerant/cadeaux',{...debit,amountCents:1,requestKey:randomUUID()})).status,409);
 stage='expiration';await sql`UPDATE gift_cards SET expires_at=now()-interval '1 second' WHERE id=${id}`;view=await post('/api/cadeaux',{code:first.body.code},false);assert.equal(view.body.expired,true);assert.equal((await post('/api/gerant/cadeaux',{...debit,amountCents:1,requestKey:randomUUID()})).status,409);
 console.log('Réussi : accès privé, origine, montant en centimes, validité un an, création sans doublon, débits concurrents, utilisations multiples, solde nul, expiration et lien sans coordonnées. Aucun email ni SMS.');
}catch{console.error('Échec du test cadeau : '+stage);process.exitCode=1;}finally{if(cookie)await fetch(origin+'/api/gerant/logout',{method:'POST',headers:{origin,cookie,Accept:'application/json'}});await sql.end();}
