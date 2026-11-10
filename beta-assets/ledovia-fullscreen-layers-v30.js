/* Ledovia Beta v0.8.30: fullscreen resource controls collapsed by default. */
(()=>{'use strict';
function init(){
 const map=document.getElementById('mapwrap');
 const panel=document.getElementById('ld22FullscreenLayers');
 const menu=document.getElementById('mapResourceMenu');
 if(!map||!panel||!menu)return false;
 if(document.getElementById('ld30FullscreenResourceToggle'))return true;
 const toggle=document.createElement('button');
 toggle.type='button';toggle.id='ld30FullscreenResourceToggle';
 toggle.setAttribute('aria-controls','mapResourceMenu');
 // Keep fullscreen independent of normal sidebar's persisted preference.
 let expanded=false;
 function sync(){
  const full=document.fullscreenElement===map;
  toggle.hidden=!full;
  toggle.setAttribute('aria-expanded',String(expanded));
  toggle.textContent=(expanded?'▾ ':'▸ ')+'Resource Layers';
  panel.classList.toggle('ld30ResourcesCollapsed',full&&!expanded);
 }
 toggle.addEventListener('click',()=>{expanded=!expanded;sync()});
 const heading=panel.querySelector('.ld22LayerHeading');
 if(heading)heading.insertAdjacentElement('afterend',toggle);
 else panel.prepend(toggle);
 document.addEventListener('fullscreenchange',()=>{
  if(document.fullscreenElement===map)expanded=false;
  requestAnimationFrame(sync);
 });
 window.addEventListener('resize',sync);
 sync();return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();
