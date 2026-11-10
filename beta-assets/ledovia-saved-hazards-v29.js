/* Ledovia Beta v0.8.29: read-only saved hazard summary, using existing local data. */
(()=>{'use strict';
const KEY='silent-compass-hazards-v1';
function init(){
 const side=document.getElementById('sidePanel'),layers=document.getElementById('ld19Layers');
 const map=document.getElementById('mapwrap'),floating=document.getElementById('ld22FullscreenLayers');
 if(!side||!layers||!map||!floating)return false;
 if(document.getElementById('ld29SavedHazards'))return true;
 const details=document.createElement('details');details.id='ld29SavedHazards';
 const summary=document.createElement('summary');summary.textContent='⚠ Saved Hazards & Zones';
 const body=document.createElement('div');body.className='ld29HazardBody';
 details.append(summary,body);layers.insertAdjacentElement('afterend',details);
 function render(){
  body.replaceChildren();
  let reports=[];try{const parsed=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(parsed))reports=parsed}catch{}
  const intro=document.createElement('p');intro.textContent=reports.length+' saved hazard marker'+(reports.length===1?'':'s')+' · 0 Avoidance Zones';body.append(intro);
  if(!reports.length){const empty=document.createElement('p');empty.textContent='No saved hazard markers yet.';body.append(empty)}
  else{
   const list=document.createElement('ul');
   reports.slice().reverse().forEach(p=>{
    const item=document.createElement('li');
    const name=typeof p.name==='string'&&p.name.trim()?p.name:(typeof p.type==='string'?p.type:'Hazard');
    const status=typeof p.status==='string'?p.status:'Unknown';
    item.textContent=name+' — '+status;list.append(item);
   });body.append(list);
  }
  const note=document.createElement('p');note.className='ld29Hint';note.textContent='Personal reports are not verified alerts. To create or edit reports, use Hazards under Advanced Tools.';body.append(note);
 }
 function sync(){
  const full=document.fullscreenElement===map;
  if(full){if(details.parentElement!==floating)floating.append(details)}
  else if(details.parentElement!==side)layers.insertAdjacentElement('afterend',details);
  if(details.open)render();
 }
 details.addEventListener('toggle',()=>{if(details.open)render()});
 window.addEventListener('storage',e=>{if(e.key===KEY&&details.open)render()});
 document.addEventListener('fullscreenchange',()=>requestAnimationFrame(sync));
 window.addEventListener('focus',()=>{if(details.open)render()});
 sync();return true;
}
if(!init()){let n=0;const timer=setInterval(()=>{if(init()||++n>120)clearInterval(timer)},100)}
})();
