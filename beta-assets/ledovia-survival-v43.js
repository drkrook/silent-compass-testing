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
  if(route==='landing'){viewer.hidden=true;document.body.classList.remove('ldvViewerActive');game.hidden=true;waterHome.hidden=true;cooking.hidden=true;forage.hidden=true;details.hidden=true;landing.hidden=false;details.classList.remove('ldvWaterMode');rememberPage('landing');return;}
  landing.hidden=true;details.hidden=false;details.classList.add('ldvWaterMode');original.hidden=true;
  if(route==='cooking'){game.hidden=true;forage.hidden=true;waterHome.hidden=true;cooking.hidden=false;heading.textContent='Off-Grid Cooking';rememberPage('water-cooking');return;}
  cooking.hidden=true;forage.hidden=true;
  if(route==='forage'){game.hidden=true;waterHome.hidden=true;forage.hidden=false;heading.textContent='Wild Food Safety';rememberPage('water-forage');return;}
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
 // Reuse the existing global Ledovia menu and Home handlers; never duplicate the drawer.
 const waterNav=document.createElement('div');waterNav.className='ldvWaterTopNav';waterNav.setAttribute('aria-label','Water and food navigation');
 const waterMenu=document.createElement('button');waterMenu.type='button';waterMenu.className='ldvWaterMenuControl';waterMenu.setAttribute('aria-label','Open Ledovia navigation menu');waterMenu.setAttribute('aria-controls','ledoviaMenuPanel');waterMenu.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
 waterMenu.addEventListener('click',()=>{const original=document.getElementById('ledoviaMenuButton');if(original)original.click();});
 const waterNavHome=document.createElement('button');waterNavHome.type='button';waterNavHome.className='ldvWaterNavHome';waterNavHome.setAttribute('aria-label','Go to Ledovia Home');waterNavHome.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9"/><path d="M9 21v-7h6v7"/></svg>';
 waterNavHome.addEventListener('click',()=>{const original=document.getElementById('ledoviaBellButton');if(original)original.click();else waterHomeButton.click();});
 waterNav.append(waterMenu,waterNavHome);details.prepend(waterNav);
 const waterHome=document.createElement('section');waterHome.className='ldvWaterHome';waterHome.hidden=true;
 waterHome.innerHTML='<div class="ldvWaterHero" aria-label="Water and food safety preparedness"><span class="ldvWaterHeroKicker">SURVIVAL GUIDE</span><strong>Water/Food</strong><em>Safety &amp; Preparation</em><span class="ldvWaterHeroSub">Clean Water · Safe Food · Prepared for Emergencies</span></div><button type="button" class="ldvWaterEmergency"><strong>⚠ Start Here: Emergency Priorities</strong><span>What to do when safe drinking water or food is limited.</span><small>Essential offline guide · Content coming soon</small></button><h3>Water Survival</h3><div class="ldvWaterTiles"></div><h3>Food Survival</h3><div class="ldvFoodTiles"></div><div class="ldvWaterFooter"><span>↓ Downloadable guides will be added after review</span><button type="button" class="ldvOpenExisting">Open Existing Water Guides →</button></div><p class="ldvWaterPending" role="status" hidden></p>';
 const waterItems=[['Purify Water','Boiling, filters, disinfection','💧'],['Find Water','Sources, collection, risks','🏞️'],['Build a Filter','Prefiltering and limitations','⚙️'],['Store Water','Containers, sanitation','🚰']];
 const foodItems=[['Wild Game Preparation','Approved visual concepts · guides pending','🦌'],['Off-Grid Cooking','Fire, fuel, safe temperatures','🔥'],['Preserve Food','Drying, smoking, storage','🥫'],['Wild Food Safety','Identification and hazards','🌿']];
 function addWaterTiles(items,target){items.forEach(([name,sub,icon])=>{const tile=document.createElement('button');tile.type='button';tile.className='ldvWaterTile';if(name==='Purify Water')tile.classList.add('ldvPhotoPurify');if(name==='Find Water')tile.classList.add('ldvPhotoFind');const photoNames={'Build a Filter':'ldvPhotoFilter','Store Water':'ldvPhotoStore','Wild Game Preparation':'ldvPhotoGame','Off-Grid Cooking':'ldvPhotoCooking','Preserve Food':'ldvPhotoPreserve','Wild Food Safety':'ldvPhotoForage'};if(photoNames[name])tile.classList.add(photoNames[name]);tile.innerHTML='<span class="ldvWaterTileArt" aria-hidden="true">'+icon+'</span><strong></strong><small></small>';tile.querySelector('strong').textContent=name;tile.querySelector('small').textContent=sub;tile.addEventListener('click',()=>{if(name==='Wild Game Preparation'){openGame();return;}if(name==='Off-Grid Cooking'){openCooking();return;}if(name==='Wild Food Safety'){openForage();return;}if(name==='Purify Water'){openViewer('Boiling Water','a_vertical_infographic_poster_in_the_same_style_as.png');return;}if(name==='Build a Filter'){openViewer('Emergency Water Prefiltering','Ledovia_Emergency_Water_Filtration_Guide.png');return;}if(name==='Find Water'){openViewer('Find Water in the Wild','Ledovia_Find_Water_in_the_Wild_Guide.png');return;}if(name==='Store Water'){openViewer('Water Storage','file_00000000c23881f6aada86093724af1e.png');return;}const msg=waterHome.querySelector('.ldvWaterPending');msg.textContent=name+' — guide content will be added after review. No offline download is available yet.';msg.hidden=false;msg.scrollIntoView({block:'nearest'});});target.append(tile);});}
 addWaterTiles(waterItems,waterHome.querySelector('.ldvWaterTiles'));addWaterTiles(foodItems,waterHome.querySelector('.ldvFoodTiles'));
 waterHome.querySelector('.ldvWaterEmergency').addEventListener('click',()=>openViewer('Emergency Priorities — Draft','ledovia-emergency-priorities.png'));waterHome.querySelector('.ldvWaterEmergency').innerHTML='<strong>Start Here — Emergency Priorities</strong><span>Safe Water · Food Safety · Immediate Survival Needs</span><small>Illustrated offline reference · Safety review pending</small>';
 waterHome.querySelector('.ldvOpenExisting').addEventListener('click',()=>{waterHome.hidden=true;original.hidden=false;heading.textContent='Water & Food · Existing Guides';const nav=details.querySelector('.survivalSubnav [data-view="guides"]');if(nav)nav.click();const select=details.querySelector('#guide-category');if(select&&[...select.options].some(o=>o.value==='Water Purification')){select.value='Water Purification';select.dispatchEvent(new Event('change',{bubbles:true}));}});
 const cooking=document.createElement('section');cooking.className='ldvCookingHub';cooking.hidden=true;
 cooking.innerHTML='<div class="ldvCookingHero"><span>SURVIVAL GUIDE</span><strong>Off-Grid Cooking</strong><em>Safe Meals · Simple Equipment · No Electricity</em></div><button type="button" class="ldvCookingSafety"><strong>⚠ Start Here — Cooking Safety</strong><span>Fire safety, carbon monoxide, safe food temperatures, fuel precautions, and cross-contamination.</span><small>Essential offline guide · Content coming soon</small></button><h3>Cooking Methods</h3><div class="ldvCookingGrid"></div><h3>Essential Cooking Guides</h3><div class="ldvCookingEssentials"></div><p class="ldvCookingPending" role="status" hidden></p>';
 const cookingMethods=[['Campfire Cooking','Coals, grills & fire pits'],['Camp Stoves','Propane, butane & liquid fuel'],['Dutch Oven Cooking','One-pot meals & baking'],['Solar Cooking','Sun-powered cooking & limitations'],['Wood-Burning Stoves','Efficient outdoor cooking'],['Foil & Grill Cooking','Minimal cookware']];
 const cookingEssentials=[['Safe Cooking Temperatures','Thermometers & safe internal temperatures'],['Emergency One-Pot Meals','Shelf-stable ingredients'],['No-Cook Emergency Meals','When fuel is unavailable'],['Cooking Wild Game & Fish','Species-specific safety']];
 function addCookingCards(items,selector){const target=cooking.querySelector(selector);items.forEach(([name,sub],i)=>{const btn=document.createElement('button');btn.type='button';btn.className='ldvCookingCard';btn.innerHTML='<span class="ldvCookingPhoto" aria-hidden="true"></span><strong></strong><small></small>';const cookingPhotos={'Campfire Cooking':'campfire-cooking.webp','Camp Stoves':'camp-stoves.webp','Dutch Oven Cooking':'dutch-oven-cooking.webp','Solar Cooking':'solar-cooking.webp','Wood-Burning Stoves':'wood-burning-stoves.webp','Foil & Grill Cooking':'foil-grill-cooking.webp','Safe Cooking Temperatures':'safe-cooking-temperatures.webp','Emergency One-Pot Meals':'emergency-one-pot-meals.webp','No-Cook Emergency Meals':'no-cook-emergency-meals.webp','Cooking Wild Game & Fish':'cooking-wild-game-fish.webp'};btn.querySelector('.ldvCookingPhoto').style.backgroundImage='url("'+cookingPhotos[name]+'")';btn.querySelector('strong').textContent=name;btn.querySelector('small').textContent=sub;btn.addEventListener('click',()=>{if(name==='Campfire Cooking'){openViewer(name,'file_000000001ba881f6b03e47e0b2c3a2ce.png');return;}const msg=cooking.querySelector('.ldvCookingPending');msg.textContent=name+' — illustrated offline guide coming after safety review.';msg.hidden=false;});target.append(btn)})}
 addCookingCards(cookingMethods,'.ldvCookingGrid');addCookingCards(cookingEssentials,'.ldvCookingEssentials');
 cooking.querySelector('.ldvCookingSafety').addEventListener('click',()=>openViewer('Cooking Safety Overview — Draft','file_000000006a2481f691149e0b7bd3e2de.png'));cooking.querySelector('.ldvCookingSafety small').textContent='Illustrated draft · Safety validation pending';
 function openCooking(){waterHome.hidden=true;game.hidden=true;cooking.hidden=false;original.hidden=true;heading.textContent='Off-Grid Cooking';rememberPage('water-cooking');recordRoute('cooking');details.scrollIntoView({block:'start'});}
 const forage=document.createElement('section');forage.className='ldvForageHub';forage.hidden=true;
 forage.innerHTML='<div class="ldvForageHero" role="img" aria-label="Wild Food Safety — Identify Carefully, Avoid Toxins, Prepare Safely"></div><button type="button" class="ldvForageSafety" aria-label="Start Here — Foraging Safety. Open illustrated safety guide."></button><h3>Wild Food Topics</h3><div class="ldvForageGrid"></div><p class="ldvForageWarning">Never eat a wild plant, berry, mushroom, or aquatic food unless its identity and safety are confirmed by a qualified local expert. Photos alone cannot establish edibility. Do not use a universal edibility test.</p><p class="ldvForagePending" role="status" hidden></p>';
 const forageItems=[['Edible Wild Plants','Identification and look-alikes','plants'],['Wild Berries & Fruit','Toxic look-alikes and risks','berries'],['Mushroom Safety','High-risk identification','mushrooms'],['Wild Nuts & Seeds','Identification and preparation','nuts'],['Fish & Aquatic Foods','Water quality and food safety','fish'],['Dangerous Look-Alikes','Recognize hazards and avoid exposure','hazards']];
 forageItems.forEach(([name,sub,photo])=>{const btn=document.createElement('button');btn.type='button';btn.className='ldvForageTile ldvForage-'+photo;btn.innerHTML='<span class="ldvForagePhoto" aria-hidden="true"><span>PHOTO PENDING</span></span><strong></strong><small></small>';btn.querySelector('strong').textContent=name;btn.querySelector('small').textContent=sub;btn.addEventListener('click',()=>{if(photo==='plants'){openPlantGuide();return;}const note=forage.querySelector('.ldvForagePending');note.textContent=name+' — safety-reviewed offline guide coming soon.';note.hidden=false;});forage.querySelector('.ldvForageGrid').append(btn)});
 forage.querySelector('.ldvForageSafety').addEventListener('click',()=>openViewer('Start Here — Foraging Safety','Foraging Safety Survival Guide Infographic.png'));
 function openForage(){waterHome.hidden=true;game.hidden=true;cooking.hidden=true;forage.hidden=false;original.hidden=true;heading.textContent='Wild Food Safety';rememberPage('water-forage');recordRoute('forage');details.scrollIntoView({block:'start'});}
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
  if(viewerImg.src.includes('ledovia-emergency-priorities.png')){emergencyWrap.style.width=(w*zoom)+'px';viewerImg.style.width='100%';}else{emergencyWrap.style.width=(w*zoom)+'px';viewerImg.style.width='100%';}
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
 const plantGuide=document.createElement('article');plantGuide.className='ldvPlantGuide';plantGuide.hidden=true;plantGuide.setAttribute('aria-label','Edible Wild Plants safety guide');plantGuide.innerHTML=`
 <div class="ldvPlantHero"><div class="ldvPlantBrand"><b>LED<span>OVIA</span></b><small>SURVIVAL GUIDE · EMERGENCY USE ONLY</small></div><h2>Edible <em>Wild Plants</em></h2><p>Identification · Look-Alikes · Safety</p></div>
 <div class="ldvPlantQuick"><div><b>✓ Check the Whole Plant</b><small>Leaves · stems · flowers · habitat</small></div><div class="ldvPlantCaution"><b>⚠ Know Before You Start</b><small>Photos and AI cannot certify edibility. Never taste an unknown plant.</small></div></div>
 <h3>Step-by-Step Safety Instructions</h3>
 <div class="ldvPlantSteps">
 <section><strong>1</strong><div class="ldvPlantPic ldvPlantPic1" aria-hidden="true"></div><div><b>Examine the Entire Plant</b><p>Compare leaves, stems, flowers, fruit, and habitat. A single feature cannot establish identity.</p></div></section>
 <section><strong>2</strong><div class="ldvPlantPic ldvPlantPic2" aria-hidden="true"></div><div><b>Rule Out Look-Alikes</b><p>Poison hemlock and water hemlock may resemble edible plants. Avoid unidentified wild roots and carrot-like plants.</p></div></section>
 <section><strong>3</strong><div class="ldvPlantPic ldvPlantPic3" aria-hidden="true"></div><div><b>Check the Growing Area</b><p>Avoid roadsides, sprayed lawns, industrial sites, and potentially contaminated soil or water.</p></div></section>
 <section><strong>4</strong><div class="ldvPlantPic ldvPlantPic4" aria-hidden="true"></div><div><b>Verify Parts &amp; Preparation</b><p>Plant parts can differ in toxicity. Cooking cannot make an unknown plant safe.</p></div></section>
 <section><strong>5</strong><div class="ldvPlantPic ldvPlantPic5" aria-hidden="true"></div><div><b>Know When to Stop</b><p>If identification is uncertain, do not eat it. If swallowed, contact Poison Control immediately; do not induce vomiting.</p></div></section>
 </div><div class="ldvPlantBottom"><section class="ldvPlantDanger"><h3>⚠ IMPORTANT SAFETY WARNING</h3><p>Never use a universal edibility test. Do not taste unidentified plants. For suspected poisoning in the U.S., call <b>1-800-222-1222</b> without waiting for symptoms. Call <b>911</b> for collapse, seizures, or trouble breathing.</p></section><section class="ldvPlantRelated"><h3>Related Ledovia Guides</h3><p>Start Here — Foraging Safety · Dangerous Look-Alikes</p></section></div><p class="ldvPlantFooter">Illustrated emergency reference · Safety review pending. Photos are decorative, not species identification references.</p>`;
 viewerScroll.append(plantGuide);
 const plantStyle=document.createElement('style');plantStyle.textContent=`
 .ldvPlantGuide{box-sizing:border-box;background:#062d2c;color:white;padding:0 8px 24px;font-family:Arial,sans-serif;max-width:750px;margin:auto}.ldvPlantGuide[hidden]{display:none!important}
 .ldvPlantHero{min-height:175px;padding:15px 13px;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(90deg,#042b2bf2,#042b2b99),url('./a_detailed_nature_collage_with_six_close_up_outdoo.png') left top/300% 200%;border-radius:7px}
 .ldvPlantBrand b{font-size:22px;letter-spacing:.3px}.ldvPlantBrand b span,.ldvPlantHero em{color:#30e5e0;font-style:normal}.ldvPlantBrand small{display:block;font-size:9px;letter-spacing:.6px}.ldvPlantHero h2{font-size:29px;line-height:1.05;margin:17px 0 4px}.ldvPlantHero p{font-size:12px;margin:0}
 .ldvPlantQuick{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:7px 0}.ldvPlantQuick>div{border:1.5px solid #27e2da;border-radius:9px;padding:8px;background:#073d3d}.ldvPlantQuick .ldvPlantCaution{border-color:#f4c849}.ldvPlantQuick b{font-size:13px;display:block}.ldvPlantQuick small{font-size:11px;line-height:1.35;display:block;margin-top:4px}
 .ldvPlantGuide>h3{background:linear-gradient(#146f70,#06494a);border:1px solid #28dfd7;border-radius:8px;padding:8px;margin:8px 0 4px;font-size:16px}
 .ldvPlantSteps section{display:grid;grid-template-columns:31px 33% 1fr;align-items:center;gap:6px;border:1px solid #27d5cd;border-radius:9px;margin:4px 0;min-height:83px;overflow:hidden;background:#053533}.ldvPlantSteps section>strong{background:#0a6966;border:1px solid #4cf0e5;border-radius:7px;font-size:23px;text-align:center;margin-left:3px}.ldvPlantSteps section>div:last-child{padding:5px 5px 5px 0}.ldvPlantSteps b{font-size:14px}.ldvPlantSteps p{font-size:11.5px;line-height:1.3;margin:3px 0}
 .ldvPlantPic{height:100%;min-height:82px;background-image:url('./a_detailed_nature_collage_with_six_close_up_outdoo.png');background-size:300% 200%;background-repeat:no-repeat}.ldvPlantPic1{background-position:0 0}.ldvPlantPic2{background-position:100% 100%}.ldvPlantPic3{background-position:50% 0}.ldvPlantPic4{background-position:0 100%}.ldvPlantPic5{background-position:100% 0}
 .ldvPlantBottom{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:8px}.ldvPlantBottom section{border-radius:10px;padding:9px;background:#073b3a;border:1px solid #31e4dd}.ldvPlantBottom .ldvPlantDanger{background:#6c1018;border-color:#ff6464}.ldvPlantBottom h3{font-size:14px;margin:0 0 5px}.ldvPlantBottom p{font-size:11px;line-height:1.4;margin:0}.ldvPlantFooter{font-size:10px;color:#e8d3a0;padding:10px 2px}
 @media(max-width:360px){.ldvPlantSteps section{grid-template-columns:28px 30% 1fr;gap:4px}.ldvPlantSteps b{font-size:12px}.ldvPlantSteps p{font-size:10.5px}}
 `;document.head.append(plantStyle);
 function openPlantGuide(){setGuideNav('Edible Wild Plants');const wasHidden=viewer.hidden;viewer.querySelector('.ldvViewerTitle').textContent='Edible Wild Plants';viewer.querySelector('.ldvViewerDownload').hidden=true;viewer.querySelector('.ldvViewerControls').hidden=true;emergencyWrap.hidden=true;plantGuide.hidden=false;viewer.hidden=false;document.body.classList.add('ldvViewerActive');if(wasHidden){try{history.pushState({...((history.state&&typeof history.state==='object')?history.state:{}),[viewerHistoryKey]:true},'',location.href);}catch{}}viewerScroll.scrollTo(0,0);viewer.querySelector('.ldvViewerClose').focus();}
 const guideSequence=[
 ['Emergency Priorities — Draft','ledovia-emergency-priorities.png'],
 ['Boiling Water','a_vertical_infographic_poster_in_the_same_style_as.png'],
 ['Find Water in the Wild','Ledovia_Find_Water_in_the_Wild_Guide.png'],
 ['Emergency Water Prefiltering','Ledovia_Emergency_Water_Filtration_Guide.png'],
 ['Water Storage','file_00000000c23881f6aada86093724af1e.png']
 ];
 const forageGuideSequence=[
 ['Start Here — Foraging Safety','Foraging Safety Survival Guide Infographic.png'],
 ['Edible Wild Plants',null]
 ];
 const cookingGuideSequence=[
 ['Cooking Safety Overview — Draft','file_000000006a2481f691149e0b7bd3e2de.png'],
 ['Campfire Cooking','file_000000001ba881f6b03e47e0b2c3a2ce.png']
 ];
 let activeGuideSequence=guideSequence;
 const guideBar=viewer.querySelector('.ldvGameViewerBar');
 const guideNav=document.createElement('nav');guideNav.className='ldvPremiumGuideNav';guideNav.setAttribute('aria-label','Survival guide navigation');
 guideNav.innerHTML='<button type="button" class="ldvPremiumPrevious" aria-label="Previous guide or Home">⌂<small>Home</small></button><a class="ldvPremiumSave" aria-label="Save current guide offline" download>↓<small>Save Offline</small></a><button type="button" class="ldvPremiumNext" aria-label="Next guide or Home">→<small>Next</small></button><span class="ldvPremiumProgress" aria-live="polite"></span>';
 guideBar.after(guideNav);
 let guideIndex=-1;
 function setGuideNav(name){activeGuideSequence=cookingGuideSequence.some(g=>g[0]===name)?cookingGuideSequence:forageGuideSequence.some(g=>g[0]===name)?forageGuideSequence:guideSequence;guideIndex=activeGuideSequence.findIndex(g=>g[0]===name);guideNav.hidden=guideIndex<0;if(guideIndex<0)return;const first=guideIndex===0,last=guideIndex===activeGuideSequence.length-1;const left=guideNav.querySelector('.ldvPremiumPrevious'),right=guideNav.querySelector('.ldvPremiumNext'),save=guideNav.querySelector('.ldvPremiumSave');left.firstChild.textContent=first?'⌂':'←';left.querySelector('small').textContent=first?'Home':'Previous';right.firstChild.textContent=last?'⌂':'→';right.querySelector('small').textContent=last?'Home':'Next';guideNav.querySelector('.ldvPremiumProgress').textContent='Guide '+(guideIndex+1)+' of '+activeGuideSequence.length;save.hidden=!activeGuideSequence[guideIndex][1];if(!save.hidden){save.href='./'+activeGuideSequence[guideIndex][1];save.download='Ledovia-'+name.replace(/[^a-z0-9]+/gi,'-')+'.png';}}
 function showGuideAt(index){if(index<0||index>=activeGuideSequence.length){backFromViewer();return;}const [name,file]=activeGuideSequence[index];if(file)openViewer(name,file);else openPlantGuide();}
 guideNav.querySelector('.ldvPremiumPrevious').onclick=()=>showGuideAt(guideIndex-1);
 guideNav.querySelector('.ldvPremiumNext').onclick=()=>showGuideAt(guideIndex+1);
 const guideNavStyle=document.createElement('style');guideNavStyle.textContent=`
 .ldvPremiumGuideNav{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:7px;padding:8px 12px 17px;background:#092e30;border-bottom:1px solid #207b7b}
 .ldvPremiumGuideNav[hidden],.ldvPremiumGuideNav [hidden]{display:none!important}
 .ldvPremiumGuideNav button,.ldvPremiumGuideNav a{box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:48px;border-radius:13px;border:1px solid #36b5b7;background:#0c3538;color:#fff;text-decoration:none;font-size:22px;font-weight:700;box-shadow:0 0 9px #1ce2d02b}
 .ldvPremiumGuideNav .ldvPremiumSave{background:#087e7e;border:2px solid #48f2e8;box-shadow:0 0 12px #27d8ce66}
 .ldvPremiumGuideNav small{font-size:11px;line-height:1.2;margin-top:2px}.ldvPremiumProgress{grid-column:1/-1;text-align:center;font-size:10px;color:#b8d5d3}
 `;document.head.append(guideNavStyle);
 function openViewer(name,file){setGuideNav(name);plantGuide.hidden=true;emergencyWrap.hidden=false;viewer.querySelector('.ldvViewerDownload').hidden=false;viewer.querySelector('.ldvViewerControls').hidden=false;const wasHidden=viewer.hidden;viewer.querySelector('.ldvViewerTitle').textContent=name;viewerImg.alt=name+' illustrated Grid-Off guide draft';viewer.querySelector('.ldvViewerDownload').href='./'+file;viewer.querySelector('.ldvViewerDownload').download='Ledovia-'+name.replace(/[^a-z0-9]+/gi,'-')+'-Grid-Off.png';viewer.hidden=false;document.body.classList.add('ldvViewerActive');if(wasHidden){try{history.pushState({...((history.state&&typeof history.state==='object')?history.state:{}),[viewerHistoryKey]:true},'',location.href);}catch{}}zoom=1;emergencyWrap.classList.toggle('ldvEmergencyActive',file.includes('ledovia-emergency-priorities.png'));viewerImg.src='./'+file;viewer.querySelector('.ldvViewerClose').focus();requestAnimationFrame(()=>applyViewerSize(true));}
 /* Emergency priorities: accessible live shortcuts, not fake image hotspots. */
 const emergencyWrap=document.createElement('div');emergencyWrap.className='ldvEmergencyImageWrap';emergencyWrap.hidden=false;viewerImg.parentNode.insertBefore(emergencyWrap,viewerImg);emergencyWrap.append(viewerImg);
 const hotspots=[
 ['No Safe Water','Purify Water',35.0,20.8,19.0,4.0],
 ['Food May Be Spoiled',null,55.0,20.8,19.8,4.0],
 ['Need to Cook Without Power','Off-Grid Cooking',75.8,20.8,22.3,4.0],
 ['Purify Water','Purify Water',49.8,83.3,12.0,12.8],
 ['Find Water','Find Water',62.2,83.3,12.0,12.8],
 ['Build a Filter','Build a Filter',74.5,83.3,12.0,12.8],
 ['Store Water','Store Water',86.9,83.3,12.0,12.8]
 ];
 hotspots.forEach(([label,target,left,top,width,height])=>{const btn=document.createElement('button');btn.type='button';btn.className='ldvEmergencyHotspot';btn.setAttribute('aria-label',label);btn.title=label;Object.assign(btn.style,{left:left+'%',top:top+'%',width:width+'%',height:height+'%'});btn.addEventListener('click',()=>{if(!target){viewerScroll.scrollTo({top:viewerImg.clientHeight*.45,behavior:'smooth'});return;}if(target==='Off-Grid Cooking'){closeViewer();renderRoute('cooking');return;}const guideFiles={'Purify Water':['Boiling Water','a_vertical_infographic_poster_in_the_same_style_as.png'],'Find Water':['Find Water in the Wild','Ledovia_Find_Water_in_the_Wild_Guide.png'],'Build a Filter':['Emergency Water Prefiltering','Ledovia_Emergency_Water_Filtration_Guide.png'],'Store Water':['Water Storage','file_00000000c23881f6aada86093724af1e.png']};const guide=guideFiles[target];if(guide){openViewer(guide[0],guide[1]);}});emergencyWrap.append(btn)});
 function updateEmergencyWrap(){const active=viewerImg.src.includes('ledovia-emergency-priorities.png');emergencyWrap.classList.toggle('ldvEmergencyActive',active);if(active){emergencyWrap.style.width=viewerImg.style.width||'100%';viewerImg.style.width='100%';}}
 viewerImg.addEventListener('load',updateEmergencyWrap);
