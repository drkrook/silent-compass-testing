/* Ledovia Maps 2.0 Beta live renderer bridge.
 * Legacy canvas stays as a transparent marker/route layer and offline fallback.
 * No persistent data is modified. Online MapLibre tiles are not offline packages.
 */
(()=>{'use strict';
const wrap=document.getElementById('mapwrap'),canvas=document.getElementById('map');
if(!wrap||!canvas||!window.LedoviaMap2||!window.LedoviaMap2Adapter)return;
if(!navigator.onLine)return; // Keep original offline renderer until real offline PMTiles exist.
const node=document.createElement('div');node.id='ld2LiveMap';
node.style.cssText='position:absolute;inset:0;z-index:0;touch-action:pan-x pan-y';
canvas.before(node);
let instance,adapter,ready=false,updating=false,legacy=null,oldSet=null;
const warn=e=>{console.warn('Ledovia Maps 2.0:',e);};
const fallback=()=>{
 window.__ld2Active=false;ready=false;
 if(oldSet)window.__ld47SetCenter=oldSet;
 try{adapter?.destroy();instance?.destroy()}catch(e){warn(e)}
 node.remove();canvas.style.removeProperty('pointer-events');canvas.style.removeProperty('position');
 canvas.style.removeProperty('z-index');canvas.style.removeProperty('background');
 if(legacy&&typeof window.__ld47SetCenter==='function')window.__ld47SetCenter(legacy.lat,legacy.lon,legacy.zoom);
};
try{
 instance=window.LedoviaMap2.create({container:node,center:[-79.77,34.22],zoom:9,onReady:()=>{
  try{
   adapter=window.LedoviaMap2Adapter.attach(instance.map);
   ready=true;window.__ld2Active=true;
   canvas.style.position='relative';canvas.style.zIndex='1';canvas.style.pointerEvents='none';
   canvas.style.background='transparent';
   if(legacy)instance.map.jumpTo({center:[legacy.lon,legacy.lat],zoom:legacy.zoom});
   // Preserve the last legacy center; do not reset an existing saved viewport.
   if(legacy)window.__ld47SetCenter?.(legacy.lat,legacy.lon,legacy.zoom);
   const sel=document.getElementById('basemapStyle');
   if(sel&&!sel.querySelector('option[value="hd"]')){const hd=document.createElement('option');hd.value='hd';hd.textContent='SC HD Aerial (online)';sel.append(hd);}
   function syncLayers(){
    const mode=sel?.value||'topo';
    instance.setMode(mode==='hd'?'hd':mode==='satellite'?'satellite':'topo');
    instance.setRelief(!!document.getElementById('relief')?.checked&&mode==='topo');
   }
   sel?.addEventListener('change',syncLayers);
   document.getElementById('relief')?.addEventListener('change',syncLayers);
   syncLayers();
   oldSet=window.__ld47SetCenter;
   if(typeof oldSet==='function'){
    window.__ld47SetCenter=(lat,lon,zoom)=>{
     oldSet(lat,lon,zoom);
     if(!updating&&ready)instance.map.jumpTo({center:[Number(lon),Number(lat)],zoom:Number(zoom)});
    };
   }
   instance.map.on('moveend',()=>{
    if(!ready||typeof oldSet!=='function')return;
    const c=instance.map.getCenter();
    updating=true;
    try{oldSet(c.lat,c.lng,Math.round(instance.map.getZoom()))}finally{updating=false}
   });
   // MapLibre owns pointer gestures; legacy canvas owns marker selection panels.
   instance.map.on('click',e=>{
    if(!ready||typeof window.__ld2PickMarkerAt!=='function')return;
    const point=instance.map.project(e.lngLat);
    // Personal hazard reports take precedence over nearby resource markers.
    const closePopup=id=>{
     const popup=document.getElementById(id);
     if(popup&&!popup.hidden){
      const close=popup.querySelector('button');
      if(close)close.click();else popup.hidden=true;
     }
    };
    if(window.__ld2PickHazardAt?.(point.x,point.y)){
     closePopup('scPlaceDetailPopup');
     return;
    }
    if(window.__ld2PickMarkerAt(point.x,point.y)){
     closePopup('scHazDetailPopup');
     return;
    }
    // An empty-map tap dismisses open detail cards; dragging and pinch zoom do not.
    closePopup('scHazDetailPopup');
    closePopup('scPlaceDetailPopup');
   });
   instance.map.on('error',warn);
   window.addEventListener('offline',fallback,{once:true});
  }catch(e){warn(e);fallback()}
 }});
 window.addEventListener('ld47-map-state',e=>{
  legacy=e.detail;
  if(!ready||updating||!legacy)return;
  const c=instance.map.getCenter();
  if(Math.abs(c.lat-legacy.lat)>0.0001||Math.abs(c.lng-legacy.lon)>0.0001||Math.abs(instance.map.getZoom()-legacy.zoom)>0.5){
   instance.map.jumpTo({center:[legacy.lon,legacy.lat],zoom:legacy.zoom});
  }
 });
}catch(e){warn(e);fallback()}
})();
