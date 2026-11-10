/* Ledovia Beta v0.8.18 — desktop resource detail dock. Presentation only. */
(()=>{'use strict';
function init(){
 const app=document.getElementById('appMain'),map=document.getElementById('mapwrap'),popup=document.getElementById('scPlaceDetailPopup');
 if(!app||!map||!popup)return false;
 if(document.getElementById('ld18ResourceDock'))return true;
 const dock=document.createElement('aside');dock.id='ld18ResourceDock';dock.setAttribute('aria-label','Selected map location details');
 dock.appendChild(popup);map.insertAdjacentElement('afterend',dock);
 let previous=false;
 function sync(){
   const desktop=window.matchMedia('(min-width:1100px)').matches;
   const open=!popup.hidden;
   const active=desktop&&open;
   app.classList.toggle('ld18ResourceOpen',active);
   dock.hidden=!active;
   if(!desktop&&popup.parentElement!==map)map.appendChild(popup);
   if(desktop&&popup.parentElement!==dock)dock.appendChild(popup);
   if(active!==previous){previous=active;requestAnimationFrame(()=>{window.dispatchEvent(new Event('resize'))})}
 }
 const observer=new MutationObserver(sync);observer.observe(popup,{attributes:true,attributeFilter:['hidden']});
 window.addEventListener('resize',sync);
 sync();return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();