function showGameIndex(){gameSelect.hidden=false;animalPanel.hidden=true;art.hidden=true;rememberPage('water-game');}
 game.querySelector('.ldvGameToGuides').addEventListener('click',()=>returnRoute('water'));
 game.querySelector('.ldvGameBack').addEventListener('click',()=>returnRoute('game'));
 animals.forEach(([name,file,emoji])=>{const btn=document.createElement('button');btn.type='button';btn.className='ldvGameAnimalTile';btn.innerHTML='<span class="ldvGameAnimalPhoto" aria-hidden="true"></span><strong></strong>';btn.querySelector('strong').textContent=name;if(file){btn.querySelector('.ldvGameAnimalPhoto').textContent=emoji;}else{btn.classList.add('ldvGamePhotoPending');btn.querySelector('.ldvGameAnimalPhoto').textContent='PHOTO PENDING';btn.setAttribute('aria-label',name+' — guide and animal photo pending upload');}btn.addEventListener('click',()=>{showGameIndex();if(file){openViewer(name,file);}else{gameSelect.hidden=false;notice.textContent=name+' guide and animal photo are pending upload and safety review.';const alert=gameSelect.querySelector('.ldvGameAlert p');if(alert)alert.textContent=name+' guide and animal photo are pending upload and safety review. Other available guides remain accessible.';}});gameGrid.append(btn);});
 function openGame(){waterHome.hidden=true;game.hidden=false;gameSelect.hidden=false;animalPanel.hidden=true;heading.textContent='Wild Game Preparation';rememberPage('water-game');recordRoute('game');details.scrollIntoView({block:'start'});}
 const original=document.createElement('div');original.className='ldvOriginalHub';
 oldNodes.forEach(n=>original.append(n));details.append(waterHome,game,cooking,forage,original);panel.append(landing,details);
 cards.forEach(([key,icon,label,view,category])=>{
  const b=document.createElement('button');b.type='button';b.className='ldvGuideCard'+(['checklists','library'].includes(key)?' ldvWide':'');
  b.dataset.guide=key;b.setAttribute('aria-label','Open '+label);
  const subtitle=key==='checklists'?'Go bags, home, vehicle & more':key==='library'?'Manage backups and offline resources':'';
  b.innerHTML='<span class="ldvIcon" aria-hidden="true">'+icon+'</span><span class="ldvLabel">'+label+(subtitle?'<small>'+subtitle+'</small>':'')+'</span>';
  b.addEventListener('click',()=>{
   if(view==='hazards'){const tab=document.getElementById('tab-hazards');if(tab)tab.click();return;}
   heading.textContent=key==='water'?'Water/Food Safety & Preparation':label;
   landing.hidden=true;details.hidden=false;details.classList.toggle('ldvWaterMode',key==='water');waterHome.hidden=key!=='water';game.hidden=true;cooking.hidden=true;original.hidden=key==='water';
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
