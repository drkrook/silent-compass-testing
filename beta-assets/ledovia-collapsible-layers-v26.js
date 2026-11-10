/* Ledovia Beta v0.8.26 — desktop resource-layer disclosure, presentation only. */
(()=>{'use strict';
function init(){
 const app=document.getElementById('appMain');
 const panel=document.getElementById('ld19Layers');
 const menu=document.getElementById('mapResourceMenu');
 if(!app||!panel||!menu)return false;
 if(document.getElementById('ld26ResourceToggle'))return true;
 const heading=panel.querySelector('h2');
 if(!heading)return false;
 const toggle=document.createElement('button');
 toggle.id='ld26ResourceToggle';toggle.type='button';
 toggle.setAttribute('aria-controls','mapResourceMenu');
 toggle.textContent='Resource Layers';
 heading.replaceWith(toggle);
 let expanded=true;
 try{const v=localStorage.getItem('ledovia-resource-layers-expanded');if(v==='false')expanded=false}catch{}
 function sync(){
   const desktop=matchMedia('(min-width:1100px)').matches;
   const full=document.fullscreenElement===document.getElementById('mapwrap');
   const visible=desktop&&!full;
   toggle.hidden=!visible;
   toggle.setAttribute('aria-expanded',String(expanded));
   toggle.textContent=(expanded?'▾ ':'▸ ')+'Resource Layers';
   panel.classList.toggle('ld26ResourceCollapsed',visible&&!expanded);
 }
 toggle.addEventListener('click',()=>{
   expanded=!expanded;
   try{localStorage.setItem('ledovia-resource-layers-expanded',String(expanded))}catch{}
   sync();
 });
 document.addEventListener('fullscreenchange',sync);
 window.addEventListener('resize',sync);
 sync();return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();
