import {redirect} from 'next/navigation';
import {authenticated} from '../../../lib/server/auth';
import GiftManager from '../../gift-manager';
export const dynamic='force-dynamic';
export default async function Page(){if(!await authenticated())redirect('/gerant');return <GiftManager/>;}
