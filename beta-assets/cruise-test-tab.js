/* Silent Compass Cruise Test - beta-only isolated panel. Online OSM basemap; GPS works independently. */
(()=>{'use strict';
const stops=[['PortMiami',25.7781,-80.1794],['Celebration Key (approx.)',26.55,-78.65],['Half Moon Cay (approx.)',24.57,-75.96],['Nassau',25.078,-77.339]];
function boot(){
 if(document.getElementById('scCruiseTab'))return;
 const host=document.querySelector('body');if(!host)return;
 const css=document.createElement('style');css.textContent=`
 #scCruiseTab{position:fixed;right:12px;bottom:80px;z-index:9000;background:#086d67;color:white;border:2px solid #8de7d9;border-radius:25px;padding:12px 18px;font:700 15px system-ui}
 #scCruiseScreen{position:fixed;inset:0;z-index:9001;background:#102c2b;color:#f1faf8;overflow:auto;font:15px system-ui;display:none}
 #scCruiseScreen.scOpen{display:block}#scCruiseScreen button{min-height:44px;border-radius:9px;padding:8px 12px;background:#235a55;color:white;border:1px solid #7cc0b5}
 #scCruiseScreen .scHeader{position:sticky;top:0;background:#102c2b;z-index:3;padding:12px;display:flex;justify-content:space-between;align-items:center;gap:8px}
 #scCruiseScreen .scBody{padding:10px 12px 32px;max-width:800px;margin:auto}
 #scCruiseMap{height:42vh;min-height:250px;border:1px solid #649b91;border-radius:12px;overflow:hidden;background:#173c40}
 #scCruisePorts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}
 #scCruiseStatus{padding:10px;background:#1d4442;border-radius:10px;margin:10px 0;overflow-wrap:anywhere}
 #scCruiseScreen .scNote{font-size:12px;color:#c4ddd7}body.scCruiseActive{overflow:hidden}
 `;document.head.appendChild(css);
 const open=document.createElement('button');open.id='scCruiseTab';open.textContent='🚢 Cruise Test';open.type='button';host.appendChild(open);
 const panel=document.createElement('section');panel.id='scCruiseScreen';panel.setAttribute('aria-label','Cruise Test beta');panel.innerHTML=`
 <div class="scHeader"><strong>🚢 Cruise Test · Beta</strong><button id="scCruiseClose" type="button">✕ Close</button></div>
 <div class="scBody"><p class="scNote">Carnival Sunrise · Miami and Bahamas field test. Experimental location display only — NOT marine navigation or a nautical chart.</p>
 <div id="scCruiseMap" role="region" aria-label="Cruise area map"></div>
 <div id="scCruiseStatus" role="status">GPS not started. Map needs internet on first load.</div>
 <div><button id="scCruiseStart">▶ Start GPS</button> <button id="scCruiseStop" disabled>■ Stop GPS</button> <button id="scCruiseCenter">Center on GPS</button></div>
 <strong style="display:block;margin-top:16px">Cruise stops</strong><div id="scCruisePorts"></div>
 <p class="scNote">Online OpenStreetMap tiles are for ordinary interactive viewing only; this prototype does not bulk-download or promise offline basemaps. GPS may be unavailable inside the ship. Location updates pause when the tab is hidden. Never use for ship navigation.</p>
 </div>`;host.appendChild(panel);
 const status=panel.querySelector('#scCruiseStatus'),start=panel.querySelector('#scCruiseStart'),stop=panel.querySelector('#scCruiseStop');let map=null,marker=null,accuracy=null,watch=null,last=null,loaded=false;
 function show(){panel.classList.add('scOpen');document.body.classList.add('scCruiseActive');if(!loaded)loadMap();else if(map)setTimeout(()=>map.invalidateSize(),80)}
 function hide(){panel.classList.remove('scOpen');document.body.classList.remove('scCruiseActive');pause()}
 open.onclick=show;panel.querySelector('#scCruiseClose').onclick=hide;
 function loadMap(){if(loaded)return;loaded=true;
  const link=document.createElement('link');link.rel='stylesheet';link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(link);
  const script=document.createElement('script');script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload=()=>{if(!window.L)return;map=L.map('scCruiseMap',{zoomControl:true}).setView([25.5,-78.3],6);
   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:18}).addTo(map);
   stops.forEach(([name,lat,lon])=>L.marker([lat,lon]).addTo(map).bindPopup(name));
   if(last)draw(last);setTimeout(()=>map.invalidateSize(),100)};
  script.onerror=()=>{status.textContent='Map library could not load. Check internet. GPS coordinates can still be tested.'};document.head.appendChild(script);
 }
 function draw(p){if(!map||!window.L)return;const c=p.coords,pos=[c.latitude,c.longitude];
  if(!marker)marker=L.circleMarker(pos,{radius:9,color:'#073c37',weight:3,fillColor:'#4dffcb',fillOpacity:1}).addTo(map);
  else marker.setLatLng(pos);
  if(!accuracy)accuracy=L.circle(pos,{radius:c.accuracy,color:'#4dffcb',weight:1,fillOpacity:.08}).addTo(map);
  else accuracy.setLatLng(pos).setRadius(c.accuracy);
 }
 function update(p){last=p;const c=p.coords;status.textContent='GPS: '+c.latitude.toFixed(5)+'°, '+c.longitude.toFixed(5)+'° | Accuracy ±'+Math.round(c.accuracy)+' m | '+new Date(p.timestamp).toLocaleTimeString();draw(p)}
 function pause(){if(watch!==null)navigator.geolocation.clearWatch(watch);watch=null;start.disabled=false;stop.disabled=true}
 start.onclick=()=>{if(!navigator.geolocation){status.textContent='GPS unavailable on this device';return}
  status.textContent='Waiting for GPS permission/position…';watch=navigator.geolocation.watchPosition(update,e=>{status.textContent='GPS: '+e.message},{enableHighAccuracy:true,maximumAge:0,timeout:20000});start.disabled=true;stop.disabled=false};
 stop.onclick=()=>{pause();status.textContent=last?'GPS paused. Last fix: '+new Date(last.timestamp).toLocaleTimeString():'GPS stopped'};
 panel.querySelector('#scCruiseCenter').onclick=()=>{if(last&&map)map.setView([last.coords.latitude,last.coords.longitude],12);else status.textContent='Start GPS and wait for a position first.'};
 const ports=panel.querySelector('#scCruisePorts');stops.forEach(([name,lat,lon])=>{const b=document.createElement('button');b.type='button';b.textContent=name;b.onclick=()=>{if(map)map.setView([lat,lon],12);else status.textContent='Map is not loaded yet. Check internet.'};ports.appendChild(b)});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&watch!==null){pause();status.textContent='GPS paused while app is in background. Tap Start to resume.'}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();