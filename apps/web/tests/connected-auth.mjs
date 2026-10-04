import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import postgres from 'postgres';
process.loadEnvFile('.env.local');
assert.equal(process.env.DATA_ENV,'test','Ces vérifications sont réservées à la base de test.');
assert.equal(process.env.SMS_ENABLED,'false');
const content=await readFile(process.argv[2],'utf8');
const email=content.match(/^Email : (.+)$/m)[1];
const password=content.match(/^Mot de passe : (.+)$/m)[1];
const origin=process.env.APP_ORIGIN;
const sql=postgres(process.env.DATABASE_URL,{ssl:'require',max:1});
const login=(pass,site=origin)=>fetch(origin+'/api/gerant/login',{method:'POST',redirect:'manual',headers:{origin:site},body:new URLSearchParams({email,password:pass})});
try{
 const before=await fetch(origin+'/gerant');assert.match(await before.text(),/Votre espace privé/);
 assert.equal((await login(password,'https://exemple.invalid')).status,403);
 const wrong=await login('mot-de-passe-incorrect');assert.equal(wrong.status,303);assert.match(wrong.headers.get('location'),/erreur=1/);assert.equal(wrong.headers.get('set-cookie'),null);
 const response=await login(password);assert.equal(response.status,303);
 const header=response.headers.get('set-cookie');assert.match(header,/HttpOnly/i);assert.match(header,/SameSite=strict/i);const cookie=header.split(';')[0];
 const privatePage=await fetch(origin+'/gerant',{headers:{cookie}});assert.match(await privatePage.text(),/Base de test connectée/);
 const fake=await fetch(origin+'/gerant',{headers:{cookie:'montady-admin=invalid'}});assert.match(await fake.text(),/Votre espace privé/);
 const expiredToken=cookie.slice(cookie.indexOf('=')+1);const {createHash}=await import('node:crypto');const hashed=createHash('sha256').update(expiredToken).digest('hex');
 await sql`UPDATE admin_sessions SET expires_at=now()-interval '1 minute' WHERE token_hash=${hashed}`;
 const expired=await fetch(origin+'/gerant',{headers:{cookie}});assert.match(await expired.text(),/Votre espace privé/);
 const fresh=await login(password);const nextCookie=fresh.headers.get('set-cookie').split(';')[0];
 assert.equal((await fetch(origin+'/api/gerant/logout',{method:'POST',redirect:'manual',headers:{origin,cookie:nextCookie}})).status,303);
 const after=await fetch(origin+'/gerant',{headers:{cookie:nextCookie}});assert.match(await after.text(),/Votre espace privé/);
 for(let i=0;i<9;i++)await login('mot-de-passe-incorrect');
 const limited=await login(password);assert.match(limited.headers.get('location'),/erreur=1/);assert.equal(limited.headers.get('set-cookie'),null);
 assert.equal((await fetch(origin+'/api/reservations',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:'{}'})).status,503);
 const [counts]=await sql`SELECT (SELECT count(*) FROM reservations)::int AS bookings, (SELECT count(*) FROM notification_jobs)::int AS notifications`;
 assert.equal(counts.bookings,0);assert.equal(counts.notifications,0);
 console.log('Vérifié : accès anonyme refusé, origine externe refusée, mauvais mot de passe refusé, session privée, jeton invalide et expiré refusés, déconnexion révoquée, limitation des tentatives, réservations publiques et SMS désactivés.');
}catch{console.error('Échec de la vérification connectée ; aucun identifiant affiché.');process.exitCode=1;}finally{
 const {createHash}=await import('node:crypto');const digest=value=>createHash('sha256').update(value).digest('hex');
 await sql`DELETE FROM auth_attempts WHERE key=${digest('unknown'+process.env.AUTH_SECRET)} OR key=${digest('account:'+process.env.ADMIN_EMAIL+process.env.AUTH_SECRET)}`;
 await sql.end();
}
