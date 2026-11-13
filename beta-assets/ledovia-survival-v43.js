/* Ledovia Beta v43: presentation-only landing. Preserve the original Survival Hub DOM and event handlers. */
(()=>{'use strict';
function init(){
 const panel=document.getElementById('panel-survival');
 if(!panel||panel.querySelector('.ldvGuideLanding')||!panel.querySelector('.survivalSubnav'))return;
 const oldNodes=[...panel.childNodes];
 const landing=document.createElement('section');landing.className='ldvGuideLanding';
 landing.innerHTML='<div class="ldvGuideBrand"><div><strong>LEDOVIA | Survival Guides</strong><div><span>SURVIVAL / PREPAREDNESS / SAFETY</span></div></div></div><div class="ldvGuideGrid"></div><p class="ldvGuideNote">Online references require internet. Checklist data stays on this device. No premium access or offline article downloads are active.</p>';
 const grid=landing.querySelector('.ldvGuideGrid');
 const cards=[
 ['first','♡','First Aid','guides','First Aid'],
 ['shelter','⌂','Shelter','guides','Shelter Building'],
 ['water','♧','Water & Food','guides','Water Purification'],
 ['fire','♨','Fire & Warmth','guides','Fire Starting'],
 ['navigation','◉','Navigation','guides','Navigation'],
 ['weather','⚡','Weather & Hazards','hazards',''],
 ['checklists','☑','Preparedness Checklists','lists',''],
 ['library','⇩','Offline Guide Library','library','']
 ];
 const details=document.createElement('details');details.className='ldvHubDetails';
 const summary=document.createElement('summary');summary.textContent='Existing Survival Hub tools';details.append(summary);
 oldNodes.forEach(n=>details.append(n));panel.append(landing,details);
 cards.forEach(([key,icon,label,view,category])=>{
  const b=document.createElement('button');b.type='button';b.className='ldvGuideCard'+(['checklists','library'].includes(key)?' ldvWide':'');
  b.dataset.guide=key;b.setAttribute('aria-label','Open '+label);
  const subtitle=key==='checklists'?'Go bags, home, vehicle & more':key==='library'?'Manage backups and offline resources':'';
  b.innerHTML='<span class="ldvIcon" aria-hidden="true">'+icon+'</span><span class="ldvLabel">'+label+(subtitle?'<small>'+subtitle+'</small>':'')+'</span>';
  b.addEventListener('click',()=>{
   if(view==='hazards'){const tab=document.getElementById('tab-hazards');if(tab)tab.click();return;}
   details.open=true;
   const nav=details.querySelector('.survivalSubnav [data-view="'+view+'"]');if(nav)nav.click();
   if(category){const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value===category)){select.value=category;select.dispatchEvent(new Event('change',{bubbles:true}));}}
   details.scrollIntoView({block:'start',behavior:'auto'});
  });
  grid.append(b);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));else setTimeout(init,0);
})();
