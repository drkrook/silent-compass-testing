/* Silent Compass Beta v0.8.5 — Prepare Your Area dashboard.
   Existing state pack download and storage remain owned by index.html. */
(()=>{
'use strict';
function init(){
 const section=document.getElementById('scStatePackSection'),state=document.getElementById('state'),download=document.getElementById('scStatePackDownload'),status=document.getElementById('scStatePackStatus');
 if(!section||!state||!download||!status||document.getElementById('scPrepareDashboard'))return;
 const oldLabel=section.querySelector('strong'),oldDescription=section.querySelector('p'),oldState=section.querySelector('.legend');
 if(oldLabel)oldLabel.hidden=true;if(oldDescription)oldDescription.hidden=true;if(oldState)oldState.hidden=true;
 const offlineHome=document.getElementById('scOfflineHome');
 if(offlineHome){
  const children=[...offlineHome.children];
  const heading=children.find(el=>el.tagName==='STRONG');
  const intro=children.find(el=>el.tagName==='P'&&el.classList.contains('muted'));
  if(heading)heading.hidden=true;
  if(intro)intro.hidden=true;
 }

 const ui=document.createElement('div');ui.id='scPrepareDashboard';
 ui.innerHTML=`<style>
 #scPrepareDashboard{color:#edf8f5}#scPrepareDashboard button{min-height:49px;border-radius:10px;font-weight:700}
 #scPrepareDashboard .scPrepPrimary{width:100%;background:#087e75;border:2px solid #4de1ce;color:#fff;padding:16px;font-size:18px}
 #scPrepareDashboard .scPrepActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:12px 0}
 #scPrepareDashboard .scPrepActions button{width:100%;background:#244e4a;border:1px solid #6aa99c;color:#fff;padding:10px}
 #scPrepareDashboard .scPrepBox{border:1px solid #638f85;border-radius:12px;padding:14px;margin-top:12px;background:#193733}
 #scPrepareDashboard .scPrepCard{border:1px solid #527f76;border-radius:10px;padding:12px;margin-top:10px;background:#21443f}
 #scPrepareDashboard .scPrepCard button{margin-top:8px}
 #scPrepareDashboard select{width:100%;min-height:48px;margin:8px 0;background:#173632;color:#fff;border:1px solid #8ebbb0;border-radius:9px;padding:10px}
 #scPrepareDashboard summary{cursor:pointer;font-weight:700}
 #scPrepareDashboard .scPrepNote{font-size:12px;color:#bfd9d1;line-height:1.5}
 @media(max-width:430px){#scPrepareDashboard .scPrepActions{grid-template-columns:1fr}}
 </style>
 <h2 style="margin:0 0 6px">🧭 Prepare Your Area</h2>
 <p class="scPrepNote">Download state resource locations for offline use. Map tiles must be downloaded separately.</p>
 <button id="scPrepNew" class="scPrepPrimary" type="button" aria-expanded="false">⬇️ Prepare New Area</button>
 <div class="scPrepActions"><button id="scPrepMap" type="button">🗺️ Open Map</button><button id="scPrepManage" type="button">⚙️ Manage Downloads</button></div>
 <details class="scPrepBox" id="scPrepSavedBox" open><summary>📥 My Downloaded States (<span id="scPrepCount">0</span>)</summary><div id="scPrepCards" role="status">Checking saved states…</div></details>
 <div class="scPrepBox" id="scPrepForm" hidden><h3 style="margin:0 0 8px">Prepare New Area</h3><label for="scPrepareState">Choose a state</label><select id="scPrepareState"></select><div id="scPrepDownloadSlot"></div><div id="scPrepStatusSlot"></div><p class="scPrepNote">Select a state, download its published resources, then open the map. Unpublished state packs cannot be downloaded yet.</p><button id="scPrepFormMap" type="button">🗺️ Open Map</button></div>
 <details class="scPrepBox" id="scPrepManageBox" hidden><summary>Manage Downloaded Resources</summary><p class="scPrepNote">Select a downloaded state and use Prepare New Area to update its pack. Removing offline data is intentionally unavailable here to protect saved information.</p><button id="scPrepRefresh" type="button">↻ Refresh Saved States</button></details>`;
 section.prepend(ui);
 const form=ui.querySelector('#scPrepForm'),newButton=ui.querySelector('#scPrepNew'),picker=ui.querySelector('#scPrepareState');
 picker.innerHTML=state.innerHTML;picker.value=state.value;
 const downloadSlot=ui.querySelector('#scPrepDownloadSlot'),statusSlot=ui.querySelector('#scPrepStatusSlot');
 downloadSlot.append(download);statusSlot.append(status);
 download.textContent='⬇️ Download State Resources';
 const map=()=>document.getElementById('tab-map')?.click();
 ui.querySelector('#scPrepMap').onclick=map;ui.querySelector('#scPrepFormMap').onclick=map;
 function showForm(){form.hidden=false;newButton.setAttribute('aria-expanded','true');picker.focus()}
 newButton.onclick=()=>{if(form.hidden)showForm();else{form.hidden=true;newButton.setAttribute('aria-expanded','false')}};
 ui.querySelector('#scPrepManage').onclick=()=>{const box=ui.querySelector('#scPrepManageBox');box.hidden=!box.hidden;if(!box.hidden)box.open=true};
 ui.querySelector('#scPrepRefresh').onclick=refresh;
 picker.onchange=()=>{state.value=picker.value;state.dispatchEvent(new Event('change',{bubbles:true}));refresh()};
 state.addEventListener('change',()=>{picker.value=state.value;refresh()});
 let generation=0;
 async function refresh(){
  const seq=++generation,cards=ui.querySelector('#scPrepCards'),count=ui.querySelector('#scPrepCount');
  cards.textContent='Checking saved states…';
  try{
   if(typeof get!=='function')throw Error('Storage not ready');
   const codes=[...state.options].map(o=>o.value);
   const found=[];
   for(const code of codes){
    const version=await get('data','state-pack-version-'+code);
    if(seq!==generation)return;
    if(!version)continue;
    const saved=await get('data','features-'+code);
    if(seq!==generation)return;
    found.push({code,name:state.querySelector('option[value="'+code+'"]')?.textContent||code,n:Array.isArray(saved)?saved.length:0});
   }
   count.textContent=String(found.length);cards.replaceChildren();
   if(!found.length){cards.textContent='No installed state packs confirmed on this device.';return}
   for(const item of found){
    const card=document.createElement('div');card.className='scPrepCard';
    const name=document.createElement('strong');name.textContent='📍 '+item.name;
    const detail=document.createElement('div');detail.className='scPrepNote';detail.textContent=item.n.toLocaleString()+' saved resource locations · State pack installed on this device';
    const button=document.createElement('button');button.type='button';button.textContent='🗺️ Open Map';button.onclick=()=>{state.value=item.code;state.dispatchEvent(new Event('change',{bubbles:true}));map()};
    card.append(name,detail,button);cards.append(card);
   }
  }catch(e){if(seq===generation)cards.textContent='Could not check downloaded states. Try again after storage finishes loading.'}
 }
 const observer=new MutationObserver(()=>{if(/Saved \d+ .* pack resources offline/.test(status.textContent))refresh()});
 observer.observe(status,{childList:true,characterData:true,subtree:true});
 window.addEventListener('focus',refresh);setTimeout(refresh,1200);refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();