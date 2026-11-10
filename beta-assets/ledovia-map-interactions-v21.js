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
   const hazard=document.getElementById('scHazDetailPopup');
   app.classList.toggle('ld21FullscreenDetails',floating);
   if(floating){if(popup.parentElement!==map)map.appendChild(popup);if(hazard&&hazard.parentElement!==map)map.appendChild(hazard);dock.hidden=true;}
   else if(desktop()){if(popup.parentElement!==dock)dock.appendChild(popup);if(hazard&&hazard.parentElement!==dock)dock.appendChild(hazard);dock.hidden=popup.hidden&&(!hazard||hazard.hidden);}
   else{if(popup.parentElement!==map)map.appendChild(popup);dock.hidden=true;}
 }
 document.addEventListener('fullscreenchange',sync);
 window.addEventListener('resize',sync);
 const observer=new MutationObserver(sync);observer.observe(popup,{attributes:true,attributeFilter:['hidden']});
 const hazard=document.getElementById('scHazDetailPopup');if(hazard)observer.observe(hazard,{attributes:true,attributeFilter:['hidden']});
 function dismiss(){
   if(popup.hidden)return;
   const close=popup.querySelector('.scPlacePopupHeader button');
   if(close)close.click();else popup.hidden=true;
 }
 // Selection and empty-click handling are owned by the patched base map handler in Beta v0.8.23.
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