/* Ledovia Beta offline coverage diagnostics: read-only, no downloads or storage writes. */
(()=>{'use strict';
function start(){
 const select=document.getElementById('basemapStyle'),host=document.getElementById('mapLayersControl');
 if(!select||!host||document.getElementById('ldOfflineCheckButton'))return;
 const button=document.createElement('button');button.id='ldOfflineCheckButton';button.type='button';button.textContent='Offline coverage';button.style.cssText='display:block;width:100%;margin:10px 0 0;min-height:44px;background:#10535c;color:#fff;border:1px solid #60d7d6;border-radius:10px;font-weight:700';
 const panel=document.createElement('section');panel.id='ldOfflineCheckPanel';panel.hidden=true;panel.setAttribute('aria-label','Offline map coverage');
 panel.style.cssText='margin-top:10px;padding:12px;border:1px solid #60d7d6;border-radius:12px;background:#0c2930;color:#fff;font:14px/1.5 system-ui;max-height:45vh;overflow:auto';
 const title=document.createElement('strong');title.textContent='Offline Map Coverage';
 const info=document.createElement('div');info.setAttribute('role','status');info.style.marginTop='8px';
 const note=document.createElement('small');note.style.cssText='display:block;margin-top:8px;color:#c3dddd';note.textContent='Diagnostic only. Cached tile counts do not prove coverage at this location. Online map visibility is not offline readiness.';
 panel.append(title,info,note);host.append(button,panel);
 const line=(name,value)=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #ffffff22;padding:7px 0';const a=document.createElement('span'),b=document.createElement('strong');a.textContent=name;b.textContent=value;row.append(a,b);info.append(row)};
 async function inspect(){
  info.replaceChildren();
  line('Connection',navigator.onLine?'Online (not proof of offline coverage)':'Offline');
  line('MapLibre vector tiles','No published offline package');
  line('SC HD aerial imagery','Online-only');
  line('NC / GA map packages','Not verified');
  line('Local resources','SC package published; device status unverified');
  line('Offline road routing','Device data not verified');
  if(!indexedDB||typeof indexedDB.databases!=='function'){line('Local raster cache','Unable to inspect on this browser');return}
  try{
   const dbs=await indexedDB.databases();
   if(!dbs.some(d=>d.name==='griddown-atlas-v1')){line('Legacy raster tiles','No local database found');return}
   const db=await new Promise((resolve,reject)=>{const req=indexedDB.open('griddown-atlas-v1');req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);req.onblocked=()=>reject(Error('blocked'))});
   try{
    if(!db.objectStoreNames.contains('tiles')){line('Legacy raster tiles','Tile store not found');return}
    const count=await new Promise((resolve,reject)=>{const tx=db.transaction('tiles','readonly');const req=tx.objectStore('tiles').count();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
    line('Legacy raster tiles',count+' stored (coverage unverified)');
   }finally{db.close()}
  }catch(e){line('Legacy raster tiles','Inspection unavailable')}
 }
 button.addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden)inspect()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();