import postgres from 'postgres';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
process.loadEnvFile('.env.local');
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL manquante.');
const sql=postgres(process.env.DATABASE_URL,{max:1,ssl:'require',connect_timeout:15});
try{
 await sql.begin(async tx=>{
  await tx`SELECT pg_advisory_xact_lock(76310524)`;
  await tx`CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`;
  for(const name of (await readdir('db')).filter(x=>/^\d+.*\.sql$/.test(x)).sort()){
   const source=await readFile('db/'+name,'utf8');
   const checksum=createHash('sha256').update(source.replace(/\r\n/g,'\n')).digest('hex');
   const [existing]=await tx`SELECT checksum FROM schema_migrations WHERE name=${name}`;
   if(existing){if(existing.checksum!==checksum)throw Error('Migration modifiée : '+name);continue;}
   await tx.unsafe(source.replace(/^BEGIN;\s*$/gm,'').replace(/^COMMIT;\s*$/gm,''));
   await tx`INSERT INTO schema_migrations(name,checksum) VALUES(${name},${checksum})`;
   console.log('Migration appliquée : '+name);
  }
 });
 console.log('Base accessible. Schéma à jour. Aucune réservation de démonstration importée.');
}catch{console.error('Migration impossible. Vérifiez la connexion et le schéma ; aucun secret affiché.');process.exitCode=1;}finally{await sql.end();}
