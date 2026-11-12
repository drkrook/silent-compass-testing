/* LEDOVIA Beta v0.8.324 — mobile trip entry and home presentation.
   Reuses the existing desktop trip dialogs and local data; does not change map gestures. */
(()=>{'use strict';
function init(){
 const home=document.querySelector('.scSimpleHome');
 const grid=home?.querySelector('.scHomeGrid');
 const plan=document.getElementById('ldTripOpen');
 const trips=document.getElementById('ldMyTripsOpen');
 if(!home||!grid||!plan||!trips)return false;
 if(document.getElementById('ldMobileTrips'))return true;
 const section=document.createElement('section');
 section.id='ldMobileTrips';
 section.setAttribute('aria-label','LEDOVIA adventure planning');
 section.innerHTML='<h2>Adventure Tools</h2><p>Plan your next adventure and keep your trips organized.</p><div class="ldMobileTripActions"><button type="button" id="ldMobilePlan">Plan a Trip <span aria-hidden="true">›</span></button><button type="button" id="ldMobileManage">My Trips <span aria-hidden="true">›</span></button></div>';
 grid.before(section);
 section.querySelector('#ldMobilePlan').addEventListener('click',()=>plan.click());
 section.querySelector('#ldMobileManage').addEventListener('click',()=>trips.click());
 return true;
}
const style=document.createElement('style');
style.textContent=`
#ldMobileTrips{display:none}
@media(max-width:1049px){
 #appMain.scHomeActive #ldMobileTrips{display:block;margin:4px 0 18px;padding:16px;background:#103e42;border:1px solid #77bfb7;border-radius:14px;color:#effaf8}
 #ldMobileTrips .ldMobileBrand{display:flex;align-items:center;gap:12px;margin-bottom:15px}
 #ldMobileTrips .ldMobileBrand img{width:47px;height:47px;object-fit:contain;flex:none}
 #ldMobileTrips .ldMobileBrand strong{display:block;font-size:21px;letter-spacing:.06em}
 #ldMobileTrips .ldMobileBrand small{display:block;font-size:11px;line-height:1.4;color:#d4e8e3}
 #ldMobileTrips h2{font-size:20px!important;margin:0 0 6px!important;color:#fff}
 #ldMobileTrips p{font-size:13px!important;color:#d4e8e3!important;margin:0 0 14px!important}
 #ldMobileTrips .ldMobileTripActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 #ldMobileTrips button{display:flex;align-items:center;justify-content:space-between;gap:6px;width:100%;min-height:57px;border-radius:10px;border:1px solid #8ed4ca;background:#17646a;color:#fff;padding:11px;font:inherit;font-size:15px;font-weight:700;cursor:pointer}
 #ldMobileTrips button:focus-visible{outline:3px solid #edaa43;outline-offset:2px}
 #ldTripDialog,#ldMyTripsDialog{box-sizing:border-box;max-width:calc(100vw - 20px);padding:16px!important}
 #ldTripDialog .ldTripDates{grid-template-columns:repeat(2,minmax(0,1fr))}
 #ldTripDialog .ldTripDates label{min-width:0}
 #ldTripDialog .ldTripDates input{min-width:0;font-size:14px}
 #ldMyTripsDialog .ldMyActions button{min-height:43px}
 #ldMyTripsDialog .ldMyChecks label{min-height:32px;align-items:center}
 #ldMyTripsDialog .ldMyChecks input{width:17px;height:17px;flex:none}
}
@media(max-width:360px){
 #ldMobileTrips .ldMobileTripActions{grid-template-columns:1fr}
 #ldTripDialog .ldTripDates{grid-template-columns:1fr}
}`;
document.head.append(style);
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();

/* Approved mockup layout phase 1: move existing emergency actions above trip/account
   panels; keep original button nodes and event listeners. Emergency card artwork is
   intentionally deferred to phase 2. */
(()=>{'use strict';
 function arrange(){
  const home=document.querySelector('.scSimpleHome');
  const grid=home?.querySelector('.scHomeGrid');
  const account=document.getElementById('ldMobileAccountSection');
  const trips=document.getElementById('ldMobileTrips');
  if(!grid||!account||!trips)return false;
  const emergency=grid.querySelector('.scHomeSOS');
  const weather=grid.querySelector('.scHomeNWS');
  if(!emergency||!weather)return false;
  let safety=document.getElementById('ldSafetyFirst');
  if(!safety){safety=document.createElement('section');safety.id='ldSafetyFirst';safety.setAttribute('aria-label','Safety first');grid.before(safety);}
  if(emergency.parentElement!==safety)safety.append(emergency);
  if(weather.parentElement!==safety)safety.append(weather);
  let adventure=document.getElementById('ldAdventureTiles');
  if(!adventure){adventure=document.createElement('section');adventure.id='ldAdventureTiles';adventure.setAttribute('aria-label','Adventure and navigation');grid.before(adventure);}
  if(account.parentElement!==adventure)adventure.append(account);
  if(trips.parentElement!==adventure)adventure.append(trips);
  if(grid.parentElement!==adventure)adventure.append(grid);
  return true;
 }
 const css=document.createElement('style');css.id='ldMockupLayoutPhase1';
 css.textContent=`
 @media(max-width:1049px){
 #appMain.scHomeActive .scSimpleHome{max-width:760px!important}
 #appMain.scHomeActive #ldSafetyFirst{display:grid;gap:9px;margin:8px 0 14px}
 #appMain.scHomeActive #ldSafetyFirst>button{display:flex!important;width:100%!important;min-height:75px!important;margin:0!important;grid-column:auto!important}
 #appMain.scHomeActive #ldAdventureTiles{border-top:1px solid #2f8d88;padding-top:13px}
 #appMain.scHomeActive #ldMobileAccountSection{margin:0 0 9px!important;padding:0!important;border:0!important;background:transparent!important}
 #appMain.scHomeActive #ldAccountOpenMobile{width:100%!important;min-height:43px!important;text-align:left!important}
 #appMain.scHomeActive #ldMobileTrips{margin:0 0 10px!important;padding:0!important;border:0!important;background:transparent!important}
 #appMain.scHomeActive #ldMobileTrips>h2,#appMain.scHomeActive #ldMobileTrips>p{display:none!important}
 #appMain.scHomeActive #ldMobileTrips .ldMobileTripActions{gap:8px!important}
 #appMain.scHomeActive #ldMobileTrips button{min-height:105px!important;align-items:flex-end!important;text-align:left!important;padding:12px!important;border-color:#4fa7a3!important;background:linear-gradient(0deg,#001a22ed,#002b3566 70%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=650&q=75') center/cover,#073a44!important}
 #appMain.scHomeActive #ldMobileTrips #ldMobileManage{background-image:linear-gradient(0deg,#001a22ed,#002b3566 70%),url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=650&q=75')!important}
 #appMain.scHomeActive #ldAdventureTiles .scHomeGrid{gap:7px!important}
 #appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button{min-height:105px!important}
 }
 @media(min-width:1050px){#ldSafetyFirst,#ldAdventureTiles{display:contents}}
 `;
 document.head.append(css);
 if(!arrange()){let tries=0;const timer=setInterval(()=>{if(arrange()||++tries>120)clearInterval(timer)},100)}
})();
