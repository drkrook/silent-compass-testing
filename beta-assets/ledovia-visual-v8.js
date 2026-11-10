/* Ledovia Beta v8 — menu presentation and desktop Family Circles placement only. */
(()=>{'use strict';function init(){
 const menu=document.getElementById('ledoviaMenuPanel'),home=document.querySelector('.scSimpleHome'),grid=home?.querySelector('.scHomeGrid'),family=document.getElementById('scFamilyOpen');
 if(!menu||!home||!grid||!family)return false;
 if(menu.dataset.v8==='ready')return true;menu.dataset.v8='ready';
 const top=menu.querySelector('.ledoviaPanelTop');if(top){
 const brand=document.createElement('div');brand.className='ledoviaDrawerBrand';
 brand.innerHTML='<span class="ledoviaDrawerLogo" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 34 17 13l8 12 7-9 13 18M10 34l7-10 7 10M25 34l7-9 8 9M7 39h34"/></svg></span><span><strong>LEDOVIA</strong><small>Explore confidently</small></span>';
 top.prepend(brand);
 const old=top.querySelector('strong');if(old&&old.parentElement===top)old.remove();
 }
 const icons={places:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',family:'<circle cx="9" cy="8" r="3"/><path d="M2 21v-2a7 7 0 0 1 14 0v2"/><circle cx="18" cy="9" r="2.5"/><path d="M18 16c2.5 0 4 2 4 5"/>',offline:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'};
 for(const [container,shape] of [['ledoviaPlaces',icons.places],['ledoviaFamily',icons.family],['ledoviaPreparedness',icons.offline]]){
 const b=menu.querySelector('#'+container+' > button');if(!b)continue;
 const ico=document.createElement('span');ico.className='ledoviaNavIcon';ico.setAttribute('aria-hidden','true');ico.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+shape+'</svg>';
 const chev=document.createElement('span');chev.className='ledoviaNavChevron';chev.setAttribute('aria-hidden','true');chev.textContent='›';
 b.prepend(ico);b.append(chev);
 }
 const settings=menu.querySelector('#ledoviaSettings'),language=settings?.querySelector('.scLanguageBar');
 if(language){const sub=document.createElement('p');sub.className='ledoviaSettingHint';sub.textContent='Choose your preferred app language';settings.prepend(sub)}
 const familyMenu=menu.querySelector('#ledoviaFamily');
 function layout(){if(window.matchMedia('(min-width: 701px)').matches){if(family.parentElement!==grid){const hazard=grid.querySelector('[data-go="hazards"]');if(hazard)hazard.after(family);else grid.append(family)}family.classList.add('ledoviaFamilyDesktop');}else{if(family.parentElement!==familyMenu)familyMenu.append(family);family.classList.remove('ledoviaFamilyDesktop')}}
 layout();window.addEventListener('resize',layout,{passive:true});
 return true;
}
if(!init()){let tries=0;const t=setInterval(()=>{if(init()||++tries>100)clearInterval(t)},100)}
})();