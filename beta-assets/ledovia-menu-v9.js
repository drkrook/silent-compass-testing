/* Beta v0.8.9: simplify drawer, preserve all existing navigation handlers. */
(()=>{'use strict';function init(){
 const panel=document.getElementById('ledoviaMenuPanel'),family=document.getElementById('scFamilyOpen'),places=document.getElementById('ledoviaPlaces');
 if(!panel||!family||!places)return false;
 if(panel.dataset.v9)return true;panel.dataset.v9='ready';
 const top=panel.querySelector('.ledoviaPanelTop'),brand=top?.querySelector('.ledoviaDrawerBrand');
 if(brand){brand.querySelector('span:last-child')?.remove();brand.querySelector('.ledoviaDrawerLogo')?.classList.add('ledoviaLogoOnly');}
 // Remove only the redundant section; keep Family Circles accessible in mobile navigation.
 const group=document.getElementById('ledoviaFamily');const heading=group?.previousElementSibling;
 if(heading?.tagName==='H3')heading.remove();
 if(group){group.remove();}
 function relocate(){const desktop=window.matchMedia('(min-width:701px)').matches;
 if(!desktop&&family.parentElement!==places)places.append(family);
 // Desktop remains on Home via the existing v8 responsive layout handler.
 }
 relocate();window.addEventListener('resize',()=>requestAnimationFrame(relocate),{passive:true});
 const shapes={places:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',offline:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',family:'<circle cx="9" cy="8" r="3"/><path d="M2 21v-2a7 7 0 0 1 14 0v2"/><circle cx="18" cy="9" r="2.5"/><path d="M18 16c2.5 0 4 2 4 5"/>'};
 for(const [id,shape] of [['ledoviaPlaces',shapes.places],['ledoviaPreparedness',shapes.offline]]){
 const b=document.getElementById(id)?.querySelector('button');if(!b)continue;
 let ico=b.querySelector('.ledoviaNavIcon');
 if(!ico){ico=document.createElement('span');ico.className='ledoviaNavIcon';ico.setAttribute('aria-hidden','true');b.prepend(ico)}
 ico.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+shape+'</svg>';
 if(!b.querySelector('.ledoviaNavChevron')){const c=document.createElement('span');c.className='ledoviaNavChevron';c.textContent='›';c.setAttribute('aria-hidden','true');b.append(c)}
 }
 if(!family.querySelector('.ledoviaNavIcon')){const ico=document.createElement('span');ico.className='ledoviaNavIcon';ico.setAttribute('aria-hidden','true');ico.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+shapes.family+'</svg>';family.prepend(ico);const c=document.createElement('span');c.className='ledoviaNavChevron';c.textContent='›';c.setAttribute('aria-hidden','true');family.append(c)}
 family.addEventListener('click',()=>{if(family.closest('#ledoviaMenuPanel'))panel.querySelector('[data-close-menu]')?.click()});
 const select=document.getElementById('scLanguage');if(select){const wrap=select.closest('.scLanguageBar');wrap?.classList.add('ledoviaLanguageSetting');}
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>100)clearInterval(t)},100)}
})();