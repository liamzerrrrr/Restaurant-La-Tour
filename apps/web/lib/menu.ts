import importedMenu from './imported-menu.json';
export type Dish = {id:string;category:string;name:string;description:string;price:number|null;source:number|null;provenance?:string;available:boolean;validated:boolean};
const rows: [string,string,string,number|null,number][] = [
['Entrées','Le berlingot','Betterave au chèvre de Combebelle, éclat croustillant, sorbet betterave-framboise, ketchup réduit.',19,6],
['Entrées','Le bras de poulpe','En médaillon et gelée de crustacés, aïoli blanco andalou, perles de hareng fumé, chips de guanciale.',23,6],
['Entrées','Les makis de canard fermier','Mousseline de foie gras à la truffe.',23,6],
['Entrées','La picanha de veau','En basse température comme un vitello tonnato, sablé parmesan.',20,6],
['Plats','Le taureau de Camargue','En noisette, jus réduit à la sangria.',24,7],
['Plats','Le croustillant de pigeonneau','Bardé au foie gras, gastrique aux fruits rouges.',25,7],
['Plats','Le dos de bar sauvage','Sur peau, jus de coquillages monté au beurre noisette.',24,7],
['Plats','Le dos de cabillaud skrei','Sauce tamarin.',25,7],
['Plats','Le retour du chef','Selon son humeur, viande de race ou de chasse. Suggestion à demander.',26,7],
['Plats','Le homard bleu','Crème iodée et salicornes.',43,7],
['Desserts','Assiette de fromages','Sélection affinée.',9,8],
['Desserts','La pavlova','Aux fraises de région et fruits rouges, chiboust à la stracciatella.',9,8],
['Desserts','Le finger chocolat','Grand cru, cœur crémeux aux éclats de caramel et cacahuètes torréfiées.',9,8],
['Desserts','La pêche texturée','Autour d’un cheesecake crémeux, gel citron et sorbet pêche.',9,8],
['Menus','Le Découverte','Le berlingot ou la picanha de veau ; le dos de bar sauvage ou le taureau de Camargue ; assiette de fromages ou dessert au choix.',34.9,2],
['Menus','L’Oppidum','Le bras de poulpe, les makis de canard fermier ou le thon rouge de Méditerranée en mosaïque fumé minute et crème d’artichauts barigoule ; le retour du chef, le croustillant de pigeonneau ou le dos de cabillaud skrei sauce tamarin ; assiette de fromages ; dessert au choix.',40.9,3],
['Menus','Le Dégustation','Les makis de canard fermier ; le homard bleu ; le retour du chef ; assiette de fromages ; dessert au choix. Cinq plats : ce menu doit être choisi par toutes les personnes de la table.',69,4],
['Menus','Menu enfant','Jusqu’à 12 ans. Fingers de poulet ou filet de poisson avec frites ; crème chocolat ou glace ; un sirop au choix.',12,5],
];
const jpgMenu: Dish[]=rows.map((r,i)=>({id:String(i),category:r[0],name:r[1],description:r[2],price:r[3],source:r[4],available:true,validated:false}));

export const initialMenu: Dish[]=[...jpgMenu,{id:"thon",category:"Entrées",name:"Le thon rouge de Méditerranée",description:"En mosaïque fumé minute et crème d’artichauts barigoule.",price:23,source:null,provenance:"GitHub · src/data/menu.js",available:true,validated:false},...importedMenu];
export const sourceUrl=(d:Dish)=>d.source?"/menus/"+d.source+".jpg":"https://github.com/liamzerrrrr/Restaurant-La-Tour/blob/d91c504/"+(d.category==="Vins"?"src/data/vins.js":d.category==="Boissons"?"src/data/boissons.js":"src/data/menu.js");
