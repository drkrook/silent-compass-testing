/* LEDOVIA desktop weather — Beta, US NWS only. No fabricated conditions or alert clearance. */
(()=>{'use strict';
function start(){
 const panel=document.querySelector('#ledoviaDesktopDashboard .ld14Plan');
 if(!panel)return false;if(panel.dataset.weatherLive)return true;panel.dataset.weatherLive='1';
 const status=panel.querySelector('.ldWeatherStatus'),metrics=[...panel.querySelectorAll('.ldWeatherMetrics strong')],alert=panel.querySelector('.ldWeatherAlert');
 const controls=document.createElement('div');controls.className='ldWeatherControls';
 controls.innerHTML='<button type="button" data-wx-gps>Use my location</button><form data-wx-form><label for="ldWxCity">Trip destination (US city)</label><div><input id="ldWxCity" type="search" placeholder="e.g. Asheville, NC" required><button type="submit">Check</button></div></form><small data-wx-location>Location not selected</small>';
 status.before(controls);
 const css=document.createElement('style');css.textContent='@media(min-width:1050px){#ledoviaDesktopDashboard .ldWeatherControls{display:grid;gap:8px;margin:0 0 12px}#ledoviaDesktopDashboard .ldWeatherControls>button,#ledoviaDesktopDashboard .ldWeatherControls form button{background:#17646a;border:1px solid #79c6bd;border-radius:7px;color:white;padding:8px;cursor:pointer}#ledoviaDesktopDashboard .ldWeatherControls label,#ledoviaDesktopDashboard .ldWeatherControls small{font-size:12px;color:#d5e5e2}#ledoviaDesktopDashboard .ldWeatherControls form>div{display:flex;gap:6px;margin-top:5px}#ledoviaDesktopDashboard .ldWeatherControls input{width:100%;min-width:0;background:#e8f5f1;color:#07191c;border:0;border-radius:7px;padding:8px}#ledoviaDesktopDashboard .ldWeatherControls button:focus-visible,#ledoviaDesktopDashboard .ldWeatherControls input:focus-visible{outline:2px solid #edaa43;outline-offset:2px}}';document.head.append(css);
 const label=controls.querySelector('[data-wx-location]');let request=0;
 const show=(heading,body)=>{status.replaceChildren();const b=document.createElement('strong'),p=document.createElement('p');b.textContent=heading;p.textContent=body;status.append(b,p)};
 const showAlert=(heading,body)=>{alert.replaceChildren();const b=document.createElement('strong'),p=document.createElement('p');b.textContent=heading;p.textContent=body;alert.append(b,p)};
 const clear=()=>{metrics.forEach((e,i)=>e.textContent=i===4?'Not checked':'—');showAlert('Official alert status: Unknown','Alerts have not been verified for this location.')};
 const fetchJson=async(url)=>{const res=await fetch(url,{headers:{Accept:'application/geo+json, application/json'}});if(!res.ok)throw Error('Weather service returned '+res.status);return res.json()};
 const num=(v,d=0)=>Number.isFinite(v)?Number(v).toFixed(d):null;
 const mph=(v)=>Number.isFinite(v)?Math.round(v*0.621371)+' mph':'Unavailable';
 async function load(lat,lon,name){
  const id=++request;clear();label.textContent=name;show('Checking weather…','Retrieving official NWS observations and alerts.');
  try{
   const point=await fetchJson('https://api.weather.gov/points/'+lat.toFixed(4)+','+lon.toFixed(4));
   if(id!==request)return;
   const stationList=await fetchJson(point.properties.observationStations);
   const station=stationList.features?.[0]?.id;
   const [obsResult,alertsResult]=await Promise.allSettled([station?fetchJson(station+'/observations/latest'):Promise.reject(Error('No observation station')),fetchJson('https://api.weather.gov/alerts/active?point='+lat.toFixed(4)+','+lon.toFixed(4))]);
   if(id!==request)return;
   const now=new Date(),stamp=now.toLocaleString();
   const o=obsResult.status==='fulfilled'?obsResult.value.properties:null;
   const temp=o?.temperature?.value,feel=o?.heatIndex?.value??o?.windChill?.value;
   const f=v=>Number.isFinite(v)?Math.round(v*9/5+32)+'°F':'Unavailable';
   metrics[0].textContent=f(temp);
   const wind=o?.windSpeed?.value,gust=o?.windGust?.value;
   metrics[1].textContent=(Number.isFinite(wind)?mph(wind*3.6):'Unavailable')+' / '+(Number.isFinite(gust)?mph(gust*3.6):'Unavailable');
   metrics[2].textContent=Number.isFinite(o?.relativeHumidity?.value)?num(o.relativeHumidity.value)+'%':'Unavailable';
   metrics[3].textContent=Number.isFinite(o?.visibility?.value)?num(o.visibility.value/1609.344,1)+' mi':'Unavailable';
   const features=alertsResult.status==='fulfilled'?alertsResult.value.features||[]:null;
   const heatFreeze=features?.filter(x=>/heat|freeze|frost|cold|wind chill/i.test(x.properties?.event||''))||[];
   metrics[4].textContent=features===null?'Not checked':heatFreeze.length?heatFreeze.length+' active':'None reported';
   if(features===null)showAlert('Official alert status: Unknown','NWS alert check failed. Do not assume conditions are safe.');
   else if(features.length)showAlert(features.length+' active NWS alert(s)',features.slice(0,2).map(x=>x.properties?.event||'Weather alert').join(' · ')+'. Open Weather Alerts for details.');
   else showAlert('No active NWS alerts reported','Checked '+stamp+'. This does not guarantee safe conditions.');
   const observed=o?.timestamp?new Date(o.timestamp).toLocaleString():'time unavailable';
   show(o?'Current conditions':'Current observations unavailable',(o?(o.textDescription||'Observation available')+' · Feels like '+f(feel)+' · Observed '+observed:'No recent station reading could be retrieved.')+' · Alerts checked '+(features!==null?stamp:'unsuccessfully'));
  }catch(err){if(id!==request)return;clear();show('Weather unavailable','Could not retrieve NWS weather for this location. Check your connection and use official sources.');label.textContent=name+' · Update failed'}
 }
 controls.querySelector('[data-wx-gps]').addEventListener('click',()=>{if(!navigator.geolocation){show('GPS unavailable','This browser does not support geolocation. Enter a destination instead.');return}show('Requesting location…','Allow location access to check nearby weather.');navigator.geolocation.getCurrentPosition(p=>load(p.coords.latitude,p.coords.longitude,'Current GPS location'),()=>show('Location unavailable','Permission denied or GPS unavailable. Enter a destination instead.'),{timeout:12000,maximumAge:300000})});
 controls.querySelector('[data-wx-form]').addEventListener('submit',async e=>{e.preventDefault();const q=controls.querySelector('input').value.trim();if(!q)return;const id=++request;clear();show('Finding destination…','Searching for '+q);try{const data=await fetchJson('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(q)+'&count=5&countryCode=US&language=en&format=json');if(id!==request)return;const place=data.results?.[0];if(!place)throw Error('No matching US destination');load(place.latitude,place.longitude,[place.name,place.admin1].filter(Boolean).join(', '))}catch(err){if(id!==request)return;show('Destination not found','Try a different US city or town.');clear()}});
 if(navigator.geolocation)controls.querySelector('[data-wx-gps]').click();else show('Location required','Enter a US destination to check weather.');
 return true;
}
if(!start()){let n=0;const timer=setInterval(()=>{if(start()||++n>100)clearInterval(timer)},100)}
})();