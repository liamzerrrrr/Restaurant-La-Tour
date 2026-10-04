import type {Dish} from '../lib/menu';

const money=(price:number|null)=>price===null?'Prix à confirmer':new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(price);
const courses:Record<string,string[]>={
 '14':['Une entrée au choix','Un plat au choix','Fromages ou dessert'],
 '15':['Une entrée au choix','Un plat au choix','Assiette de fromages','Dessert au choix'],
 '16':['Première entrée','Deuxième entrée','Le plat','Assiette de fromages','Dessert au choix'],
 '17':['Le plat au choix','Le dessert','La boisson'],
};

export default function MenuPresentation({dishes,category}:{dishes:Dish[];category:string}){
 const formulas=category==='Menus';
 return <div className={formulas?'formula-grid':'menu-dishes'}>{dishes.map(d=>{
  const parts=d.description.split(';').map(part=>part.trim()).filter(Boolean);
  const labels=courses[d.id];
  return formulas?<article className={'formula-card'+(d.id==='15'?' formula-featured':'')} key={d.id}>
   {labels&&<p className="formula-eyebrow">{d.id==='16'?'EN CINQ TEMPS':d.id==='17'?'POUR LES PLUS JEUNES':d.id==='15'?'EN QUATRE TEMPS':'EN TROIS TEMPS'}</p>}
   <h3>{d.name}</h3>
   {labels&&parts.length===labels.length?<><ul className="formula-courses">{parts.map((part,i)=><li key={i}><span>{d.id==='16'?part.split('. Cinq plats')[0]:labels[i]}</span></li>)}</ul><details className="formula-composition"><summary>Les plats de ce menu</summary><p>{d.description}</p></details></>:<p className="formula-description">{d.description}</p>}
   <div className="formula-bottom"><span className="formula-price">{money(d.price)}</span>{!d.available&&<span className="badge">Indisponible</span>}</div>
   {d.id==='16'&&d.description.includes('Cinq plats')&&<p className="formula-note">{d.description.slice(d.description.indexOf('Cinq plats'))}</p>}
   {d.id==='17'&&d.description.startsWith('Jusqu')&&<p className="formula-note">{d.description.split('.')[0]}.</p>}
  </article>:<article className="menu-dish" key={d.id}>
   <div className="menu-dish-heading"><h3>{d.name}</h3><span className="price-leader" aria-hidden="true"/><span className="menu-dish-price">{money(d.price)}</span></div>
   <p>{d.description}</p>{!d.available&&<span className="badge">Indisponible</span>}
  </article>;
 })}</div>;
}
