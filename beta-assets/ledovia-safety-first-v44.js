/* LEDOVIA safety-first home layout — development-only, non-destructive.
 * Moves existing buttons, preserving listeners and all original actions.
 * Designed to run after the existing home scripts. */
(()=>{'use strict';
 function arrange(){
  const grid=document.querySelector('.scSimpleHome .scHomeGrid');
  if(!grid)return false;
  const emergency=grid.querySelector(':scope > .scHomeSOS');
  const weather=grid.querySelector(':scope > .scHomeNWS');
  if(!emergency||!weather)return false;
  if(grid.firstElementChild!==emergency)grid.insertBefore(emergency,grid.firstChild);
  if(emergency.nextElementSibling!==weather)emergency.after(weather);
  let divider=grid.querySelector(':scope > .ledoviaSafetyDivider');
  if(!divider){
    divider=document.createElement('div');
    divider.className='ledoviaSafetyDivider';
    divider.setAttribute('role','separator');
    divider.setAttribute('aria-label','Adventure and survival tools');
    divider.innerHTML='<span>ADVENTURE &amp; SURVIVAL</span>';
  }
  if(weather.nextElementSibling!==divider)weather.after(divider);
  return true;
 }
 if(!arrange()){
   let attempts=0;
   const timer=setInterval(()=>{if(arrange()||++attempts>=80)clearInterval(timer)},150);
 }
})();