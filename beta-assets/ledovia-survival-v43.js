/* Ledovia Beta v43: presentation-only landing. Preserve the original Survival Hub DOM and event handlers. */
(()=>{'use strict';
function init(){
 const panel=document.getElementById('panel-survival');
 if(!panel||panel.querySelector('.ldvGuideLanding')||!panel.querySelector('.survivalSubnav'))return;
 const oldNodes=[...panel.childNodes];
 const landing=document.createElement('section');landing.className='ldvGuideLanding';
 landing.innerHTML='<div class="ldvGuideBrand"><div><strong>LEDOVIA | Survival Guides</strong><div><span>SURVIVAL / PREPAREDNESS / SAFETY</span></div></div></div><div class="ldvGuideGrid"></div><p class="ldvGuideNote">Online references require internet. Checklist data stays on this device. No premium access or offline article downloads are active.</p>';
 const grid=landing.querySelector('.ldvGuideGrid');
 const rememberPage=key=>{try{sessionStorage.setItem('ledovia-survival-page',key)}catch{}};
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
 back.addEventListener('click',()=>{details.hidden=true;waterHome.hidden=true;original.hidden=false;landing.hidden=false;details.classList.remove('ldvWaterMode');game.hidden=true;rememberPage('landing');landing.scrollIntoView({block:'start'});});
 const heading=document.createElement('h2');heading.className='ldvSectionHeading';details.append(back,heading);
 const waterHomeButton=document.createElement('button');waterHomeButton.type='button';waterHomeButton.className='ldvWaterHomeButton';waterHomeButton.setAttribute('aria-label','Go to Ledovia Home');waterHomeButton.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/></svg><span>Home</span>';
 waterHomeButton.addEventListener('click',()=>{rememberPage('landing');if(window.GridDownTabs&&typeof window.GridDownTabs.activate==='function')window.GridDownTabs.activate('home');else document.querySelector('[data-tab="home"],#tab-home')?.click();});
 details.append(waterHomeButton);
 const waterHome=document.createElement('section');waterHome.className='ldvWaterHome';waterHome.hidden=true;
 waterHome.innerHTML='<button type="button" class="ldvWaterEmergency"><strong>⚠ Start Here: Emergency Priorities</strong><span>What to do when safe drinking water or food is limited.</span><small>Essential offline guide · Content coming soon</small></button><h3>Water Survival</h3><div class="ldvWaterTiles"></div><h3>Food Survival</h3><div class="ldvFoodTiles"></div><div class="ldvWaterFooter"><span>↓ Downloadable guides will be added after review</span><button type="button" class="ldvOpenExisting">Open Existing Water Guides →</button></div><p class="ldvWaterPending" role="status" hidden></p>';
 const waterItems=[['Purify Water','Boiling, filters, disinfection','💧'],['Find Water','Sources, collection, risks','🏞️'],['Build a Filter','Prefiltering and limitations','⚙️'],['Store Water','Containers, sanitation','🚰']];
 const foodItems=[['Wild Game Preparation','Approved visual concepts · guides pending','🦌'],['Off-Grid Cooking','Fire, fuel, safe temperatures','🔥'],['Preserve Food','Drying, smoking, storage','🥫'],['Wild Food Safety','Identification and hazards','🌿']];
 function addWaterTiles(items,target){items.forEach(([name,sub,icon])=>{const tile=document.createElement('button');tile.type='button';tile.className='ldvWaterTile';if(name==='Purify Water')tile.classList.add('ldvPhotoPurify');if(name==='Find Water')tile.classList.add('ldvPhotoFind');const photoNames={'Build a Filter':'ldvPhotoFilter','Store Water':'ldvPhotoStore','Wild Game Preparation':'ldvPhotoGame','Off-Grid Cooking':'ldvPhotoCooking','Preserve Food':'ldvPhotoPreserve','Wild Food Safety':'ldvPhotoForage'};if(photoNames[name])tile.classList.add(photoNames[name]);tile.innerHTML='<span class="ldvWaterTileArt" aria-hidden="true">'+icon+'</span><strong></strong><small></small>';tile.querySelector('strong').textContent=name;tile.querySelector('small').textContent=sub;tile.addEventListener('click',()=>{if(name==='Wild Game Preparation'){openGame();return;}const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent=name+' — guide content will be added after review. No offline download is available yet.';msg.hidden=false;msg.scrollIntoView({block:'nearest'});});target.append(tile);});}
 addWaterTiles(waterItems,waterHome.querySelector('.ldvWaterTiles'));addWaterTiles(foodItems,waterHome.querySelector('.ldvFoodTiles'));
 waterHome.querySelector('.ldvWaterEmergency').addEventListener('click',()=>{const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent='Emergency Priorities — content pending safety review. For now, use Open Existing Water Guides below.';msg.hidden=false;});
 waterHome.querySelector('.ldvOpenExisting').addEventListener('click',()=>{waterHome.hidden=true;original.hidden=false;heading.textContent='Water & Food · Existing Guides';const nav=details.querySelector('.survivalSubnav [data-view="guides"]');if(nav)nav.click();const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value==='Water Purification')){select.value='Water Purification';select.dispatchEvent(new Event('change',{bubbles:true}));}});
 const game=document.createElement('section');game.className='ldvGameHub';game.hidden=true;
 const animals=[['Deer','file_00000000246c81f6a0455965dc0068ed.png','🦌'],['Elk','file_000000003cec81f69178979ef5be67f2.png','🦌'],['Moose','file_00000000a75881f6994245f9d61436d3.png','🫎'],['Rabbit & Hare','file_0000000000d481f6b8423f26d141f5ea.png','🐇'],['Wild Hog','file_00000000d67081f6beb1db3950af5072.png','🐗'],['Squirrel','file_000000007c1081f689af8c15e11cdf4a.png','🐿️'],['Turkey & Upland Birds','file_00000000c43c81f680c991b18c1e7e85.png','🦃'],['Duck & Waterfowl','file_0000000019bc81f6beb2525cf74f8931.png','🦆']];
 game.innerHTML='<div class="ldvGameSelect"><button type="button" class="ldvGameToGuides">← Survival Guides</button><div class="ldvGameAlert"><strong>⚠ Before You Begin</strong><p>Check for signs of disease, avoid contamination, and plan safe meat cooling. Illustrated drafts require final safety review.</p></div><h3>Choose Your Animal</h3><div class="ldvGameGrid"></div></div><div class="ldvGameAnimal" hidden><button type="button" class="ldvGameBack">← All Animals</button><h3 class="ldvGameAnimalTitle"></h3><button type="button" class="ldvGameChoice ldvGridChoice"><strong>⛰ Grid-Off Survival Guide</strong><small>No electricity · Limited equipment · Illustrated steps</small></button><button type="button" class="ldvGameChoice ldvModernChoice"><strong>❄ Modern Convenience Guide</strong><small>Refrigeration · Clean water · Standard equipment — coming soon</small></button><p class="ldvGameNotice" role="status"></p><div class="ldvGameArtwork" hidden><p>Illustrated draft — verify all food-safety instructions before relying on this guide.</p><img alt="Illustrated field dressing guide, draft pending safety review" loading="lazy"></div></div>';
 const gameGrid=game.querySelector('.ldvGameGrid'),gameSelect=game.querySelector('.ldvGameSelect'),animalPanel=game.querySelector('.ldvGameAnimal'),art=game.querySelector('.ldvGameArtwork'),notice=game.querySelector('.ldvGameNotice');
 const viewer=document.createElement('div');viewer.className='ldvGameViewer';viewer.hidden=true;viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Illustrated hunting guide viewer');viewer.innerHTML='<div class="ldvGameViewerBar"><button type="button" class="ldvViewerClose">← Back</button><strong class="ldvViewerTitle">Illustrated Guide</strong><a class="ldvViewerDownload" download>↓ Download</a></div><div class="ldvViewerControls"><button type="button" class="ldvZoomOut" aria-label="Zoom out">−</button><span class="ldvZoomValue">100%</span><button type="button" class="ldvZoomIn" aria-label="Zoom in">+</button></div><div class="ldvViewerScroll"><img alt="Illustrated guide, draft pending safety review"></div><p class="ldvViewerWarning">Illustrated draft — food-safety verification pending. Do not rely on unverified instructions.</p>';
 document.body.append(viewer);
 const viewerImg=viewer.querySelector('img'),viewerScroll=viewer.querySelector('.ldvViewerScroll');let zoom=1;
 function applyViewerSize(resetScroll=false){
  if(viewer.hidden||!viewerImg.naturalWidth||!viewerImg.naturalHeight)return;
  const w=viewerScroll.clientWidth;if(!w)return;
  viewerImg.style.width=(w*zoom)+'px';
  viewer.querySelector('.ldvZoomValue').textContent=Math.round(zoom*100)+'%';
  if(resetScroll)viewerScroll.scrollTo(0,0);
 }
 function setZoom(n){zoom=Math.min(8,Math.max(1,n));applyViewerSize();}
 const viewerHistoryKey='ldvWildGameViewer';
 function closeViewer(){viewer.hidden=true;document.body.classList.remove('ldvViewerActive');}
 function backFromViewer(){
  if(viewer.hidden)return;
  if(history.state&&history.state[viewerHistoryKey])history.back();
  else closeViewer();
 }
 window.addEventListener('popstate',()=>{if(!viewer.hidden)closeViewer();});
 viewer.querySelector('.ldvViewerClose').onclick=backFromViewer;
 viewer.querySelector('.ldvZoomIn').onclick=()=>setZoom(zoom*1.5);
 viewer.querySelector('.ldvZoomOut').onclick=()=>setZoom(zoom/1.5);
 viewerImg.addEventListener('load',()=>applyViewerSize(true));
 window.addEventListener('resize',()=>{if(!viewer.hidden)requestAnimationFrame(()=>applyViewerSize());});
 viewer.addEventListener('keydown',e=>{if(e.key==='Escape')closeViewer();});
 function openViewer(name,file){viewer.querySelector('.ldvViewerTitle').textContent=name+' · Grid-Off';viewerImg.alt=name+' illustrated Grid-Off guide draft';viewer.querySelector('.ldvViewerDownload').href='./'+file;viewer.querySelector('.ldvViewerDownload').download='Ledovia-'+name.replace(/[^a-z0-9]+/gi,'-')+'-Grid-Off.png';viewer.hidden=false;document.body.classList.add('ldvViewerActive');try{history.pushState({...((history.state&&typeof history.state==='object')?history.state:{}),[viewerHistoryKey]:true},'',location.href);}catch{}zoom=1;viewerImg.src='./'+file;viewer.querySelector('.ldvViewerClose').focus();requestAnimationFrame(()=>applyViewerSize(true));}
 function showGameIndex(){gameSelect.hidden=false;animalPanel.hidden=true;art.hidden=true;rememberPage('water-game');}
 game.querySelector('.ldvGameToGuides').addEventListener('click',()=>{game.hidden=true;waterHome.hidden=true;details.hidden=true;landing.hidden=false;details.classList.remove('ldvWaterMode');rememberPage('landing');landing.scrollIntoView({block:'start',behavior:'auto'});});
 game.querySelector('.ldvGameBack').addEventListener('click',showGameIndex);
 animals.forEach(([name,file,emoji])=>{const btn=document.createElement('button');btn.type='button';btn.className='ldvGameAnimalTile';btn.innerHTML='<span class="ldvGameAnimalPhoto" aria-hidden="true"></span><strong></strong>';btn.querySelector('strong').textContent=name;btn.querySelector('.ldvGameAnimalPhoto').textContent=emoji;btn.addEventListener('click',()=>{gameSelect.hidden=true;animalPanel.hidden=false;art.hidden=true;game.querySelector('.ldvGameAnimalTitle').textContent=name+' Preparation Guide';notice.textContent='Choose a guide option below.';game.querySelector('.ldvGridChoice').onclick=()=>{openViewer(name,file);notice.textContent='Grid-Off illustrated draft. Safety validation is still pending.';};game.querySelector('.ldvModernChoice').onclick=()=>{art.hidden=true;notice.textContent='Modern Convenience guide content is not yet available.';};rememberPage('water-game-'+animals.indexOf(animals.find(a=>a[0]===name)));});gameGrid.append(btn);});
 function openGame(){waterHome.hidden=true;game.hidden=false;gameSelect.hidden=false;animalPanel.hidden=true;heading.textContent='Wild Game Preparation';rememberPage('water-game');details.scrollIntoView({block:'start'});}
 const original=document.createElement('div');original.className='ldvOriginalHub';
 oldNodes.forEach(n=>original.append(n));details.append(waterHome,game,original);panel.append(landing,details);
 cards.forEach(([key,icon,label,view,category])=>{
  const b=document.createElement('button');b.type='button';b.className='ldvGuideCard'+(['checklists','library'].includes(key)?' ldvWide':'');
  b.dataset.guide=key;b.setAttribute('aria-label','Open '+label);
  const subtitle=key==='checklists'?'Go bags, home, vehicle & more':key==='library'?'Manage backups and offline resources':'';
  b.innerHTML='<span class="ldvIcon" aria-hidden="true">'+icon+'</span><span class="ldvLabel">'+label+(subtitle?'<small>'+subtitle+'</small>':'')+'</span>';
  b.addEventListener('click',()=>{
   if(view==='hazards'){const tab=document.getElementById('tab-hazards');if(tab)tab.click();return;}
   heading.textContent=key==='water'?'Water/Food Safety & Preparation':label;
   landing.hidden=true;details.hidden=false;details.classList.toggle('ldvWaterMode',key==='water');waterHome.hidden=key!=='water';game.hidden=true;original.hidden=key==='water';
   rememberPage(key);
   if(key==='water'){details.scrollIntoView({block:'start',behavior:'auto'});return;}
   const nav=details.querySelector('.survivalSubnav [data-view="'+view+'"]');if(nav)nav.click();
   if(category){const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value===category)){select.value=category;select.dispatchEvent(new Event('change',{bubbles:true}));}}
   details.scrollIntoView({block:'start',behavior:'auto'});
  });
  grid.append(b);
 });
 // Restore the last Survival Guides subpage after a browser refresh.
 if(document.getElementById('panel-survival')?.classList.contains('active')){
  let last='landing';try{last=sessionStorage.getItem('ledovia-survival-page')||'landing'}catch{}
  if(last.startsWith('water-game')){const card=grid.querySelector('[data-guide="water"]');if(card)card.click();openGame();const index=Number(last.split('-')[2]);if(Number.isInteger(index)&&index>=0&&index<animals.length)gameGrid.children[index].click();}else if(last!=='landing'){const card=grid.querySelector('[data-guide="'+last+'"]');if(card)card.click();}
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));else setTimeout(init,0);
})();
