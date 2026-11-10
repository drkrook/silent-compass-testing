/* Ledovia Beta v0.8.12: compass layout and persistent default light preference.
 * Sensor heading and rose rotation calculations are deliberately untouched. */
(()=>{'use strict';
const KEY='ledovia-compass-default-light-v2';
const LEGACY='ledovia-compass-light-v1';
const modes=['standard','red','green'];
function getDefault(){try{const v=localStorage.getItem(KEY);if(modes.includes(v))return v;const old=localStorage.getItem(LEGACY);return modes.includes(old)?old:'standard'}catch(e){return 'standard'}}
function saveDefault(v){if(!modes.includes(v))return;try{localStorage.setItem(KEY,v);localStorage.setItem(LEGACY,v)}catch(e){}}
function init(){
 const screen=document.getElementById('scLedoviaCompassView'),drawer=document.getElementById('ledoviaMenuPanel'),settings=document.getElementById('ledoviaSettings'),launcher=document.querySelector('.scLedoviaCompass');
 if(!screen||!drawer||!settings||!launcher)return false;
 if(screen.dataset.layoutV12)return true;screen.dataset.layoutV12='ready';
 const shell=screen.querySelector('.scCompassShell'),dial=shell?.querySelector('.scCompassDial'),modesRow=shell?.querySelector('.scCompassModes');
 if(!shell||!dial||!modesRow)return false;
 dial.after(modesRow);
 modesRow.setAttribute('aria-label','Temporary compass display mode');
 const box=document.createElement('div');box.className='ledoviaCompassPreference';
 const label=document.createElement('label');label.htmlFor='ledoviaDefaultCompassLight';label.textContent='Default Compass Display';
 const hint=document.createElement('p');hint.textContent='Choose how Compass opens. Buttons inside Compass change the display for that session only.';
 const select=document.createElement('select');select.id='ledoviaDefaultCompassLight';
 for(const [value,name] of [['standard','Normal'],['red','Red Night'],['green','Green Night']]){const opt=document.createElement('option');opt.value=value;opt.textContent=name;select.append(opt)}
 saveDefault(getDefault());
 select.value=getDefault();
 select.addEventListener('change',()=>saveDefault(select.value));
 box.append(label,hint,select);settings.append(box);
 // Existing Compass handler saves each temporary mode in the legacy key.
 // Restore the saved default after each temporary selection to keep it distinct.
 modesRow.addEventListener('click',e=>{if(e.target.closest('[data-light]'))queueMicrotask(()=>{try{localStorage.setItem(LEGACY,getDefault())}catch(err){}})});
 // The existing launch handler runs before this bubbling listener.
 launcher.addEventListener('click',()=>{const chosen=getDefault();const button=modesRow.querySelector('[data-light="'+chosen+'"]');button?.click();select.value=chosen;});
 // Keep the default visible in settings if updated in another tab.
 window.addEventListener('storage',e=>{if(e.key===KEY)select.value=getDefault()});
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>100)clearInterval(t)},100)}
})();