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
 // Scoped navigation contract: every deeper Survival Guides screen has a history entry.
 const navKey='ldvSurvivalRoute';
 let currentRoute='landing';
 function recordRoute(route){currentRoute=route;try{history.pushState({...((history.state&&typeof history.state==='object')?history.state:{}),[navKey]:route},'',location.href);}catch{}}
 function returnRoute(fallback){if(history.state&&history.state[navKey]&&history.length>1)history.back();else renderRoute(fallback);}
 function renderRoute(route){
  currentRoute=route;
  if(route==='landing'){viewer.hidden=true;document.body.classList.remove('ldvViewerActive');game.hidden=true;waterHome.hidden=true;details.hidden=true;landing.hidden=false;details.classList.remove('ldvWaterMode');rememberPage('landing');return;}
  landing.hidden=true;details.hidden=false;details.classList.add('ldvWaterMode');original.hidden=true;
  if(route==='water'){game.hidden=true;waterHome.hidden=false;heading.textContent='Water/Food Safety & Preparation';rememberPage('water');return;}
  waterHome.hidden=true;game.hidden=false;heading.textContent='Wild Game Preparation';
  if(route==='game'){gameSelect.hidden=false;animalPanel.hidden=true;rememberPage('water-game');return;}
  if(route.startsWith('animal-')){const i=Number(route.slice(7));if(Number.isInteger(i)&&i>=0&&i<animals.length){gameGrid.children[i].click();return;}}
 }

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
 back.addEventListener('click',()=>returnRoute('landing'));
 const heading=document.createElement('h2');heading.className='ldvSectionHeading';details.append(back,heading);
 const waterHomeButton=document.createElement('button');waterHomeButton.type='button';waterHomeButton.className='ldvWaterHomeButton';waterHomeButton.setAttribute('aria-label','Go to Ledovia Home');waterHomeButton.innerHTML='<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/></svg><span>Home</span>';
 waterHomeButton.addEventListener('click',()=>{rememberPage('landing');if(window.GridDownTabs&&typeof window.GridDownTabs.activate==='function')window.GridDownTabs.activate('home');else document.querySelector('[data-tab="home"],#tab-home')?.click();});
 details.append(waterHomeButton);
 const waterHome=document.createElement('section');waterHome.className='ldvWaterHome';waterHome.hidden=true;
 waterHome.innerHTML='<div class="ldvWaterHero" aria-label="Water and food safety preparedness"><span class="ldvWaterHeroKicker">SURVIVAL GUIDE</span><strong>Water/Food</strong><em>Safety &amp; Preparation</em><span class="ldvWaterHeroSub">Clean Water · Safe Food · Prepared for Emergencies</span></div><button type="button" class="ldvWaterEmergency"><strong>⚠ Start Here: Emergency Priorities</strong><span>What to do when safe drinking water or food is limited.</span><small>Essential offline guide · Content coming soon</small></button><h3>Water Survival</h3><div class="ldvWaterTiles"></div><h3>Food Survival</h3><div class="ldvFoodTiles"></div><div class="ldvWaterFooter"><span>↓ Downloadable guides will be added after review</span><button type="button" class="ldvOpenExisting">Open Existing Water Guides →</button></div><p class="ldvWaterPending" role="status" hidden></p>';
 const waterItems=[['Purify Water','Boiling, filters, disinfection','💧'],['Find Water','Sources, collection, risks','🏞️'],['Build a Filter','Prefiltering and limitations','⚙️'],['Store Water','Containers, sanitation','🚰']];
 const foodItems=[['Wild Game Preparation','Approved visual concepts · guides pending','🦌'],['Off-Grid Cooking','Fire, fuel, safe temperatures','🔥'],['Preserve Food','Drying, smoking, storage','🥫'],['Wild Food Safety','Identification and hazards','🌿']];
 function addWaterTiles(items,target){items.forEach(([name,sub,icon])=>{const tile=document.createElement('button');tile.type='button';tile.className='ldvWaterTile';if(name==='Purify Water')tile.classList.add('ldvPhotoPurify');if(name==='Find Water')tile.classList.add('ldvPhotoFind');const photoNames={'Build a Filter':'ldvPhotoFilter','Store Water':'ldvPhotoStore','Wild Game Preparation':'ldvPhotoGame','Off-Grid Cooking':'ldvPhotoCooking','Preserve Food':'ldvPhotoPreserve','Wild Food Safety':'ldvPhotoForage'};if(photoNames[name])tile.classList.add(photoNames[name]);tile.innerHTML='<span class="ldvWaterTileArt" aria-hidden="true">'+icon+'</span><strong></strong><small></small>';tile.querySelector('strong').textContent=name;tile.querySelector('small').textContent=sub;tile.addEventListener('click',()=>{if(name==='Wild Game Preparation'){openGame();return;}if(name==='Purify Water'){openViewer('Boiling Water','a_vertical_infographic_poster_in_the_same_style_as.png');return;}if(name==='Build a Filter'){openViewer('Emergency Water Prefiltering','Ledovia_Emergency_Water_Filtration_Guide.png');return;}if(name==='Find Water'){openViewer('Find Water in the Wild','Ledovia_Find_Water_in_the_Wild_Guide.png');return;}if(name==='Store Water'){openViewer('Water Storage','file_00000000c23881f6aada86093724af1e.png');return;}const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent=name+' — guide content will be added after review. No offline download is available yet.';msg.hidden=false;msg.scrollIntoView({block:'nearest'});});target.append(tile);});}
 addWaterTiles(waterItems,waterHome.querySelector('.ldvWaterTiles'));addWaterTiles(foodItems,waterHome.querySelector('.ldvFoodTiles'));
 waterHome.querySelector('.ldvWaterEmergency').addEventListener('click',()=>{const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent='Emergency Priorities — content pending safety review. For now, use Open Existing Water Guides below.';msg.hidden=false;});
 waterHome.querySelector('.ldvOpenExisting').addEventListener('click',()=>{waterHome.hidden=true;original.hidden=false;heading.textContent='Water & Food · Existing Guides';const nav=details.querySelector('.survivalSubnav [data-view="guides"]');if(nav)nav.click();const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value==='Water Purification')){select.value='Water Purification';select.dispatchEvent(new Event('change',{bubbles:true}));}});
 const game=document.createElement('section');game.className='ldvGameHub';game.hidden=true;
 const animals=[['Deer','file_00000000c2c881f6b9ab370d60c71bc3.png','🦌'],['Elk','file_00000000767881f69479abb2f89053cd.png','🦌'],['Moose','file_00000000993481f69e46006ac02ef6e3.png','🫎'],['Rabbit & Hare','file_000000000e1081f69c57192e464d6b0d.png','🐇'],['Wild Hog','file_000000006ea881f6a47dc0aeaebeec0d.png','🐗'],['Squirrel','file_00000000e6cc81f6b27e28cba3b62ffe.png','🐿️'],['Turkey & Upland Birds','file_00000000d5dc81f6ac529bf5b980bdde.png','🦃'],['Duck & Waterfowl','file_00000000509881f69eae02a8807a6032.png','🦆'],['Caribou','file_00000000148081f69c05b4f562c22625.png',''],['Black Bear','file_00000000ccec81f69449d3cb58586060.png','']];
 game.innerHTML='<div class="ldvGameSelect"><button type="button" class="ldvGameToGuides">← Survival Guides</button><button type="button" class="ldvGameAnimalTile ldvHunterSafetyTile"><span class="ldvGameAnimalPhoto" aria-hidden="true"></span><strong>Hunter Safety — Start Here</strong></button><h3>Choose Your Animal</h3><div class="ldvGameGrid"></div></div><div class="ldvGameAnimal" hidden><button type="button" class="ldvGameBack">← All Animals</button><h3 class="ldvGameAnimalTitle"></h3><button type="button" class="ldvGameChoice ldvGridChoice"><strong>⛰ Open Emergency Survival Guide</strong><small>Offline illustrated steps · Limited equipment · No electricity required</small></button><p class="ldvGameNotice" role="status"></p><div class="ldvGameArtwork" hidden><p>Illustrated draft — verify all food-safety instructions before relying on this guide.</p><img alt="Illustrated field dressing guide, draft pending safety review" loading="lazy"></div></div>';
 game.querySelector('.ldvHunterSafetyTile').addEventListener('click',()=>openViewer('Hunter Safety','file_00000000b55081f6bb8c7c5203b847cd.png'));
 const gameGrid=game.querySelector('.ldvGameGrid'),gameSelect=game.querySelector('.ldvGameSelect'),animalPanel=game.querySelector('.ldvGameAnimal'),art=game.querySelector('.ldvGameArtwork'),notice=game.querySelector('.ldvGameNotice');
 const viewer=document.createElement('div');viewer.className='ldvGameViewer';viewer.hidden=true;viewer.setAttribute('role','dialog');viewer.setAttribute('aria-modal','true');viewer.setAttribute('aria-label','Illustrated hunting guide viewer');viewer.innerHTML='<div class="ldvGameViewerBar"><button type="button" class="ldvViewerClose" aria-label="Back to previous screen">←</button><div class="ldvViewerHeading"><strong class="ldvViewerTitle">Illustrated Guide</strong><small>EMERGENCY SURVIVAL GUIDE</small></div><a class="ldvViewerDownload" aria-label="Download offline guide" download>↓</a></div><div class="ldvViewerControls"><button type="button" class="ldvZoomOut" aria-label="Zoom out">−</button><span class="ldvZoomValue">100%</span><button type="button" class="ldvZoomIn" aria-label="Zoom in">+</button></div><div class="ldvViewerScroll"><img alt="Illustrated guide, draft pending safety review"></div><p class="ldvViewerWarning">Illustrated emergency reference — safety verification pending. Follow current official guidance when available.</p>';
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
 window.addEventListener('popstate',e=>{if(!viewer.hidden){closeViewer();return;}const route=e.state&&e.state[navKey];if(route)renderRoute(route);else if(currentRoute!=='landing')renderRoute('landing');});
 viewer.querySelector('.ldvViewerClose').onclick=backFromViewer;
 viewer.querySelector('.ldvZoomIn').onclick=()=>setZoom(zoom*1.5);
 viewer.querySelector('.ldvZoomOut').onclick=()=>setZoom(zoom/1.5);
 viewerImg.addEventListener('load',()=>applyViewerSize(true));
 window.addEventListener('resize',()=>{if(!viewer.hidden)requestAnimationFrame(()=>applyViewerSize());});
 viewer.addEventListener('keydown',e=>{if(e.key==='Escape')closeViewer();});
 function openViewer(name,file){viewer.querySelector('.ldvViewerTitle').textContent=name;viewerImg.alt=name+' illustrated Grid-Off guide draft';viewer.querySelector('.ldvViewerDownload').href='./'+file;viewer.querySelector('.ldvViewerDownload').download='Ledovia-'+name.replace(/[^a-z0-9]+/gi,'-')+'-Grid-Off.png';viewer.hidden=false;document.body.classList.add('ldvViewerActive');try{history.pushState({...((history.state&&typeof history.state==='object')?history.state:{}),[viewerHistoryKey]:true},'',location.href);}catch{}zoom=1;viewerImg.src='./'+file;viewer.querySelector('.ldvViewerClose').focus();requestAnimationFrame(()=>applyViewerSize(true));}
 function showGameIndex(){gameSelect.hidden=false;animalPanel.hidden=true;art.hidden=true;rememberPage('water-game');}
 game.querySelector('.ldvGameToGuides').addEventListener('click',()=>returnRoute('water'));
 game.querySelector('.ldvGameBack').addEventListener('click',()=>returnRoute('game'));
 animals.forEach(([name,file,emoji])=>{const btn=document.createElement('button');btn.type='button';btn.className='ldvGameAnimalTile';btn.innerHTML='<span class="ldvGameAnimalPhoto" aria-hidden="true"></span><strong></strong>';btn.querySelector('strong').textContent=name;if(file){btn.querySelector('.ldvGameAnimalPhoto').textContent=emoji;}else{btn.classList.add('ldvGamePhotoPending');btn.querySelector('.ldvGameAnimalPhoto').textContent='PHOTO PENDING';btn.setAttribute('aria-label',name+' — guide and animal photo pending upload');}btn.addEventListener('click',()=>{showGameIndex();if(file){openViewer(name,file);}else{gameSelect.hidden=false;notice.textContent=name+' guide and animal photo are pending upload and safety review.';const alert=gameSelect.querySelector('.ldvGameAlert p');if(alert)alert.textContent=name+' guide and animal photo are pending upload and safety review. Other available guides remain accessible.';}});gameGrid.append(btn);});
 function openGame(){waterHome.hidden=true;game.hidden=false;gameSelect.hidden=false;animalPanel.hidden=true;heading.textContent='Wild Game Preparation';rememberPage('water-game');recordRoute('game');details.scrollIntoView({block:'start'});}
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
   if(key==='water'){recordRoute('water');details.scrollIntoView({block:'start',behavior:'auto'});return;}
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
