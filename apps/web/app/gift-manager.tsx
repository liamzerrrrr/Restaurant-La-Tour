'use client';
import {useEffect,useRef,useState} from 'react';
type Card={id:string;initial_cents:number;balance_cents:number;recipient:string;code_suffix:string;expires_at:string};
type Transaction={gift_card_id:string;amount_cents:number;note:string;at:string};
const euros=(n:number)=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n/100);
const day=(s:string)=>new Date(s).toLocaleDateString('fr-FR',{timeZone:'Europe/Paris'});
export default function GiftManager(){
 const [cards,setCards]=useState<Card[]>([]),[transactions,setTransactions]=useState<Transaction[]>([]),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[loaded,setLoaded]=useState(false),[selected,setSelected]=useState(''),[receipt,setReceipt]=useState<{code:string;id:string}|null>(null);
 const request=useRef({fingerprint:'',key:''});
 async function refresh(){const r=await fetch('/api/gerant/cadeaux',{cache:'no-store'});const data=await r.json();if(!r.ok)throw Error(data.error);setCards(data.cards);setTransactions(data.transactions);setLoaded(true);}
 useEffect(()=>{void refresh().catch(e=>setError(e.message));},[]);
 async function submit(event:React.FormEvent<HTMLFormElement>,action:'issue'|'debit'){
  event.preventDefault();if(busy)return;const form=event.currentTarget;const fields=new FormData(form);const amount=Number(fields.get('amount'));const amountCents=Math.round(amount*100);
  if(!Number.isFinite(amount)||amount<=0||Math.abs(amount*100-amountCents)>0.000001){setError('Saisissez un montant positif avec deux décimales au maximum.');return;}
  const body=action==='issue'?{action,amountCents,recipient:String(fields.get('recipient')),message:String(fields.get('message'))}:{action,id:selected,amountCents,note:String(fields.get('note'))};
  const fingerprint=JSON.stringify(body);if(request.current.fingerprint!==fingerprint)request.current={fingerprint,key:crypto.randomUUID()};
  setBusy(true);setError('');setNotice('');
  try{const r=await fetch('/api/gerant/cadeaux',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,requestKey:request.current.key})});const result=await r.json();if(!r.ok)throw Error(result.error);
   if(action==='issue'){setReceipt(result);setNotice('Bon de test créé. Aucun paiement ni email envoyé.');}else{setNotice('Dépense enregistrée. Nouveau solde : '+euros(result.balanceCents));form.reset();request.current={fingerprint:'',key:''};}
   await refresh();
  }catch(e){setError(e instanceof Error?e.message:'Action impossible.');}finally{setBusy(false);}
 }
 const card=cards.find(c=>c.id===selected);
 return <main className="admin"><p className="eyebrow">LA TOUR · BONS CADEAUX · BASE DE TEST</p><h1>Offrir, puis savourer.</h1><a className="text-link" href="/gerant">Retour aux réservations</a><p className="warning">Bons fictifs uniquement. Solde enregistré dans la base de test, valable un an à compter de sa création. Aucun encaissement, email ou SMS. Utilisez des noms et messages fictifs.</p>
 {error&&<p role="alert" className="warning">{error}</p>}{notice&&<p role="status">{notice}</p>}
 <div className="gift-admin-grid"><section className="admin-form"><h2>Créer un bon de test</h2><form onSubmit={e=>void submit(e,'issue')}><label>Montant en euros<input name="amount" type="number" min="1" max="10000" step="0.01" defaultValue="100" required/></label><label>Pour qui ?<input name="recipient" maxLength={80} placeholder="Prénom fictif"/></label><label>Message personnel<textarea name="message" maxLength={500} rows={3}/></label><button className="button" disabled={busy}>Créer le bon de test</button></form>{receipt&&<div className="gift-receipt"><p>Conservez ce lien privé : le code complet n’est pas affiché dans la liste des bons.</p><a className="text-link" target="_blank" rel="noreferrer" href={'/cadeau#'+receipt.code}>Ouvrir et imprimer le bon</a><p className="small">Aucun email n’a été envoyé.</p></div>}</section>
 <section className="admin-form"><h2>Enregistrer une utilisation</h2><p>Seul le gérant peut déduire une dépense. Le solde restant reste utilisable jusqu’à l’échéance initiale.</p><form onSubmit={e=>void submit(e,'debit')}><label>Bon cadeau<select value={selected} onChange={e=>setSelected(e.target.value)} required><option value="">Choisir un bon</option>{cards.map(c=><option key={c.id} value={c.id}>{c.recipient||'Sans destinataire'} · …{c.code_suffix} · {euros(c.balance_cents)}</option>)}</select></label>{card&&<p>Disponible : <strong>{euros(card.balance_cents)}</strong> · valable jusqu’au {day(card.expires_at)}</p>}<label>Montant utilisé en euros<input name="amount" type="number" min="0.01" max={card?card.balance_cents/100:10000} step="0.01" required/></label><label>Note interne<input name="note" maxLength={200} placeholder="Ex. déjeuner, numéro de ticket"/></label><button className="button" disabled={busy||!card||card.balance_cents===0||new Date(card.expires_at)<=new Date()}>Enregistrer la dépense</button></form></section></div>
 <h2>Les bons cadeaux</h2>{!loaded&&!error&&<p>Chargement…</p>}{loaded&&!cards.length&&<p>Aucun bon de test pour l’instant.</p>}{cards.map(c=><article className="reservation-row" key={c.id}><div><strong>{c.recipient||'Bon cadeau'} · …{c.code_suffix}</strong><p>{euros(c.balance_cents)} restants sur {euros(c.initial_cents)} · échéance {day(c.expires_at)}</p><span className="badge">{new Date(c.expires_at)<=new Date()?'Expiré':c.balance_cents===0?'Épuisé':'Actif'}</span></div><button onClick={()=>setSelected(c.id)}>Sélectionner pour une utilisation</button></article>)}
 <h2>Historique des utilisations</h2>{!transactions.length&&<p>Aucune dépense enregistrée.</p>}{transactions.map((t,i)=><p className="log" key={i}>{day(t.at)} · …{cards.find(c=>c.id===t.gift_card_id)?.code_suffix} · {euros(t.amount_cents)}{t.note?' · '+t.note:''}</p>)}
 </main>;
}
