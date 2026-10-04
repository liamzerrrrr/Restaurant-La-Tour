import {slots} from './hours.ts';
export {slots};
export type Zone='Intérieur'|'Terrasse';
export type Status='En attente'|'Confirmée'|'Arrivée'|'Terminée'|'Annulée'|'Absence';
export type Booking={id:string;date:string;time:string;people:number;zone:Zone;preference:string;name:string;phone:string;email:string;comment:string;allergies?:string;source:string;status:Status};
export type Proposal={id:string;booking:string;seats:number;expires:number;status:'En attente'|'Acceptée'|'Refusée'|'Expirée'};
export type State={bookings:Booking[];capacity:number;rainAvailability:Record<string,number>;closures:string[];proposals:Proposal[];mode:'immediate'|'approval';duration:number;deadline:number;log:string[]};
export const minutes=(t:string)=>Number(t.slice(0,2))*60+Number(t.slice(3));
export const service=(t:string)=>minutes(t)<960?'Midi':'Soir';
export const parisDate=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function fresh():State{return {capacity:100,rainAvailability:{},bookings:[],proposals:[],closures:[],mode:'immediate',duration:120,deadline:30,log:[]};}
export function remaining(s:State,date:string,part:string,exclude?:string){return Math.max(0,s.capacity-s.bookings.filter(b=>b.id!==exclude&&b.date===date&&service(b.time)===part&&!['Annulée','Absence'].includes(b.status)).reduce((n,b)=>n+b.people,0));}
export function available(s:State,date:string,time:string,people:number,zone:Zone,exclude?:string,now=Date.now()):number{
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(now));
 const clock=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(now));
 if(date<today||(date===today&&minutes(time)<=minutes(clock)))return 0;
 if(!slots(date).includes(time)||s.closures.includes(date+'|'+service(time)+'|'+zone)||people<1||people>100)return 0;
 const seats=remaining(s,date,service(time),exclude);return seats>=people?seats:0;
}
export function addBooking(s:State,b:Omit<Booking,'id'|'status'>):Booking{
 if(!available(s,b.date,b.time,b.people,b.zone))throw Error('Ce service vient de devenir indisponible. Choisissez un autre service.');
 const row:Booking={...b,id:crypto.randomUUID(),status:s.mode==='immediate'?'Confirmée':'En attente'};s.bookings.push(row);s.log.unshift('Réservation '+row.status.toLowerCase()+' · '+row.time+' · '+row.source);return row;
}
export function rainPlan(s:State,date:string,part:string){
 const key=date+'|'+part;let free=s.rainAvailability[key]||0;
 for(const p of s.proposals){const b=s.bookings.find(b=>b.id===p.booking);if(b?.date===date&&service(b.time)===part&&p.status==='En attente'&&p.expires>Date.now())free-=p.seats;}
 return s.bookings.filter(b=>b.date===date&&service(b.time)===part&&b.zone==='Terrasse'&&['Confirmée','En attente'].includes(b.status)).map(booking=>{const existing=s.proposals.some(p=>p.booking===booking.id&&p.status==='En attente'&&p.expires>Date.now());const seats=!existing&&free>=booking.people?booking.people:0;if(seats)free-=seats;return {booking,seats};});
}
export function acceptProposal(s:State,id:string,now=Date.now()){
 const p=s.proposals.find(p=>p.id===id);if(!p||p.status!=='En attente'||p.expires<=now)throw Error('Cette proposition a expiré ou a déjà été traitée.');
 const b=s.bookings.find(b=>b.id===p.booking);if(!b||!['Confirmée','En attente'].includes(b.status))throw Error('La réservation ne peut plus être déplacée.');
 const key=b.date+'|'+service(b.time);if((s.rainAvailability[key]||0)<p.seats)throw Error('Les places intérieures doivent être revérifiées par le gérant.');
 s.rainAvailability[key]-=p.seats;b.zone='Intérieur';p.status='Acceptée';s.log.unshift('Proposition acceptée · placement intérieur');
}
