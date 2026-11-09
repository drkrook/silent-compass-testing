/* Silent Compass Cruise Field Test — beta-only prototype. No marine navigation. */
(()=>{'use strict';
const STOPS=[
 ['PortMiami',25.7781,-80.1794],
 ['Celebration Key',26.55,-78.65],
 ['Half Moon Cay',24.57,-75.96],
 ['Nassau',25.078,-77.339]
];
function init(){
 if(document.getElementById('scCruisePanel'))return;
 const map=document.getElementById('map'),locate=document.getElementById('locate');
 if(!map||!locate)return;
 const panel=document.createElement('section');panel.id='scCruisePanel';
 panel.style.cssText='position:absolute;z-index:40;left:10px;bottom:12px;width:min(330px,calc(100% - 20px));max-height:55vh;overflow:auto;background:#102c2b;color:white;border:1px solid #6cb2a8;border-radius:12px;padding:12px;box-shadow:0 4px 18px #0009;font:14px system-ui';
 panel.innerHTML='<strong>🚢 Bahamas Cruise Field Test</strong><p style="font-size:12px">Experimental GPS location only. Not a marine chart or navigation aid.</p><div id="scCruiseGps" role="status">GPS not started.</div><button id="scCruiseStart" type="button">Start GPS updates</button> <button id="scCruiseStop" type="button" disabled>Stop</button><details><summary>Port coordinates (reference only)</summary><div id="scCruiseStops"></div></details>';
 const wrap=map.parentElement;wrap.appendChild(panel);
 for(const [name,lat,lon] of STOPS){const p=document.createElement('p');p.textContent=name+': '+lat.toFixed(3)+', '+lon.toFixed(3);panel.querySelector('#scCruiseStops').appendChild(p)}
 const out=panel.querySelector('#scCruiseGps'),start=panel.querySelector('#scCruiseStart'),stop=panel.querySelector('#scCruiseStop');
 let watch=null,latest=null;
 function show(p){latest=p;const c=p.coords;out.textContent='Lat '+c.latitude.toFixed(5)+'°, Lon '+c.longitude.toFixed(5)+'° | Accuracy ±'+Math.round(c.accuracy)+' m | Updated '+new Date(p.timestamp).toLocaleTimeString()+' | GPS may be inaccurate inside ship.'}
 start.onclick=()=>{
  if(!navigator.geolocation){out.textContent='Geolocation unavailable';return}
  out.textContent='Requesting location permission…';
  watch=navigator.geolocation.watchPosition(show,e=>{out.textContent='GPS unavailable: '+e.message},{enableHighAccuracy:true,maximumAge:0,timeout:20000});
  start.disabled=true;stop.disabled=false;
 };
 stop.onclick=()=>{if(watch!==null)navigator.geolocation.clearWatch(watch);watch=null;start.disabled=false;stop.disabled=true;out.textContent=latest?'GPS paused. Last reading: '+new Date(latest.timestamp).toLocaleTimeString():'GPS stopped.'};
 const center=document.createElement('button');center.textContent='Center existing map on GPS';center.type='button';center.onclick=()=>locate.click();panel.insertBefore(center,panel.querySelector('details'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&watch!==null){navigator.geolocation.clearWatch(watch);watch=null;start.disabled=false;stop.disabled=true;out.textContent='GPS paused while app is hidden. Tap Start to resume.'}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
