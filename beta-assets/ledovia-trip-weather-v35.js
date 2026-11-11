/* LEDOVIA Trip Weather: NWS US forecasts and alerts, no invented predictions. */
(()=>{'use strict';function init(){
 const form=document.getElementById('ldTripForm');if(!form)return false;if(document.getElementById('ldTripWeather'))return true;
 const section=document.createElement('section');section.id='ldTripWeather';section.setAttribute('aria-label','Trip destination weather');section.innerHTML='<h3>Destination Weather &amp; Alerts</h3><p id="ldTripWxStatus" role="status">Enter your destination and dates to check available forecasts.</p><div id="ldTripWxDays"></div><p id="ldTripWxAlerts">Official alerts: Not checked.</p><p class="ldTripWxNote">Forecasts are estimates and can change. Always verify conditions and official alerts before departure. Trips more than 10 days away must be checked again closer to departure.</p><button type="button" id="ldTripWxCheck">Check trip weather</button>';
 form.querySelector('.ldTripActions').before(section);
 const css=document.createElement('style');css.textContent='#ldTripWeather{border:1px solid #79c6bd;background:#123b3e;border-radius:10px;padding:14px;margin:14px 0}#ldTripWeather h3{font-size:17px;margin:0 0 9px}#ldTripWeather #ldTripWxDays{display:grid;gap:6px}#ldTripWeather .ldTripWxDay{padding:8px;background:#1b5155;border-radius:6px;font-size:13px}#ldTripWeather .ldTripWxNote{font-size:12px;color:#f7d79e}#ldTripWeather #ldTripWxCheck{margin-top:7px}';document.head.append(css);
 const status=section.querySelector('#ldTripWxStatus'),days=section.querySelector('#ldTripWxDays'),alerts=section.querySelector('#ldTripWxAlerts');let token=0;
 const say=(s)=>{status.textContent=s};const json=async url=>{const r=await fetch(url,{headers:{Accept:'application/geo+json, application/json'}});if(!r.ok)throw Error('HTTP '+r.status);return r.json()};
 const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 async function check(){
  const id=++token;days.replaceChildren();alerts.textContent='Official alerts: Not checked.';
  const destination=form.elements.namedItem('destination').value.trim(),start=form.elements.namedItem('start').value,end=form.elements.namedItem('end').value;
  if(!destination||!start||!end){say('Enter a destination, start date, and end date to check weather.');return}
  if(end<start){say('End date must be on or after start date.');return}
  const today=new Date();today.setHours(0,0,0,0);const ten=new Date(today);ten.setDate(ten.getDate()+10);
  if(start>iso(ten)){say('Forecast not yet available for your departure date (more than 10 days away). Check again closer to departure.');return}
  say('Looking up destination forecast and official alerts…');
  try{
   // Search by city, then match the optional state independently of punctuation.
   const STATES={AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'};
   const clean=destination.replace(/\s*,\s*/g,' ').replace(/\s+/g,' ').trim();
   let city=clean,state='';
   for(const [abbr,full] of Object.entries(STATES)){
    if(clean.toLowerCase().endsWith(' '+full.toLowerCase())){city=clean.slice(0,-full.length).trim();state=full;break}
   }
   if(!state){const match=clean.match(/^(.*?)\s+([a-z]{2})$/i);if(match&&STATES[match[2].toUpperCase()]){city=match[1].trim();state=STATES[match[2].toUpperCase()]}}
   if(!city){say('Enter a US city and, optionally, a state.');return}
   const search=await json('https://geocoding-api.open-meteo.com/v1/search?name='+encodeURIComponent(city)+'&count=100&countryCode=US&language=en&format=json');
   if(id!==token)return;
   const candidates=search.results||[];
   const place=state?candidates.find(p=>(p.admin1||'').toLowerCase()===state.toLowerCase()):candidates[0];
   if(!place){say(state?'No matching US city found in '+state+'. Check the destination spelling.':'Destination not found. Enter a US city and state.');return}
   const lat=place.latitude.toFixed(4),lon=place.longitude.toFixed(4);
   const point=await json('https://api.weather.gov/points/'+lat+','+lon);if(id!==token)return;
   const [forecastResult,alertResult]=await Promise.allSettled([json(point.properties.forecast),json('https://api.weather.gov/alerts/active?point='+lat+','+lon)]);if(id!==token)return;
   const location=[place.name,place.admin1].filter(Boolean).join(', ');
   const features=alertResult.status==='fulfilled'?alertResult.value.features||[]:null;
   if(features===null)alerts.textContent='Official alerts could not be checked. Do not assume the area is safe.';
   else if(features.length)alerts.textContent='Active NWS alerts ('+features.length+'): '+features.slice(0,3).map(f=>f.properties?.event||'Weather alert').join(' · ')+'. Verify full details at weather.gov.';
   else alerts.textContent='No active NWS alerts reported for '+location+' at '+new Date().toLocaleString()+'. This does not guarantee safe conditions.';
   if(forecastResult.status!=='fulfilled'){say('Forecast unavailable for '+location+'. Check again and verify with an official source.');return}
   const periods=forecastResult.value.properties?.periods||[];
   const byDay=new Map();
   for(const p of periods){const day=p.startTime?.slice(0,10);if(day&&day>=start&&day<=end){const a=byDay.get(day)||[];a.push(p);byDay.set(day,a)}}
   if(!byDay.size){say('No NWS forecast available for your selected travel dates in '+location+'. Check again closer to departure.');return}
   say('Available NWS forecast for '+location+' · Retrieved '+new Date().toLocaleString()+'.');
   for(const [day,items] of [...byDay].slice(0,10)){const div=document.createElement('div');div.className='ldTripWxDay';const parts=items.slice(0,2).map(p=>p.name+': '+p.temperature+'°'+p.temperatureUnit+' · '+p.shortForecast);div.textContent=day+' — '+parts.join(' | ');days.append(div)}
   if(end>[...byDay.keys()].at(-1)) {const note=document.createElement('p');note.textContent='Some trip dates are beyond the available NWS forecast. Check again closer to departure.';days.append(note)}
  }catch{if(id!==token)return;say('Weather service unavailable or destination unsupported. Verify forecast and alerts through official sources.');alerts.textContent='Official alerts: Not verified.'}
 }
 section.querySelector('#ldTripWxCheck').addEventListener('click',check);
 form.addEventListener('change',()=>{token++;days.replaceChildren();say('Trip details changed. Select Check trip weather for an updated forecast.');alerts.textContent='Official alerts: Not checked.'});
 return true;
}if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>100)clearInterval(t)},100)}})();