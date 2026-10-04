'use client';
import {useId, useRef, useState} from 'react';
import {slots} from '../lib/hours';

const format = (date: string, options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('fr-FR', {timeZone: 'UTC', ...options}).format(new Date(date + 'T12:00:00Z'));
const iso = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export default function ReservationCalendar({value, min, closures,closedDates=[], onChange}: {value: string; min: string; closures: string[];closedDates?:string[]; onChange: (date: string) => void}) {
 const id = useId();
 const trigger = useRef<HTMLButtonElement>(null);
 const [open, setOpen] = useState(false);
 const [month, setMonth] = useState('2000-01-01');
 const [year, index] = month.split('-').map(Number);
 const count = new Date(Date.UTC(year, index, 0)).getUTCDate();
 const offset = (new Date(month + 'T12:00:00Z').getUTCDay() + 6) % 7;
 function close() {setOpen(false); trigger.current?.focus();}
 function shift(delta: number) {const next = new Date(Date.UTC(year, index - 1 + delta, 1)); setMonth(iso(next.getUTCFullYear(), next.getUTCMonth(), 1));}
 return <div className="reservation-calendar" onKeyDown={e => {if(e.key === 'Escape') {e.preventDefault(); close();}}}>
  <span className="date-label" id={id + '-label'}>Date</span>
  <button ref={trigger} type="button" className="date-trigger" aria-label={value ? 'Date : ' + format(value, {day: 'numeric', month: 'long', year: 'numeric'}) : 'Choisir une date'} aria-expanded={open} aria-controls={id} onClick={() => {setMonth((value || min || '2000-01-01').slice(0, 7) + '-01'); setOpen(!open);}}>{value ? format(value, {day: '2-digit', month: '2-digit', year: 'numeric'}) : 'Choisir une date'} <span aria-hidden="true">▦</span></button>
  <input type="hidden" name="date" value={value}/>
  {open && <div id={id} className="date-panel" role="region" aria-labelledby={id + '-label'}>
   <div className="date-navigation"><button type="button" aria-label="Mois précédent" disabled={!!min && month.slice(0, 7) <= min.slice(0, 7)} onClick={() => shift(-1)}>‹</button><strong aria-live="polite">{format(month, {month: 'long', year: 'numeric'})}</strong><button type="button" aria-label="Mois suivant" onClick={() => shift(1)}>›</button></div>
   <div className="date-grid">{['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(day => <span key={day} className="date-weekday">{day}</span>)}{Array.from({length: offset}, (_, i) => <span key={'empty-' + i}/>)}{Array.from({length: count}, (_, i) => {
    const date = iso(year, index - 1, i + 1);
    const closed = closedDates.includes(date)||!slots(date).length || ['Midi', 'Soir'].every(service => ['Intérieur', 'Terrasse'].every(zone => closures.includes(date + '|' + service + '|' + zone)));
    const past = !!min && date < min;
    return <button key={date} type="button" disabled={closed || past} className={[closed ? 'date-closed' : '', value === date ? 'date-selected' : ''].join(' ')} aria-label={format(date, {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'}) + (closed ? ' — restaurant fermé' : past ? ' — date passée' : '')} aria-pressed={value === date} title={closed ? 'Restaurant fermé' : undefined} onClick={() => {onChange(date); close();}}>{i + 1}</button>;
   })}</div>
   <p className="date-legend"><span aria-hidden="true"/>Jours grisés : restaurant fermé ou date passée.</p>
   <button type="button" className="date-dismiss" onClick={close}>Fermer le calendrier</button>
  </div>}
 </div>;
}
