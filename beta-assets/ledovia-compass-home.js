/* Ledovia Beta-only enhancement. No Stable source modifications. */
(()=>{
'use strict';
const style=document.createElement('style');
style.textContent=`
body{background:#071b20}
header{background:linear-gradient(135deg,#062d36,#0b5a60 58%,#092a30)!important;border-bottom:1px solid #368f88}
header h1{font-size:clamp(22px,4vw,34px)!important;letter-spacing:.025em}
.scSimpleHome{max-width:920px;margin:auto}
.scSimpleHome h2{font-size:clamp(24px,4vw,32px)}
.scHomeGrid{gap:12px!important}
.scHomeGrid>button{position:relative;border:1px solid #26877e!important;border-radius:17px!important;background:linear-gradient(145deg,#104f50,#092d33)!important;box-shadow:0 6px 18px #00181b66;transition:transform .15s,border-color .15s;min-height:118px!important}
.scHomeGrid>button:focus-visible{outline:3px solid #ffdc80;outline-offset:3px}
.scHomeGrid>button:active{transform:scale(.985)}
.scHomeGrid>button strong{color:#fff;font-size:clamp(15px,2.5vw,19px)}
.scHomeGrid>button span{color:#d5e8e5}
.scHomeGrid>.scHomeSOS{background:linear-gradient(120deg,#9e1824,#630d19)!important;border:2px solid #ff555e!important;box-shadow:0 0 15px #a52d3555;min-height:120px!important}
.scHomeGrid>.scHomeNWS{background:linear-gradient(120deg,#075c78,#063b50)!important;border:2px solid #4bcde9!important;min-height:100px!important}
.scHomeGrid>.scLedoviaCompass{background:linear-gradient(145deg,#0b4d4b,#072e35)!important;border:2px solid #63f5e3!important;box-shadow:0 0 17px #39dfcf77!important}
.scLedoviaNew{position:absolute;top:9px;left:10px;background:#ffdb55;color:#101a1b!important;font-size:12px!important;font-weight:900;border-radius:6px;padding:3px 9px}
#scLedoviaCompassView{position:fixed;inset:0;z-index:99999;display:none;overflow-y:auto;padding:16px;box-sizing:border-box;background:#e8f0ec;color:#142b2d;font-family:system-ui,sans-serif}
#scLedoviaCompassView.scOpen{display:block}
#scLedoviaCompassView.scRed{background:#090405;color:#b94545}
#scLedoviaCompassView.scGreen{background:#030b06;color:#52a16a}
.scCompassShell{max-width:560px;margin:0 auto;min-height:90vh;display:flex;flex-direction:column;gap:18px}
.scCompassTop{display:flex;align-items:center;justify-content:space-between;gap:10px}
.scCompassTop button,.scCompassModes button{font:inherit;border:1px solid currentColor;border-radius:12px;background:transparent;color:inherit;padding:12px;cursor:pointer}
.scCompassModes{display:flex;gap:8px;flex-wrap:wrap}
.scCompassModes button[aria-pressed=true]{outline:2px solid currentColor;outline-offset:2px}
.scCompassDial{width:min(76vw,350px);aspect-ratio:1;margin:18px auto;position:relative;border:6px solid currentColor;border-radius:50%;box-sizing:border-box;display:grid;place-items:center;background:radial-gradient(circle,#ffffff0a,#00000010)}
.scCompassRose{position:absolute;inset:0;transition:transform .15s linear}
.scCompassRose span{position:absolute;font-weight:800;font-size:24px}
.scCompassRose .n{top:12px;left:50%;transform:translateX(-50%)}
.scCompassRose .s{bottom:12px;left:50%;transform:translateX(-50%)}
.scCompassRose .e{right:14px;top:50%;transform:translateY(-50%)}
.scCompassRose .w{left:14px;top:50%;transform:translateY(-50%)}
.scCompassNeedle{width:5px;height:48%;position:absolute;top:4%;left:calc(50% - 2px);background:currentColor;clip-path:polygon(50% 0,100% 100%,0 100%);opacity:.8}
.scCompassHeading{font-size:clamp(42px,9vw,64px);font-weight:800;text-align:center;font-variant-numeric:tabular-nums}
.scCompassStatus{text-align:center;line-height:1.6}
.scCompassFoot{font-size:13px;text-align:center;opacity:.8;line-height:1.5}
`;
document.head.append(style);
function init(){
const home=document.querySelector('.scSimpleHome .scHomeGrid');
if(!home)return false;
const title=document.querySelector('header h1');if(title){title.firstChild.textContent='🏔️ LEDOVIA ';const small=title.querySelector('small');if(small)small.textContent='Ready for the Adventure. Prepared for the Unexpected.'}
document.title='Ledovia — Offline Adventure & Preparedness (Beta)';
if(home.querySelector('.scLedoviaCompass'))return true;
const btn=document.createElement('button');btn.type='button';btn.className='scLedoviaCompass';btn.innerHTML='<span class="scLedoviaNew">NEW</span>🧭<strong>Compass</strong><span>Heading · Rangefinder · Night Mode</span>';btn.setAttribute('aria-label','Open Compass');
const weather=home.querySelector('.scHomeNWS');weather?.after(btn);
const screen=document.createElement('section');screen.id='scLedoviaCompassView';screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');screen.setAttribute('aria-label','Ledovia Compass');
screen.innerHTML='<div class="scCompassShell"><div class="scCompassTop"><button type="button" id="scCompassClose">← Home</button><strong>🧭 LEDOVIA COMPASS</strong></div><div class="scCompassModes" aria-label="Compass lighting"><button data-light="standard">Standard</button><button data-light="red">Red Night</button><button data-light="green">Green Night</button></div><div class="scCompassDial" aria-hidden="true"><div class="scCompassRose" id="scCompassRose"><span class="n">N</span><span class="e">E</span><span class="s">S</span><span class="w">W</span></div><div class="scCompassNeedle"></div></div><div class="scCompassHeading" id="scCompassHeading">—°</div><div class="scCompassStatus" id="scCompassStatus" role="status">Waiting for compass sensor</div><button type="button" id="scCompassPermission" hidden>Enable Motion Sensor</button><p class="scCompassFoot">Magnetic heading depends on device support and calibration. Never rely on this tool as your sole navigation method. GPS rangefinder coming in a separate verified update.</p></div>';
document.body.append(screen);
let mode='standard';try{mode=localStorage.getItem('ledovia-compass-light-v1')||'standard'}catch(e){}
function setMode(m){if(!['standard','red','green'].includes(m))m='standard';mode=m;screen.className='scOpen'+(m==='red'?' scRed':m==='green'?' scGreen':'');screen.querySelectorAll('[data-light]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.light===m)));try{localStorage.setItem('ledovia-compass-light-v1',m)}catch(e){}}
screen.querySelectorAll('[data-light]').forEach(b=>b.onclick=()=>setMode(b.dataset.light));
const status=screen.querySelector('#scCompassStatus'),heading=screen.querySelector('#scCompassHeading'),rose=screen.querySelector('#scCompassRose'),permission=screen.querySelector('#scCompassPermission');
let lastSensor=0,opened=false;
function orientation(e){if(!opened)return;let h=null;if(typeof e.webkitCompassHeading==='number'&&Number.isFinite(e.webkitCompassHeading))h=e.webkitCompassHeading;else if(e.absolute===true&&typeof e.alpha==='number'&&Number.isFinite(e.alpha))h=(360-e.alpha)%360;if(h===null)return;lastSensor=Date.now();heading.textContent=Math.round(h)+'°';rose.style.transform='rotate('+(-h)+'deg)';status.textContent='Sensor heading · Calibrate by moving your device in a figure eight if needed';}
window.addEventListener('deviceorientationabsolute',orientation);window.addEventListener('deviceorientation',orientation);
async function request(){try{const fn=window.DeviceOrientationEvent?.requestPermission;if(typeof fn==='function'){const result=await fn.call(window.DeviceOrientationEvent);if(result!=='granted'){status.textContent='Motion sensor permission denied';return}}permission.hidden=true;status.textContent='Waiting for compass sensor';}catch(e){status.textContent='Sensor permission unavailable: '+e.message}}
permission.onclick=request;
btn.onclick=()=>{opened=true;setMode(mode);heading.textContent='—°';status.textContent='Waiting for compass sensor';permission.hidden=typeof window.DeviceOrientationEvent?.requestPermission!=='function';if(!window.DeviceOrientationEvent)status.textContent='Compass sensor unavailable on this device/browser';};
screen.querySelector('#scCompassClose').onclick=()=>{opened=false;screen.className='';btn.focus()};
setInterval(()=>{if(opened&&Date.now()-lastSensor>4500&&permission.hidden)status.textContent='No reliable compass heading available. Check sensor permissions, calibration, and device support.'},2000);
return true;
}
if(!init()){let n=0;const timer=setInterval(()=>{if(init()||++n>80)clearInterval(timer)},200)}
})();


/* Beta landscape Rangefinder bridge v1.
   Portrait compass and sensor logic remain unchanged. Landscape uses the existing
   Rangefinder Lab in an isolated frame; no simulated distance measurement. */
(()=>{'use strict';
function init(){
 const compass=document.getElementById('scLedoviaCompassView');
 if(!compass)return false;
 if(document.getElementById('ldLandscapeRangefinderBridge'))return true;
 const wrap=document.createElement('div');wrap.id='ldLandscapeRangefinderBridge';
 wrap.setAttribute('aria-label','Advanced landscape rangefinder');
 const frame=document.createElement('iframe');frame.title='LEDOVIA Advanced Rangefinder';
 frame.allow='camera; geolocation; fullscreen';frame.setAttribute('allowfullscreen','');
 const exit=document.createElement('button');exit.type='button';exit.textContent='← Compass';exit.setAttribute('aria-label','Return to compass');
 exit.onclick=()=>{compass.querySelector('#scCompassClose')?.click();sync()};
 wrap.append(frame,exit);document.body.append(wrap);
 const style=document.createElement('style');style.id='ldLandscapeRangefinderBridgeStyle';
 style.textContent=`
 #ldLandscapeRangefinderBridge{display:none;position:fixed;inset:0;z-index:100002;background:#03151b}
 #ldLandscapeRangefinderBridge iframe{display:block;width:100%;height:100%;height:100dvh;border:0}
 #ldLandscapeRangefinderBridge>button{position:absolute;top:calc(7px + env(safe-area-inset-top,0px));left:calc(7px + env(safe-area-inset-left,0px));z-index:3;background:#061d25e8;color:#fff;border:1px solid #75bfb8;border-radius:9px;padding:8px 11px;font:600 12px system-ui}
 @media(orientation:landscape){#ldLandscapeRangefinderBridge.ldActive{display:block}}
 `;document.head.append(style);
 const landscape=matchMedia('(orientation:landscape)');
 function sync(){
  const active=compass.classList.contains('scOpen')&&landscape.matches;
  wrap.classList.toggle('ldActive',active);
  wrap.setAttribute('aria-hidden',String(!active));
  if(active){if(!frame.getAttribute('src'))frame.src='./ledovia-rangefinder-lab-v1.html?v=8';}
  else if(frame.getAttribute('src')){frame.removeAttribute('src');}
 }
 new MutationObserver(sync).observe(compass,{attributes:true,attributeFilter:['class']});
 landscape.addEventListener?.('change',sync);
 window.addEventListener('orientationchange',sync);
 window.addEventListener('resize',sync);
 sync();return true;
}
if(!init()){let count=0;const t=setInterval(()=>{if(init()||++count>100)clearInterval(t)},100)}
})();
