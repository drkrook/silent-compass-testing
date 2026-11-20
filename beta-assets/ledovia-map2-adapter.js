/* Ledovia Maps 2.0 compatibility adapter — staged, not activated.
 * Bridges map center, zoom, GPS positioning and map-state events.
 * Does not change legacy Canvas, stored places, hazard data, or offline routing.
 * Only attach after a new MapLibre instance has loaded.
 */
(function(global){
 'use strict';
 const EVENT='ld47-map-state';
 function attach(map,options={}){
  if(!map||typeof map.on!=='function'||typeof map.jumpTo!=='function')throw Error('MapLibre map instance required');
  let detached=false,position=null,marker=null,accuracy=null;
  const emit=()=>{
   if(detached)return;
   const c=map.getCenter(),zoom=map.getZoom();
   global.dispatchEvent(new CustomEvent(EVENT,{detail:{lat:c.lat,lon:c.lng,zoom}}));
  };
  const center=(lat,lon,zoom)=>{
   lat=Number(lat);lon=Number(lon);
   if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return false;
   const next={center:[lon,lat]};
   if(zoom!==undefined&&zoom!==null&&Number.isFinite(Number(zoom)))next.zoom=Math.max(3,Math.min(20,Number(zoom)));
   map.jumpTo(next);emit();return true;
  };
  const showGps=(coords)=>{
   if(!coords||!Number.isFinite(Number(coords.latitude))||!Number.isFinite(Number(coords.longitude)))return false;
   position={latitude:Number(coords.latitude),longitude:Number(coords.longitude),accuracy:Number(coords.accuracy)};
   if(!marker){
    const dot=document.createElement('div');dot.className='ld2GpsDot';
    dot.style.cssText='width:17px;height:17px;border:3px solid white;border-radius:50%;background:#1679eb;box-shadow:0 1px 7px #0008';
    marker=new global.maplibregl.Marker({element:dot,anchor:'center'}).setLngLat([position.longitude,position.latitude]).addTo(map);
   }else marker.setLngLat([position.longitude,position.latitude]);
   if(Number.isFinite(position.accuracy)&&position.accuracy>0){
    if(!accuracy){
     const el=document.createElement('div');el.style.cssText='border-radius:50%;background:#1679eb22;border:1px solid #1679eb88;pointer-events:none';
     accuracy=new global.maplibregl.Marker({element:el,anchor:'center'}).setLngLat([position.longitude,position.latitude]).addTo(map);
    }
    const update=()=>{
     if(detached||!accuracy)return;
     const lat=position.latitude,metersPerPixel=156543.03392*Math.cos(lat*Math.PI/180)/Math.pow(2,map.getZoom());
     const px=Math.max(18,Math.min(1000,2*position.accuracy/metersPerPixel));
     const el=accuracy.getElement();el.style.width=px+'px';el.style.height=px+'px';
     accuracy.setLngLat([position.longitude,position.latitude]);
    };
    update();
   }else if(accuracy){accuracy.remove();accuracy=null}
   return true;
  };
  const refreshAccuracy=()=>{
   if(!accuracy||!position)return;
   const metersPerPixel=156543.03392*Math.cos(position.latitude*Math.PI/180)/Math.pow(2,map.getZoom());
   const px=Math.max(18,Math.min(1000,2*position.accuracy/metersPerPixel));
   const el=accuracy.getElement();el.style.width=px+'px';el.style.height=px+'px';
  };
  map.on('move',emit);map.on('zoom',refreshAccuracy);
  emit();
  return {
   center,showGps,
   getState:()=>{const c=map.getCenter();return {lat:c.lat,lon:c.lng,zoom:map.getZoom()}},
   destroy:()=>{detached=true;map.off('move',emit);map.off('zoom',refreshAccuracy);if(marker)marker.remove();if(accuracy)accuracy.remove()}
  };
 }
 global.LedoviaMap2Adapter={attach};
})(window);
