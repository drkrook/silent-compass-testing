/* LEDOVIA desktop dashboard preview — Beta-only, no live-weather claims.
   Existing app controls remain the single source of navigation and data. */
(()=>{'use strict';
function init(){
 const home=document.querySelector('.scSimpleHome'),grid=home?.querySelector('.scHomeGrid');
 if(!home||!grid||document.getElementById('ledoviaDesktopDashboard'))return !!document.getElementById('ledoviaDesktopDashboard');
 const wrap=document.createElement('section');wrap.id='ledoviaDesktopDashboard';wrap.setAttribute('aria-label','Adventure dashboard');
 wrap.innerHTML=`
 <div class="ld14Columns">
 <section class="ld14Panel ld14Plan" aria-label="Weather and conditions">
 <h2>☁ &nbsp; Weather &amp; Conditions</h2>
 <div class="ldWeatherStatus" role="status"><strong>Current weather unavailable</strong><p>Live conditions are not yet connected to this dashboard. Check official weather information before heading out.</p></div>
 <div class="ldWeatherMetrics" aria-label="Weather metrics awaiting live data">
 <div><span>Temperature</span><strong>—</strong></div><div><span>Wind &amp; gusts</span><strong>—</strong></div>
 <div><span>Humidity</span><strong>—</strong></div><div><span>Visibility</span><strong>—</strong></div>
 <div><span>Heat / freeze advisories</span><strong>Not checked</strong></div></div>
 <div class="ldWeatherAlert"><strong>Official alert status: Unknown</strong><p>Open Weather Alerts to check current NWS information. No alert-free status is implied.</p></div>
 <button type="button" class="ldWeatherOpen" data-action="nws">View Weather Alerts &amp; Details →</button>
 </section>
 <nav class="ld14Panel ld14Center" aria-label="Adventure tools"><h2>◈ &nbsp; Adventure Tools</h2>
 <div class="ld14Intro"><small>YOUR NEXT ADVENTURE</small><strong>Explore. Navigate. Prepare.</strong><p>Choose a destination, explore the map, and prepare for offline use.</p></div>
 <div class="ld14Tiles">
 <button type="button" data-action="map"><span>▣</span>Open Map</button>
 <button type="button" data-action="routes"><span>➤</span>Directions</button>
 <button type="button" data-action="places"><span>⌖</span>Saved Locations</button>
 <button type="button" data-action="survival"><span>▤</span>Survival Guides</button>
 <button type="button" data-action="offline"><span>⇩</span>Offline Maps</button>
 <button type="button" data-action="hazards"><span>⚑</span>Report a Hazard</button>
 </div></nav>
 <nav class="ld14Panel ld14Prepare" aria-label="My readiness"><h2>✓ &nbsp; My Readiness</h2>
 <div class="ldReadinessNote"><strong>Adventure Preparation <span class="ldReadinessBadge">Not verified</span></strong><p>Check your essentials before heading out. These shortcuts do not confirm trip readiness.</p></div>
 <div class="ld14Links" aria-label="Preparation tools">
 <button type="button" data-action="offline"><span>▣ &nbsp; Offline Maps &amp; Readiness</span><span aria-hidden="true">›</span></button>
 <button type="button" data-action="places"><span>⌖ &nbsp; Saved Destinations</span><span aria-hidden="true">›</span></button>
 <button type="button" data-action="survival"><span>▤ &nbsp; Survival Guides</span><span aria-hidden="true">›</span></button>
 <button type="button" data-action="family"><span>♧ &nbsp; Family Circles</span><span aria-hidden="true">›</span></button>
 </div>
 <div class="ldReadinessChecklist"><strong>☑ &nbsp; Trip Checklist</strong><p>Coming with Trip Planning: review supplies, downloaded maps, contacts, and destination preparation.</p></div></nav></div>`;
 const actions={
 map:()=>grid.querySelector('[data-map-action="open"]')?.click(),
 routes:()=>grid.querySelector('[data-go="routes"]')?.click(),
 places:()=>document.getElementById('tab-places')?.click(),
 survival:()=>grid.querySelector('[data-go="survival"]')?.click(),
 offline:()=>document.getElementById('tab-offline')?.click(),
 nws:()=>grid.querySelector('[data-go="nws"]')?.click(),
 family:()=>document.getElementById('scFamilyOpen')?.click(),
 hazards:()=>grid.querySelector('[data-go="hazards"]')?.click()
 };
 wrap.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(b&&wrap.contains(b))actions[b.dataset.action]?.()});
 const style=document.createElement('style');style.textContent=`
 @media(min-width:1050px){
 #ledoviaDesktopDashboard .ldWeatherStatus,#ledoviaDesktopDashboard .ldReadinessNote{background:#1b5155;border-radius:10px;padding:14px;margin-bottom:12px}
 #ledoviaDesktopDashboard .ldWeatherStatus strong,#ledoviaDesktopDashboard .ldReadinessNote strong{display:block;font-size:17px;color:#fff}
 #ledoviaDesktopDashboard .ldWeatherStatus p,#ledoviaDesktopDashboard .ldReadinessNote p,#ledoviaDesktopDashboard .ldWeatherAlert p{font-size:13px;line-height:1.45;margin:8px 0 0;color:#d5e5e2}
 #ledoviaDesktopDashboard .ldWeatherMetrics{display:grid;gap:0;margin:12px 0}
 #ledoviaDesktopDashboard .ldWeatherMetrics>div{display:flex;justify-content:space-between;gap:8px;padding:9px 2px;border-bottom:1px solid #ffffff24;font-size:14px}
 #ledoviaDesktopDashboard .ldWeatherMetrics strong{color:#fff;text-align:right}
 #ledoviaDesktopDashboard .ldWeatherAlert{border:1px solid #edaa43;border-radius:10px;padding:12px;margin:12px 0;color:#f7d79e}
 #ledoviaDesktopDashboard .ldWeatherOpen{display:block;width:100%;background:#17646a;border:1px solid #79c6bd;border-radius:9px;padding:12px;color:#fff;font-size:14px;font-weight:700;text-align:left}
 #ledoviaDesktopDashboard .ldWeatherOpen:hover,#ledoviaDesktopDashboard .ldWeatherOpen:focus-visible{outline:2px solid #b1e6db;outline-offset:2px}
 #ledoviaDesktopDashboard .ldReadinessBadge{display:inline-block;vertical-align:middle;font-size:11px;font-weight:700;color:#f7d79e;border:1px solid #edaa43;border-radius:20px;padding:4px 8px;margin:5px 0 0 5px}
 #ledoviaDesktopDashboard .ld14Prepare .ld14Links{background:#123b3e;border-radius:10px;padding:6px;margin-bottom:14px}
 #ledoviaDesktopDashboard .ld14Prepare .ld14Links button{display:flex;justify-content:space-between;align-items:center;gap:8px;width:100%;border-bottom:1px solid #ffffff18}
 #ledoviaDesktopDashboard .ld14Prepare .ld14Links button:last-child{border-bottom:0}
 #ledoviaDesktopDashboard .ld14Prepare .ld14Links button>span:last-child{font-size:23px;color:#b7d5d2}
 #ledoviaDesktopDashboard .ldReadinessChecklist{background:#1b5155;border-radius:10px;padding:14px}
 #ledoviaDesktopDashboard .ldReadinessChecklist strong{font-size:15px;color:#fff}
 #ledoviaDesktopDashboard .ldReadinessChecklist p{font-size:13px;line-height:1.45;color:#d5e5e2;margin:8px 0 0}
 #ledoviaDesktopDashboard .ld14Tiles button{min-width:0}
 }`;
 document.head.append(style);grid.before(wrap);return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>100)clearInterval(t)},100)}
})();