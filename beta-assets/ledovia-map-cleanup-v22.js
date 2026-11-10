/* Ledovia Beta v0.8.22 — desktop map cleanup; preserve existing layer checkboxes. */
(()=>{'use strict';
function init(){
 const app=document.getElementById('appMain'),map=document.getElementById('mapwrap'),side=document.getElementById('sidePanel');
 const resource=document.getElementById('mapResourceMenu'),home=document.getElementById('ld19Layers');
 if(!app||!map||!side||!resource||!home)return false;
 if(window.__ld22Cleanup)return true;window.__ld22Cleanup=true;
 const desktop=()=>matchMedia('(min-width:1100px)').matches;
 const isFull=()=>document.fullscreenElement===map;
 const toggle=document.createElement('button');toggle.id='ld22LayersToggle';toggle.type='button';
 toggle.textContent='☷ Layers';toggle.setAttribute('aria-controls','ld22FullscreenLayers');toggle.setAttribute('aria-expanded','false');
 toggle.title='Show or hide resource layers';
 const floating=document.createElement('section');floating.id='ld22FullscreenLayers';floating.hidden=true;
 const h=document.createElement('div');h.className='ld22LayerHeading';
 const title=document.createElement('strong');title.textContent='Map Layers';
 const close=document.createElement('button');close.type='button';close.textContent='× Close';close.setAttribute('aria-label','Close map layers');
 h.append(title,close);floating.append(h);map.append(toggle,floating);
 const setOpen=v=>{floating.hidden=!v;toggle.setAttribute('aria-expanded',String(v));};
 toggle.addEventListener('click',()=>setOpen(floating.hidden));
 close.addEventListener('click',()=>setOpen(false));
 function sync(){
   const full=desktop()&&isFull();
   toggle.hidden=!full;
   if(full){
     if(resource.parentElement!==floating)floating.appendChild(resource);
     resource.hidden=false;
   }else{
     setOpen(false);
     if(desktop()&&resource.parentElement!==home)home.appendChild(resource);
     // v19 owns mobile restoration of the original resource control.
   }
 }
 document.addEventListener('fullscreenchange',()=>requestAnimationFrame(sync));
 window.addEventListener('resize',sync);
 // Keep layer panel out of the way when a marker is selected, but do not change selections.
 map.addEventListener('pointerdown',e=>{if(isFull()&&!floating.hidden&&!floating.contains(e.target)&&e.target!==toggle)setOpen(false)},true);
 sync();return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();