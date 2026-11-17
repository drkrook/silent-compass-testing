/* LEDOVIA Gucci Map v47 — Beta-only map controls and GPS overlay.
   Uses the existing map engine and existing location, directions and hazard tabs.
   Does not alter saved data, map gestures, or map tile storage. */
(()=>{'use strict';
let state=null,position=null;
const rad=Math.PI/180;
const svg=(path)=>'<svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
const icons={
 layers:svg('<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 10 9 5 9-5M3 17l9 5 9-5"/>'),
 resources:svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m8 16 2-5 2 2 3-5 2 8M7 8h.01M17 17h.01"/>'),
 locate:svg('<circle cx="12" cy="12" r="6"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/><circle cx="12" cy="12" r="1" fill="currentColor"/>'),
 pin:'<span class="ld47RedPin" aria-hidden="true">📍</span>',
 menu:svg('<path d="M4 6h16M4 12h16M4 18h16"/>')
};
function project(la,lo,z){const scale=256*2**z;return [(lo+180)/360*scale,(1-Math.log(Math.tan(la*rad)+1/Math.cos(la*rad))/Math.PI)/2*scale]}
function draw(){
 const map=document.getElementById('mapwrap'),marker=document.getElementById('ld47GpsMarker');if(!map||!marker||!position||!state)return;
 const [x,y]=project(position.latitude,position.longitude,state.zoom),[cx,cy]=project(state.lat,state.lon,state.zoom);
 const px=x-cx+map.clientWidth/2,py=y-cy+map.clientHeight/2;
 marker.style.left=px+'px';marker.style.top=py+'px';
 const visible=px>=-60&&py>=-60&&px<=map.clientWidth+60&&py<=map.clientHeight+60;
 marker.hidden=!visible;
 const accuracy=document.getElementById('ld47GpsAccuracy');
 if(accuracy){const metersPerPixel=156543.03392*Math.cos(position.latitude*rad)/2**state.zoom;const diameter=Math.max(20,Math.min(1000,2*position.accuracy/metersPerPixel));accuracy.style.width=diameter+'px';accuracy.style.height=diameter+'px';accuracy.hidden=!Number.isFinite(position.accuracy)||position.accuracy<=0;}
}
window.addEventListener('ld47-map-state',e=>{state=e.detail;draw()});
function button(id,label,icon,handler){const b=document.createElement('button');b.id=id;b.type='button';b.className='ld47MapButton';b.title=label;b.setAttribute('aria-label',label);b.innerHTML='<span class="ld47ControlIcon">'+icon+'</span><span class="ld47ControlLabel">'+(id==='ld47GpsButton'?'My Location':label)+'</span>';b.addEventListener('click',handler);return b}
function init(){
 const map=document.getElementById('mapwrap'),nav=document.getElementById('scSimpleMapNav');
 if(!map||!nav||!document.getElementById('mapLayersButton')||!document.getElementById('mapResourceButton'))return false;
 if(document.getElementById('ld47GpsButton'))return true;
 const header=document.querySelector('body > header');
 if(header&&!document.getElementById('ld47CompactBrand')){
  const brand=document.createElement('div');brand.id='ld47CompactBrand';
  brand.setAttribute('aria-label','LEDOVIA — Ready for the Adventure');
  brand.innerHTML='<strong>LEDO<span>VIA</span></strong><small>READY FOR THE ADVENTURE</small>';
  header.append(brand);
 }
 const home=document.getElementById('scMapHome'),tools=document.getElementById('scMapTools');
 if(home){home.innerHTML=icons.pin.replace('📍',svg('<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>'))+'<span>Locations</span>';home.id='ld47Locations';home.onclick=()=>document.getElementById('tab-places')?.click();}
 if(tools){tools.innerHTML=svg('<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/>')+'<span>Hazards</span>';tools.id='ld47Hazards';tools.removeAttribute('aria-expanded');tools.onclick=()=>document.getElementById('tab-hazards')?.click();}
 const dirs=document.getElementById('scMapDirections');if(dirs)dirs.innerHTML=svg('<path d="m22 2-7 20-4-9-9-4 20-7Z"/>')+'<span>Directions</span>';
 // Existing map-workspace code expects scMapTools to exist; keep it as an invisible
 // compatibility control to avoid breaking activate('map') and legacy tools.
 const compatibility=document.createElement('button');compatibility.id='scMapTools';compatibility.type='button';compatibility.hidden=true;compatibility.setAttribute('aria-expanded','false');nav.append(compatibility);
 const controls=document.createElement('div');controls.id='ld47MapControls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Map controls');
 const layers=document.getElementById('mapLayersButton'),resources=document.getElementById('mapResourceButton');
 layers.textContent='';layers.innerHTML='<span class="ld47ControlIcon">'+icons.layers+'</span><span class="ld47ControlLabel">Layers</span>';layers.title='Map layers';layers.setAttribute('aria-label','Map layers');
 resources.textContent='';resources.innerHTML='<span class="ld47ControlIcon">'+icons.resources+'</span><span class="ld47ControlLabel">Resources</span><span class="ld47ResourceActive" aria-hidden="true"></span>';resources.title='Resource layers';resources.setAttribute('aria-label','Resource layers');
 const locate=button('ld47GpsButton','Find my location',icons.locate,()=>{
  if(!navigator.geolocation){message('GPS is unavailable on this device.');return;}
  locate.disabled=true;locate.setAttribute('aria-busy','true');message('Finding your location…');
  navigator.geolocation.getCurrentPosition(p=>{
   position={latitude:p.coords.latitude,longitude:p.coords.longitude,accuracy:p.coords.accuracy};
   // Reuse the existing GPS map-centering action via the existing map engine.
   if(typeof window.__ld47SetCenter==='function')window.__ld47SetCenter(position.latitude,position.longitude,15);else document.getElementById('locate')?.click();
   locate.disabled=false;locate.removeAttribute('aria-busy');message('Location found. Blue dot shows your position.');draw();
  },e=>{locate.disabled=false;locate.removeAttribute('aria-busy');message('Location unavailable: '+e.message);},{enableHighAccuracy:true,timeout:12000,maximumAge:30000});
 });
 const pin=button('ld47DropPin','Drop pin',icons.pin,()=>{document.getElementById('tab-places')?.click();message('Use Locations to save a point. Hazard Pins and Danger Zones are not yet enabled.');});
 controls.append(locate,pin);map.append(controls);
 const marker=document.createElement('div');marker.id='ld47GpsMarker';marker.hidden=true;marker.setAttribute('role','img');marker.setAttribute('aria-label','Your GPS location');
 marker.innerHTML='<span id="ld47GpsAccuracy"></span><span class="ld47GpsDot"></span>';map.append(marker);
 const status=document.createElement('div');status.id='ld47GpsStatus';status.hidden=true;status.setAttribute('role','status');status.setAttribute('aria-live','polite');map.append(status);
 function message(s){status.textContent=s;status.hidden=false;clearTimeout(message.timeout);message.timeout=setTimeout(()=>status.hidden=true,5500);}

 // Upgrade only the resource-menu presentation. Keep its existing checkboxes and listeners.
 const resourceMenu=document.getElementById('mapResourceMenu');
 const resourceToggle=document.getElementById('mapResourceButton');
 if(resourceMenu&&resourceToggle){
  resourceMenu.classList.add('ld47PremiumResources');
  const titlebar=document.createElement('div');titlebar.className='ld47ResourcesHeading';
  const title=document.createElement('div');title.innerHTML='<strong>Resource Layers</strong><small>Choose what appears on your map</small>';
  const close=document.createElement('button');close.type='button';close.className='ld47ResourcesClose';
  close.setAttribute('aria-label','Close resource layers');close.textContent='×';
  close.addEventListener('click',()=>{resourceToggle.click();resourceToggle.focus()});
  titlebar.append(title,close);resourceMenu.prepend(titlebar);
  const sync=()=>{resourceMenu.querySelectorAll('label.check').forEach(label=>{
    const input=label.querySelector('input[type="checkbox"]');
    if(input)label.classList.toggle('ld47SelectedResource',input.checked);
  });resourceToggle.classList.toggle('ld47ResourcesOpen',!resourceMenu.hidden)};
  resourceMenu.addEventListener('change',sync);
  const observer=new MutationObserver(sync);observer.observe(resourceMenu,{attributes:true,attributeFilter:['hidden']});
  sync();
 }
 window.addEventListener('resize',draw);document.addEventListener('fullscreenchange',draw);
 return true;
}
if(!init()){let tries=0;const timer=setInterval(()=>{if(init()||++tries>120)clearInterval(timer)},100);}
})();