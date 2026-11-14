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
 ['checklists','☑','Preparedness Checklists','lists',''],
 ['library','⇩','Offline Guide Library','library',''],
 ['first','♡','First Aid','guides','First Aid'],
 ['shelter','⌂','Shelter','guides','Shelter Building'],
 ['water','♧','Water & Food','guides','Water Purification'],
 ['fire','♨','Fire & Warmth','guides','Fire Starting'],
 ['navigation','◉','Navigation','guides','Navigation'],
 ['weather','⚡','Weather & Hazards','hazards','']
 ];
 const details=document.createElement('section');details.className='ldvHubDetails';details.hidden=true;
 const back=document.createElement('button');back.type='button';back.className='ldvGuideBack';back.textContent='← All Survival Guides';
 back.addEventListener('click',()=>{details.hidden=true;waterHome.hidden=true;original.hidden=false;landing.hidden=false;landing.scrollIntoView({block:'start'});});
 const heading=document.createElement('h2');heading.className='ldvSectionHeading';details.append(back,heading);
 const waterHome=document.createElement('section');waterHome.className='ldvWaterHome';waterHome.hidden=true;
 waterHome.innerHTML='<button type="button" class="ldvWaterEmergency"><strong>⚠ Start Here: Emergency Priorities</strong><span>What to do when safe drinking water or food is limited.</span><small>Essential offline guide · Content coming soon</small></button><h3>Water Survival</h3><div class="ldvWaterTiles"></div><h3>Food Survival</h3><div class="ldvFoodTiles"></div><div class="ldvWaterFooter"><span>↓ Downloadable guides will be added after review</span><button type="button" class="ldvOpenExisting">Open Existing Water Guides →</button></div><p class="ldvWaterPending" role="status" hidden></p>';
 const waterItems=[['Purify Water','Boiling, filters, disinfection','💧'],['Find Water','Sources, collection, risks','🏞️'],['Build a Filter','Prefiltering and limitations','⚙️'],['Store Water','Containers, sanitation','🚰']];
 const foodItems=[['Wild Game Preparation','Approved visual concepts · guides pending','🦌'],['Off-Grid Cooking','Fire, fuel, safe temperatures','🔥'],['Preserve Food','Drying, smoking, storage','🥫'],['Wild Food Safety','Identification and hazards','🌿']];
 function addWaterTiles(items,target){items.forEach(([name,sub,icon])=>{const tile=document.createElement('button');tile.type='button';tile.className='ldvWaterTile';tile.innerHTML='<span class="ldvWaterTileArt" aria-hidden="true">'+icon+'</span><strong></strong><small></small>';tile.querySelector('strong').textContent=name;tile.querySelector('small').textContent=sub;tile.addEventListener('click',()=>{const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent=name+' — guide content will be added after review. No offline download is available yet.';msg.hidden=false;msg.scrollIntoView({block:'nearest'});});target.append(tile);});}
 addWaterTiles(waterItems,waterHome.querySelector('.ldvWaterTiles'));addWaterTiles(foodItems,waterHome.querySelector('.ldvFoodTiles'));
 waterHome.querySelector('.ldvWaterEmergency').addEventListener('click',()=>{const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent='Emergency Priorities — content pending safety review. For now, use Open Existing Water Guides below.';msg.hidden=false;});
 waterHome.querySelector('.ldvOpenExisting').addEventListener('click',()=>{waterHome.hidden=true;original.hidden=false;heading.textContent='Water & Food · Existing Guides';const nav=details.querySelector('.survivalSubnav [data-view="guides"]');if(nav)nav.click();const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value==='Water Purification')){select.value='Water Purification';select.dispatchEvent(new Event('change',{bubbles:true}));}});
 const original=document.createElement('div');original.className='ldvOriginalHub';
 oldNodes.forEach(n=>original.append(n));details.append(waterHome,original);panel.append(landing,details);
 cards.forEach(([key,icon,label,view,category])=>{
  const b=document.createElement('button');b.type='button';b.className='ldvGuideCard'+(['checklists','library'].includes(key)?' ldvWide':'');
  b.dataset.guide=key;b.setAttribute('aria-label','Open '+label);
  const subtitle=key==='checklists'?'Go bags, home, vehicle & more':key==='library'?'Manage backups and offline resources':'';
  b.innerHTML='<span class="ldvIcon" aria-hidden="true">'+icon+'</span><span class="ldvLabel">'+label+(subtitle?'<small>'+subtitle+'</small>':'')+'</span>';
  b.addEventListener('click',()=>{
   if(view==='hazards'){const tab=document.getElementById('tab-hazards');if(tab)tab.click();return;}
   heading.textContent=key==='water'?'Water/Food Safety & Preparation':label;
   landing.hidden=true;details.hidden=false;waterHome.hidden=key!=='water';original.hidden=key==='water';
   if(key==='water'){details.scrollIntoView({block:'start',behavior:'auto'});return;}
   const nav=details.querySelector('.survivalSubnav [data-view="'+view+'"]');if(nav)nav.click();
   if(category){const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value===category)){select.value=category;select.dispatchEvent(new Event('change',{bubbles:true}));}}
   details.scrollIntoView({block:'start',behavior:'auto'});
  });
  grid.append(b);
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));else setTimeout(init,0);
})();
