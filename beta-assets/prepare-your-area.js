/* Silent Compass Beta: Prepare Your Area. Non-destructive UI integration. */
(()=>{
'use strict';
function init(){
 const section=document.getElementById('scStatePackSection'),state=document.getElementById('state'),download=document.getElementById('scStatePackDownload'),status=document.getElementById('scStatePackStatus');
 if(!section||!state||!download||!status)return;
 if(document.getElementById('scPrepareState'))return;
 const title=section.querySelector('strong');if(title)title.textContent='🧭 Prepare Your Area';
 const description=section.querySelector('p');if(description)description.textContent='Choose a state, download available resource locations, then open the map. Offline map tiles are downloaded separately.';
 const old=section.querySelector('.legend');if(old)old.hidden=true;
 const step=document.createElement('div');step.innerHTML='<label for="scPrepareState" style="display:block;margin-top:14px;font-weight:700">1. Choose a state</label><select id="scPrepareState" style="width:100%;min-height:48px;margin:8px 0 12px"></select><div style="font-weight:700;margin:10px 0">2. Download resources</div>';
 section.insertBefore(step,download);
 const picker=step.querySelector('select');
 picker.innerHTML=state.innerHTML;picker.value=state.value;
 picker.addEventListener('change',()=>{state.value=picker.value;state.dispatchEvent(new Event('change',{bubbles:true}));updateSaved()});
 state.addEventListener('change',()=>{picker.value=state.value;updateSaved()});
 download.textContent='Download State Resources';
 const footer=document.createElement('div');footer.innerHTML='<div style="font-weight:700;margin:14px 0 8px">3. Open the map</div><button id="scPrepareOpenMap" type="button" style="width:100%;min-height:48px">🗺️ Open Map</button><p class="muted" style="font-size:12px">Opening the map does not guarantee offline coverage. Download map tiles for your intended area separately.</p><div id="scPrepareSaved" class="legend" role="status"></div>';
 section.append(footer);
 footer.querySelector('button').addEventListener('click',()=>{const tab=document.getElementById('tab-map');if(tab)tab.click();else document.getElementById('scMapHome')?.click()});
 let sequence=0;
 async function updateSaved(){
  const token=++sequence,code=state.value,el=document.getElementById('scPrepareSaved');
  if(!el)return;
  el.textContent='Checking resources saved on this device…';
  try{
   if(typeof get!=='function')throw Error('Storage not ready');
   const saved=await get('data','features-'+code),version=await get('data','state-pack-version-'+code);
   if(token!==sequence)return;
   el.textContent=version?'✓ State pack installed · '+(Array.isArray(saved)?saved.length:0)+' total saved locations.':'No state pack installation confirmed for this state. You can still open the map.';
  }catch(e){if(token===sequence)el.textContent='Saved-resource status unavailable. You can still open the map.'}
 }
 download.addEventListener('click',()=>setTimeout(updateSaved,1000));
 const observer=new MutationObserver(()=>{if(/Saved \d+ .* pack resources offline/.test(status.textContent))updateSaved()});
 observer.observe(status,{childList:true,characterData:true,subtree:true});
 updateSaved();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();