/* LEDOVIA Beta home account access. Reuses existing Supabase auth UI and session storage. */
(()=>{'use strict';
function init(){
 const home=document.querySelector('.scSimpleHome');
 const desktop=document.getElementById('ledoviaDesktopDashboard');
 const mobile=document.getElementById('ldMobileTrips');
 if(!home||!desktop||!mobile||typeof scFamilyAuthUI!=='function')return false;
 if(document.getElementById('ldAccountOpenDesktop'))return true;
 const button=(id)=>{const b=document.createElement('button');b.type='button';b.id=id;b.className='ldAccountHomeButton';b.textContent='Sign in';b.addEventListener('click',open);return b};
 const d=button('ldAccountOpenDesktop');
 const desktopSection=document.createElement('section');
 desktopSection.id='ldDesktopAccountSection';
 desktopSection.setAttribute('aria-label','Account access');
 desktopSection.append(d);
 desktop.before(desktopSection);
 const m=button('ldAccountOpenMobile');
 const accountSection=document.createElement('section');
 accountSection.id='ldMobileAccountSection';
 accountSection.setAttribute('aria-label','Account access');
 accountSection.append(m);
 mobile.before(accountSection);
 function updateLabels(){
  const auth=typeof scAuthGet==='function'?scAuthGet():null;
  const active=!!(auth&&auth.expires_at>Date.now()/1000);
  d.textContent=m.textContent=active?'My Account':'Sign in';
 }
 updateLabels();
 function open(){
  let dlg=document.getElementById('ldAccountDialog');
  if(!dlg){
   dlg=document.createElement('dialog');dlg.id='ldAccountDialog';
   document.body.append(dlg);
  }
  dlg.replaceChildren();
  const heading=document.createElement('div');heading.className='ldAccountHeading';
  const h=document.createElement('h2');h.textContent='My Account';
  const close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=()=>{dlg.close();updateLabels()};
  heading.append(h,close);dlg.append(heading);
  const intro=document.createElement('p');intro.textContent='Sign in to your LEDOVIA account. Trips and downloaded resources remain on this device; cloud trip synchronization is not enabled yet.';dlg.append(intro);
  scFamilyAuthUI(dlg);
  dlg.showModal();
  dlg.addEventListener('close',updateLabels,{once:true});
 }
 return true;
}
const css=document.createElement('style');css.textContent=`
#ldMobileAccountSection{display:none}
#ldDesktopAccountSection{display:none}
@media(min-width:1050px){
 #appMain.scHomeActive #ldDesktopAccountSection{display:flex;justify-content:flex-start;max-width:1350px;margin:10px auto 0;padding:0 4px}
 #ldAccountOpenDesktop{width:auto!important;min-width:130px;justify-content:center!important;background:#17646a;border:1px solid #8ed4ca;border-radius:9px;color:#fff;padding:11px 18px;font-weight:700;cursor:pointer}
 #ldAccountOpenDesktop::after{display:none}
}
@media(max-width:1049px){
 #appMain.scHomeActive #ldMobileAccountSection{display:flex;align-items:center;justify-content:flex-start;gap:12px;margin:4px 0 12px;padding:12px 16px;background:#103e42;border:1px solid #77bfb7;border-radius:12px;color:#fff}
 #ldAccountOpenMobile{width:auto;min-height:42px;padding:9px 15px;background:#17646a;border:1px solid #8ed4ca;border-radius:8px;color:#fff;font-weight:700;cursor:pointer}
}
#ldAccountDialog{box-sizing:border-box;width:min(520px,calc(100vw - 24px));max-height:90dvh;overflow:auto;border:1px solid #77bfb7;border-radius:14px;background:#103c40;color:#fff;padding:18px}
#ldAccountDialog::backdrop{background:#000b}
#ldAccountDialog .ldAccountHeading{display:flex;align-items:center;justify-content:space-between;gap:12px}
#ldAccountDialog .ldAccountHeading h2{margin:0}
#ldAccountDialog button{background:#17646a;border:1px solid #8ed4ca;border-radius:8px;color:#fff;padding:10px 12px;cursor:pointer}
#ldAccountDialog input{box-sizing:border-box;max-width:100%}
@media(min-width:1050px){#ldAccountOpenMobile{display:none}}
`;document.head.append(css);
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();