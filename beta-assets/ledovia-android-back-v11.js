/* Ledovia Beta v0.8.11 — Android/PWA Back navigation.
   History is UI-only; no localStorage, map data or service-worker changes. */
(()=>{'use strict';
function init(){
 const tabs=window.GridDownTabs,app=document.getElementById('appMain');
 if(!tabs?.activate||!app||!document.getElementById('ledoviaMenuPanel'))return false;
 if(window.__ledoviaBackV11)return true;window.__ledoviaBackV11=true;
 const ids=['home','nws','help','map','routes','places','hazards','layers','offline','terrain','survival','account'];
 let current=ids.find(id=>document.getElementById('tab-'+id)?.getAttribute('aria-selected')==='true')||'home';
 let restoring=false;
 const base={ledoviaV11:true,screen:current};
 try{history.replaceState({...history.state,...base},'',location.href)}catch(e){return false}
 function screen(){return ids.find(id=>document.getElementById('tab-'+id)?.getAttribute('aria-selected')==='true')||current}
 function overlay(){if(document.getElementById('scLedoviaCompassView')?.classList.contains('scOpen'))return 'compass';
 if(document.getElementById('scFamilyModal'))return 'family';
 if(document.getElementById('ledoviaMenuPanel')?.hidden===false)return 'menu';
 if(document.getElementById('ledoviaNotificationPanel')?.hidden===false)return 'notice';
 return null}
 function closeOverlay(type){
 if(type==='compass')document.getElementById('scCompassClose')?.click();
 if(type==='family'){const modal=document.getElementById('scFamilyModal');if(modal){const buttons=Array.from(modal.querySelectorAll('button'));const close=buttons.find(b=>/close|cerrar|fermer|关闭|닫기/i.test(b.textContent||''));if(close)close.click();else modal.remove()}}
 if(type==='menu')document.querySelector('#ledoviaMenuPanel [data-close-menu]')?.click();
 if(type==='notice')document.querySelector('#ledoviaNotificationPanel [data-close-notice]')?.click();
 }
 function record(){
 if(restoring)return;
 const nextScreen=screen(),nextOverlay=overlay();
 const previous=history.state?.ledoviaV11?history.state:{screen:current,overlay:null};
 if(nextScreen===previous.screen&&nextOverlay===previous.overlay)return;
 current=nextScreen;
 try{history.pushState({ledoviaV11:true,screen:nextScreen,overlay:nextOverlay},'',location.href)}catch(e){}
 }
 const original=tabs.activate;
 tabs.activate=function(id,...args){const result=original.call(this,id,...args);queueMicrotask(record);return result};
 // Internal tab handlers capture their original closure; observe their completed UI changes.
 document.addEventListener('click',e=>{
 const target=e.target instanceof Element?e.target:null;if(!target)return;
 if(target.closest('#scCompassClose,#scFamilyModal button,[data-close-menu],[data-close-notice],#ledoviaBackdrop'))return;
 if(target.closest('button,[role="tab"]'))setTimeout(record,0);
 },false);
 window.addEventListener('popstate',e=>{
 const destination=e.state?.ledoviaV11?e.state:null;
 const active=overlay();
 restoring=true;
 if(active&&active!==destination?.overlay)closeOverlay(active);
 if(destination){if(destination.screen!==screen())original.call(tabs,destination.screen);current=destination.screen;
 if(destination.overlay==='menu'&&document.getElementById('ledoviaMenuPanel')?.hidden)document.getElementById('ledoviaMenuButton')?.click();
 if(destination.overlay==='notice'&&document.getElementById('ledoviaNotificationPanel')?.hidden)document.getElementById('ledoviaBellButton')?.click();
 }else if(screen()!=='home'){original.call(tabs,'home');current='home'}
 setTimeout(()=>{restoring=false},0);
 });
 return true;
}
if(!init()){let count=0;const t=setInterval(()=>{if(init()||++count>100)clearInterval(t)},100)}
})();