import 'server-only';
import {createHash,createHmac,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {db,assertConnected} from './db';
const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
function guard(){assertConnected();if(process.env.DATA_ENV!=='test')throw Error('TEST_ONLY');}
const cents=z.number().int().min(100).max(1000000);
export const issueInput=z.object({requestKey:z.uuid(),amountCents:cents,recipient:z.string().trim().max(80).default(''),message:z.string().trim().max(500).default('')});
export const debitInput=z.object({requestKey:z.uuid(),id:z.uuid(),amountCents:z.number().int().positive().max(1000000),note:z.string().trim().max(200).default('')});
export async function issueGift(input:z.infer<typeof issueInput>){guard();
 const code=createHmac('sha256',process.env.AUTH_SECRET!).update('gift:'+input.requestKey).digest('base64url');
 const fingerprint=hash(JSON.stringify({amountCents:input.amountCents,recipient:input.recipient,message:input.message}));
 return db().begin(async tx=>{
  await tx`SELECT pg_advisory_xact_lock(hashtextextended(${input.requestKey},0))`;
  const [existing]=await tx`SELECT id,fingerprint,code_hash,expires_at FROM gift_cards WHERE request_key=${input.requestKey}`;
  if(existing){if(existing.fingerprint!==fingerprint||existing.code_hash!==hash(code))throw Error('CONFLICT');return {id:existing.id,code,expiresAt:existing.expires_at};}
  const id=randomUUID();const [card]=await tx`INSERT INTO gift_cards(id,request_key,fingerprint,code_hash,code_suffix,initial_cents,balance_cents,recipient,message) VALUES(${id},${input.requestKey},${fingerprint},${hash(code)},${code.slice(-4)},${input.amountCents},${input.amountCents},${input.recipient},${input.message}) RETURNING expires_at`;
  await tx`INSERT INTO audit_events(actor,event,details) VALUES('admin','gift_issued',${tx.json({giftId:id,amountCents:input.amountCents,environment:'test'})})`;
  return {id,code,expiresAt:card.expires_at};
 });
}
export async function debitGift(input:z.infer<typeof debitInput>){guard();return db().begin(async tx=>{
 await tx`SELECT pg_advisory_xact_lock(hashtextextended(${input.requestKey},0))`;
 const [card]=await tx`SELECT id,balance_cents,expires_at FROM gift_cards WHERE id=${input.id} FOR UPDATE`;
 if(!card)throw Error('NOT_FOUND');
 const [existing]=await tx`SELECT gift_card_id,amount_cents,note FROM gift_transactions WHERE request_key=${input.requestKey}`;
 if(existing){if(existing.gift_card_id!==input.id||existing.amount_cents!==input.amountCents||existing.note!==input.note)throw Error('CONFLICT');return {balanceCents:card.balance_cents};}
 if(new Date(card.expires_at)<=new Date())throw Error('EXPIRED');
 if(input.amountCents>card.balance_cents)throw Error('INSUFFICIENT');
 const [updated]=await tx`UPDATE gift_cards SET balance_cents=balance_cents-${input.amountCents} WHERE id=${input.id} RETURNING balance_cents`;
 await tx`INSERT INTO gift_transactions(id,gift_card_id,request_key,amount_cents,note) VALUES(${randomUUID()},${input.id},${input.requestKey},${input.amountCents},${input.note})`;
 await tx`INSERT INTO audit_events(actor,event,details) VALUES('admin','gift_debited',${tx.json({giftId:input.id,amountCents:input.amountCents})})`;
 return {balanceCents:updated.balance_cents};
});}
export async function lookupGift(code:string){guard();if(!/^[A-Za-z0-9_-]{43}$/.test(code))throw Error('INVALID');
 const [card]=await db()`SELECT id,initial_cents,balance_cents,recipient,message,expires_at FROM gift_cards WHERE code_hash=${hash(code)}`;
 if(!card)throw Error('INVALID');
 return {...card,expired:new Date(card.expires_at)<=new Date(),transactions:await db()`SELECT amount_cents,at FROM gift_transactions WHERE gift_card_id=${card.id} ORDER BY at DESC`};
}
