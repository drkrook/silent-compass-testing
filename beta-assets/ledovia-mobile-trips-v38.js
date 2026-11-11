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
 section.innerHTML='<div class="ldMobileBrand"><img src="./ledovia-logo.svg" alt=""><div><strong>LEDOVIA</strong><small>Ready for the Adventure. Prepared for the Unexpected.</small></div></div><h2>Adventure Tools</h2><p>Plan your next adventure and keep your trips organized.</p><div class="ldMobileTripActions"><button type="button" id="ldMobilePlan">Plan a Trip <span aria-hidden="true">›</span></button><button type="button" id="ldMobileManage">My Trips <span aria-hidden="true">›</span></button></div>';
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