/* Ledovia Beta v0.8.21 — desktop fullscreen details and intentional map interaction. */
(()=>{'use strict';
function init(){
 const app=document.getElementById('appMain'),map=document.getElementById('mapwrap'),canvas=document.getElementById('map'),popup=document.getElementById('scPlaceDetailPopup'),dock=document.getElementById('ld18ResourceDock');
 if(!app||!map||!canvas||!popup||!dock)return false;
 if(window.__ld21MapInteractions)return true;window.__ld21MapInteractions=true;
 const desktop=()=>matchMedia('(min-width:1100px)').matches;
 const fullscreen=()=>document.fullscreenElement===map;
 function sync(){
   const floating=desktop()&&fullscreen();
   app.classList.toggle('ld21FullscreenDetails',floating);
   if(floating){if(popup.parentElement!==map)map.appendChild(popup);dock.hidden=true;}
   else if(desktop()){if(popup.parentElement!==dock)dock.appendChild(popup);dock.hidden=popup.hidden;}
   else{if(popup.parentElement!==map)map.appendChild(popup);dock.hidden=true;}
 }
 document.addEventListener('fullscreenchange',sync);
 window.addEventListener('resize',sync);
 new MutationObserver(sync).observe(popup,{attributes:true,attributeFilter:['hidden']});
 function dismiss(){
   if(popup.hidden)return;
   const close=popup.querySelector('.scPlacePopupHeader button');
   if(close)close.click();else popup.hidden=true;
 }
 // Track the pointer travel so a map drag is not treated as a blank-map click.
 const starts=new Map();
 canvas.addEventListener('pointerdown',e=>{
   if(!desktop()||e.button!==0)return;
   starts.set(e.pointerId,{x:e.clientX,y:e.clientY,moved:false});
 },true);
 canvas.addEventListener('pointermove',e=>{
   const p=starts.get(e.pointerId);if(p&&Math.hypot(e.clientX-p.x,e.clientY-p.y)>6)p.moved=true;
 },true);
 canvas.addEventListener('pointercancel',e=>starts.delete(e.pointerId),true);
 canvas.addEventListener('pointerup',e=>{
   const p=starts.get(e.pointerId);starts.delete(e.pointerId);
   if(!desktop()||!p||p.moved||Math.hypot(e.clientX-p.x,e.clientY-p.y)>6||popup.hidden)return;
   // The base map handler runs after capture and may change selection. Wait until it has picked a marker.
   const before=popup.querySelector('.scPlacePopupHeader strong')?.textContent||'';
   const wasOpen=!popup.hidden;
   setTimeout(()=>{
     if(!wasOpen||popup.hidden)return;
     const after=popup.querySelector('.scPlacePopupHeader strong')?.textContent||'';
     if(before!==after)return;
     // Only dismiss if no marker hit; marker positions are rendered in canvas and not DOM.
     const x=e.clientX-canvas.getBoundingClientRect().left,y=e.clientY-canvas.getBoundingClientRect().top;
     const hit=(window._markers||[]).some(f=>Math.hypot(f.sx-x,f.sy-y)<(f.cluster?22:17));
     if(!hit)dismiss();
   },0);
 },true);
 // Intercept wheel before the base canvas handler. Ctrl+wheel and fullscreen retain map zoom.
 canvas.addEventListener('wheel',e=>{
   if(!desktop())return;
   if(e.ctrlKey||fullscreen())return;
   e.stopImmediatePropagation();
   // Do not preventDefault: allow the browser to scroll the page.
 },{capture:true,passive:true});
 sync();return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();