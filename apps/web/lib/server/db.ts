import 'server-only';
import postgres from 'postgres';
let connection:ReturnType<typeof postgres>|undefined;
export function db(){if(!process.env.DATABASE_URL)throw Error('DATABASE_NOT_CONFIGURED');return connection??=postgres(process.env.DATABASE_URL,{max:3,idle_timeout:20,connect_timeout:10,ssl:'require'});}
export function assertConnected(){if(process.env.APP_MODE!=='connected'||process.env.SERVICE_CONFIG_APPROVED!=='true')throw Error('LIVE_DISABLED');}
