/* Ledovia Beta v0.8.14 — desktop-only three-column Home.
   Delegates to existing Home buttons; never duplicates storage or feature logic. */
(()=>{'use strict';
function init(){
 const home=document.querySelector('.scSimpleHome'),grid=home?.querySelector('.scHomeGrid');
 if(!home||!grid||document.getElementById('ledoviaDesktopDashboard'))return !!document.getElementById('ledoviaDesktopDashboard');
 const wrap=document.createElement('section');wrap.id='ledoviaDesktopDashboard';wrap.setAttribute('aria-label','Adventure dashboard');
 wrap.innerHTML=`
 <div class="ld14Top"><div class="ld14Brand"><span aria-hidden="true">△</span> LEDOVIA</div><button type="button" data-action="help" class="ld14SOS">♧ Emergency Help</button></div>
 <div class="ld14Columns">
 <nav class="ld14Panel ld14Plan" aria-label="Plan your adventure"><h2>♧ &nbsp; Plan</h2><div class="ld14Links">
 <button data-action="map">▣ &nbsp; Explore Maps</button>
 <button data-action="routes">⌁ &nbsp; Plan a Route</button>
 <button data-action="places">♧ &nbsp; Saved Locations</button>
 <button data-action="compass">◉ &nbsp; Compass</button>
 </div></nav>
 <section class="ld14Panel ld14Center" aria-label="Your Adventure Dashboard"><h2>▦ &nbsp; Your Adventure Dashboard</h2>
 <div class="ld14Intro"><small>YOUR NEXT ADVENTURE</small><strong>Start planning your trip</strong><p>Choose a destination, explore the map, and prepare for offline use.</p></div>
 <div class="ld14Tiles">
 <button data-action="map"><span>▣</span>Open Map</button>
 <button data-action="routes"><span>➤</span>Directions</button>
 <button data-action="survival"><span>▤</span>Survival Guides</button>
 <button data-action="offline"><span>⇩</span>Offline Maps</button>
 </div></section>
 <nav class="ld14Panel ld14Prepare" aria-label="Prepare for your adventure"><h2>♧ &nbsp; Prepare</h2><div class="ld14Links">
 <button data-action="nws">☁ &nbsp; Weather Alerts</button>
 <button data-action="offline">⇩ &nbsp; Offline Readiness</button>
 <button data-action="survival">▤ &nbsp; Survival Guides</button>
 <button data-action="family">♧ &nbsp; Family Circles</button>
 </div></nav></div>`;
 const actions={
 help:()=>grid.querySelector('[data-go="help"]')?.click(),
 map:()=>grid.querySelector('[data-map-action="open"]')?.click(),
 routes:()=>grid.querySelector('[data-go="routes"]')?.click(),
 places:()=>document.getElementById('tab-places')?.click(),
 survival:()=>grid.querySelector('[data-go="survival"]')?.click(),
 offline:()=>document.getElementById('tab-offline')?.click(),
 nws:()=>grid.querySelector('[data-go="nws"]')?.click(),
 family:()=>document.getElementById('scFamilyOpen')?.click(),
 compass:()=>grid.querySelector('.scLedoviaCompass')?.click()
 };
 wrap.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b&&wrap.contains(b))actions[b.dataset.action]?.()});
 grid.before(wrap);
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>100)clearInterval(t)},100)}
})();