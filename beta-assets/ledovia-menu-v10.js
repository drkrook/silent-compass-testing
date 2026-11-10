/* Ledovia Beta v0.8.10: correct drawer header and keep Family Circles visible on Home on every screen. */
(()=>{'use strict';
function apply(){
 const menu=document.getElementById('ledoviaMenuPanel'),grid=document.querySelector('.scSimpleHome .scHomeGrid'),family=document.getElementById('scFamilyOpen');
 if(!menu||!grid||!family)return false;
 const top=menu.querySelector('.ledoviaPanelTop');
 if(top){for(const el of Array.from(top.children)){if(el.matches('strong'))el.remove();}
 const brand=top.querySelector('.ledoviaDrawerBrand');if(brand){for(const child of Array.from(brand.children)){if(!child.classList.contains('ledoviaDrawerLogo'))child.remove();}}
 }
 const oldGroup=document.getElementById('ledoviaFamily');oldGroup?.previousElementSibling?.matches('h3')&&oldGroup.previousElementSibling.remove();oldGroup?.remove();
 // Keep the actual Family Circles button and original click handler, not a duplicate.
 if(family.parentElement!==grid){const hazard=grid.querySelector('[data-go="hazards"]');if(hazard)hazard.after(family);else grid.append(family)}
 family.classList.add('ledoviaFamilyDesktop');
 menu.querySelectorAll('.ledoviaNavIcon').forEach(icon=>{icon.style.setProperty('display','inline-flex','important');icon.style.setProperty('visibility','visible','important')});
 return true;
}
let attempts=0;const t=setInterval(()=>{if(apply()&&++attempts>12||attempts++>80)clearInterval(t)},150);
window.addEventListener('resize',()=>requestAnimationFrame(apply),{passive:true});
})();