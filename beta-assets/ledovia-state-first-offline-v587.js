/* Ledovia Beta v0.8.587: state-first offline interface; preserve original controls. */
(()=>{'use strict';
function init(){
 const home=document.getElementById('scOfflineHome');
 if(!home||home.dataset.ldStateFirst)return;
 home.dataset.ldStateFirst='1';
 const original=[...home.children];
 const wrap=document.createElement('section');wrap.id='ldStateFirst';wrap.style.cssText='display:grid;gap:12px;color:#effafa';
 const h=document.createElement('div');h.innerHTML='<h2 style="margin:0;font-size:23px">Offline Maps & Guides</h2><p style="margin:5px 0;color:#bad8d9;font-size:13px">Choose your state. Save what is available before you travel.</p>';
 const card=document.createElement('div');card.style.cssText='background:#103b43;border:1px solid #367b80;border-radius:14px;padding:14px;display:grid;gap:10px';
 const label=document.createElement('label');label.textContent='Choose your state';label.htmlFor='ldStatePick';label.style.fontWeight='700';
 const pick=document.createElement('select');pick.id='ldStatePick';pick.style.cssText='width:100%;min-height:48px;border-radius:9px;padding:9px;background:#f6ffff;color:#12343a';
 [['SC','South Carolina'],['NC','North Carolina'],['GA','Georgia']].forEach(([v,n])=>{const o=document.createElement('option');o.value=v;o.textContent=n;pick.append(o)});
 const status=document.createElement('div');status.setAttribute('role','status');status.style.cssText='font-size:12px;color:#d5e9e8';
 const go=document.createElement('button');go.type='button';go.style.cssText='width:100%;min-height:50px;border-radius:10px;background:#087e78;color:white;font-weight:800;border:1px solid #5ad9ce';
 const map=document.createElement('button');map.type='button';map.textContent='Open Map';map.style.cssText='min-height:46px;background:#24555a;color:white;border:1px solid #5d9b9c;border-radius:10px';
 const detail=document.createElement('details');detail.style.cssText='background:#123840;border:1px solid #35616a;border-radius:12px;padding:12px';const sum=document.createElement('summary');sum.textContent='Advanced Offline Tools & Existing Downloads';sum.style.cssText='font-weight:700;cursor:pointer';detail.append(sum);
 const note=document.createElement('p');note.textContent='Full statewide offline maps and guides are not published yet. The South Carolina resource pack can be saved, but it does not include a complete offline basemap.';note.style.cssText='font-size:12px;color:#c5dfdf;margin:0';
 const diag=document.createElement('button');diag.type='button';diag.textContent='Check Offline Coverage';diag.style.cssText='min-height:44px;background:#24555a;color:white;border:1px solid #5d9b9c;border-radius:10px';
 const diagnostic=document.getElementById('ldOfflineCheckButton');
 diag.onclick=()=>{if(diagnostic){diagnostic.click();diagnostic.scrollIntoView({block:'nearest'})}else{status.textContent='Detailed coverage checker is unavailable here. Use Advanced Offline Tools for local readiness information.';detail.open=true}};
 function refresh(){
  const sc=pick.value==='SC';go.disabled=!sc;go.textContent=sc?'Download Available South Carolina Resources':'State Download Coming Soon';
  status.textContent=sc?'South Carolina resources available. Complete statewide offline maps and guides are not yet published.':'State package not yet published. No download is available.';
 }
 const realState=document.getElementById('state');if(realState&&['SC','NC','GA'].includes(realState.value))pick.value=realState.value;
 pick.onchange=()=>{if(realState&&[...realState.options].some(o=>o.value===pick.value)){realState.value=pick.value;realState.dispatchEvent(new Event('change',{bubbles:true}))}refresh()};
 go.onclick=()=>{if(pick.value!=='SC')return;const target=document.getElementById('scStatePackDownload');if(!target){status.textContent='Resource download is unavailable. No data was changed.';return}target.click();status.textContent='South Carolina resource download requested. Check the download status under Advanced Offline Tools before relying on it.'};
 map.onclick=()=>{const b=document.querySelector('[data-tab="map"],#tab-map');if(b)b.click();else if(window.GridDownTabs?.activate)window.GridDownTabs.activate('map');else status.textContent='Open Map using the Map tab above.'};
 card.append(label,pick,status,go,map,note);wrap.append(h,card,diag,detail);
 original.forEach(el=>detail.append(el));home.prepend(wrap);refresh();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
