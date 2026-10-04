import Restaurant from './restaurant';
export const dynamic='force-dynamic';
export default function Page(){return <Restaurant connected={process.env.APP_MODE==='connected'&&process.env.DATA_ENV==='test'&&process.env.SERVICE_CONFIG_APPROVED==='true'}/>;}
