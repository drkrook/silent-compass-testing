/* Ledovia Beta v0.8.20: dismiss map-only resource details on navigation away. */
(()=>{'use strict';
function init(){
 const app=document.getElementById('appMain');
 const popup=document.getElementById('scPlaceDetailPopup');
 if(!app||!popup)return false;
 if(window.__ld20ResourceNavigation)return true;
 window.__ld20ResourceNavigation=true;
 let wasMap=app.classList.contains('scMapSimple');
 const sync=()=>{
   const onMap=app.classList.contains('scMapSimple')&&!app.classList.contains('scHomeActive');
   if(wasMap&&!onMap&&!popup.hidden){
     popup.hidden=true;
     app.classList.remove('ld18ResourceOpen');
     const dock=document.getElementById('ld18ResourceDock');
     if(dock)dock.hidden=true;
   }
   wasMap=onMap;
 };
 new MutationObserver(sync).observe(app,{attributes:true,attributeFilter:['class']});
 sync();
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();