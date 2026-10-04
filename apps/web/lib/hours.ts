import hours from '../../../src/data/horaires.json' with {type:'json'};
export {hours};
export function slots(date:string){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return [];
 const row=hours.find(h=>h.day===new Date(date+'T12:00:00Z').getUTCDay());const result:string[]=[];
 for(const range of [row?.midi,row?.soir])if(range){const start=Number(range[0].slice(0,2))*60+Number(range[0].slice(3));const end=Number(range[1].slice(0,2))*60+Number(range[1].slice(3));for(let n=start;n<=end;n+=30)result.push(String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0'));}
 return result;
}
