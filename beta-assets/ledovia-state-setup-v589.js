/* Ledovia Beta v0.8.590: first-run state preparation, verified package size when available. */
(()=>{'use strict';
const key='ledovia-state-setup-v1';
function init(){
 const home=document.getElementById('scOfflineHome'),pick=document.getElementById('ldStatePick'),go=document.querySelector('#ldStateFirst button');
 if(!home||!pick||!go)return;
 const card=pick.parentElement;
 const size=document.createElement('div');size.id='ldStateSize';size.style.cssText='font-size:12px;color:#d3e8e7';size.setAttribute('role','status');
 pick.after(size);
 const done=document.createElement('div');done.id='ldDownloadResult';done.style.cssText='font-size:12px;color:#d3e8e7';done.setAttribute('role','status');go.after(done);
 const add=document.createElement('button');add.type='button';add.textContent='Prepare another state';add.style.cssText='background:transparent;border:1px solid #56898b;border-radius:9px;padding:10px;color:#d5e9e8';add.onclick=()=>{home.scrollIntoView({block:'start'});pick.focus()};card.after(add);
 const overlay=document.createElement('div');overlay.id='ldFirstRun';overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:#061e24ee;display:none;align-items:center;justify-content:center;padding:20px;overflow:auto';
 const modal=document.createElement('div');modal.style.cssText='width:min(420px,100%);max-height:90vh;overflow:auto;background:#123c44;color:white;border:1px solid #67a9aa;border-radius:17px;padding:20px;display:grid;gap:13px;box-shadow:0 12px 45px #0008';
 const heading=document.createElement('h2');heading.textContent='Prepare Your Adventure';heading.style.margin='0';
 const desc=document.createElement('p');desc.textContent='Choose your home state. You can add more states later. Setup is optional.';desc.style.margin='0';
 const label=document.createElement('label');label.textContent='My home state';label.htmlFor='ldSetupState';
 const sel=pick.cloneNode(true);sel.id='ldSetupState';sel.value=pick.value;
 const details=document.createElement('div');details.style.cssText='font-size:13px;color:#c5dfdf';details.setAttribute('role','status');
 const prepare=document.createElement('button');prepare.type='button';prepare.textContent='Prepare My State';prepare.style.cssText='background:#087e78;color:white;border:1px solid #60cbc5;border-radius:9px;min-height:48px;font-weight:700';
 const skip=document.createElement('button');skip.type='button';skip.textContent='Skip for now';skip.style.cssText='background:transparent;color:white;border:1px solid #6b9798;border-radius:9px;min-height:42px';
 modal.append(heading,desc,label,sel,details,prepare,skip);overlay.append(modal);document.body.append(overlay);
 function close(){overlay.style.display='none';try{localStorage.setItem(key,'seen')}catch(e){}}
 skip.onclick=close;
 const fmt=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':(n/1024).toFixed(1)+' KB';
 const requests=new WeakMap();
 async function inspect(state,el){
  const current=(requests.get(el)||0)+1;requests.set(el,current);
  el.textContent='Checking published download size…';
  if(state!=='SC'){el.textContent='State package not yet published. Download size unavailable.';return}
  try{
   const res=await fetch('./state-packs/manifest.json',{cache:'no-store'});if(!res.ok)throw Error('Manifest unavailable');
   const m=await res.json(),entry=m.states?.[state];
   if(!entry?.file||typeof entry.file!=='string'||entry.file.includes('..')||!entry.file.endsWith('.json'))throw Error('No published package');
   const head=await fetch('./state-packs/'+entry.file,{method:'HEAD',cache:'no-store'});
   const n=Number(head.headers.get('content-length'));
   if(current!==requests.get(el))return;
   el.textContent=head.ok&&Number.isFinite(n)&&n>0?'Published resources: '+fmt(n)+' download. Storage needed may be higher after installation. Complete offline maps not included.':'Published resources: file size unavailable. Complete offline maps not included.';
  }catch(e){if(current===requests.get(el))el.textContent='Download size unavailable. Complete offline maps not included.'}
 }
 sel.onchange=()=>inspect(sel.value,details);
 pick.addEventListener('change',()=>inspect(pick.value,size));
 inspect(pick.value,size); // both fields use independent user-facing checks
 inspect(sel.value,details);
 prepare.onclick=async()=>{
  const state=sel.value;
  if(state!=='SC'){details.textContent='This state package is not yet published. No download was started.';return}
  if(!navigator.onLine){details.textContent='Connect to the internet to download South Carolina resources.';return}
  prepare.disabled=true;prepare.textContent='Preparing download…';
  pick.value=state;pick.dispatchEvent(new Event('change',{bubbles:true}));
  const target=document.getElementById('scStatePackDownload'),source=document.getElementById('scStatePackStatus');
  if(!target||!source){details.textContent='Download service unavailable. Nothing was changed.';prepare.disabled=false;prepare.textContent='Try Again';return}
  const waitForReady=async()=>{
   for(let i=0;i<60;i++){
    if(!target.disabled&&typeof target.onclick==='function')return true;
    if(/No published pack|Could not check state packs|Invalid pack|Manifest HTTP/.test(source.textContent||''))return false;
    await new Promise(resolve=>setTimeout(resolve,250));
   }
   return false;
  };
  if(!await waitForReady()){details.textContent='Could not confirm a published download is ready. Please try again when connected.';prepare.disabled=false;prepare.textContent='Try Again';return}
  details.textContent='Downloading South Carolina resources…';prepare.textContent='Downloading…';
  target.click();
  let outcome='';
  for(let i=0;i<240;i++){
   const message=source.textContent||'';
   if(/^Saved \d+/.test(message)){outcome=message;break}
   if(/^Download failed:/.test(message)){outcome=message;break}
   await new Promise(resolve=>setTimeout(resolve,250));
  }
  if(outcome.startsWith('Saved ')){
   details.textContent='South Carolina resources saved on this device. Complete offline maps are not included.';
   done.textContent=outcome;
   prepare.textContent='Continue to Ledovia';
   prepare.disabled=false;
   prepare.onclick=close;
  }else{
   details.textContent=outcome||'Download could not be verified. Check your connection and try again.';
   prepare.textContent='Try Again';prepare.disabled=false;
  }
 };
 const underlying=document.getElementById('scStatePackStatus');
 if(underlying){new MutationObserver(()=>{if(!done.isConnected)return;const t=underlying.textContent||'';if(/Saved \d+|Download failed|Downloading /.test(t))done.textContent=t}).observe(underlying,{childList:true,subtree:true,characterData:true})}
 let seen=false;try{seen=localStorage.getItem(key)==='seen'}catch(e){}
 if(!seen){overlay.style.display='flex'}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0));else setTimeout(init,0);
})();