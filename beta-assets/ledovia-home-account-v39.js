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
  const intro=document.createElement('p');intro.className='ldAccountIntro';intro.textContent='Sign in to your LEDOVIA account. Trips and downloaded resources remain on this device; cloud trip synchronization is not enabled yet.';dlg.append(intro);
  const hero=document.createElement('div');hero.className='ldAccountHero';
  const logo=document.createElement('img');logo.src='./ledovia-official-logo.svg';logo.alt='LEDOVIA';logo.className='ldAccountLogo';
  hero.append(logo);heading.after(hero);
  scFamilyAuthUI(dlg);
  const panel=dlg.querySelector('section');
  if(panel){
   panel.classList.add('ldAccountPanel');
   const title=panel.querySelector('h3'),privacy=panel.querySelector('p');
   if(title)title.remove();if(privacy)privacy.remove();
   const plan=document.createElement('div');plan.className='ldAccountPlan';
   plan.innerHTML='<span class="ldAccountShield" aria-hidden="true">◇</span><div><small>YOUR PLAN</small><strong>Plan not yet verified</strong><span>Subscription tiers are coming soon.</span></div>';
   panel.prepend(plan);
   const form=panel.querySelector('form');
   if(form){
    const buttons=Array.from(form.children).filter(el=>el.tagName==='BUTTON');
    if(buttons[0]){buttons[0].classList.add('ldAccountPrimary');buttons[0].textContent='Sign in to LEDOVIA →'}
    if(buttons[1])buttons[1].classList.add('ldAccountSecondary');
    if(buttons[2])buttons[2].classList.add('ldAccountSecondary');
   }
  }
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
#ldAccountDialog{box-sizing:border-box;width:min(680px,calc(100vw - 20px));max-height:92dvh;overflow:auto;border:2px solid #29bfc0;border-radius:24px;background:linear-gradient(180deg,#053641b8,#002b34f2 65%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=85') center/cover,#07313b;color:#fff;padding:clamp(18px,3vw,34px);box-shadow:0 24px 90px #001016ed}
#ldAccountDialog .ldAccountHero{text-align:center;margin:12px auto}
#ldAccountDialog .ldAccountLogo{display:block;width:min(75%,360px);height:auto;max-height:145px;object-fit:contain;margin:auto;filter:drop-shadow(0 4px 12px #001820)}
#ldAccountDialog .ldAccountIntro{text-align:center;line-height:1.5;font-size:clamp(14px,1.7vw,17px);text-shadow:0 2px 7px #001820}
#ldAccountDialog .ldAccountPanel{border:1px solid #25d0c4!important;border-radius:20px!important;background:linear-gradient(145deg,#003e47ed,#002b33f2)!important;padding:clamp(14px,3vw,26px)!important;box-shadow:inset 0 0 28px #04b9b515}
#ldAccountDialog .ldAccountPlan{display:flex;align-items:center;gap:18px;padding:15px;margin-bottom:20px;border:1px solid #18bcb8;border-radius:16px;background:#00616b55}
#ldAccountDialog .ldAccountShield{font-size:44px;color:#b3fff6;border-right:2px solid #2ce2d5;padding-right:18px}
#ldAccountDialog .ldAccountPlan small{display:block;font-size:12px;font-weight:800;letter-spacing:3px;color:#b6f5ed}
#ldAccountDialog .ldAccountPlan strong{display:block;font-size:clamp(17px,2vw,24px)}
#ldAccountDialog .ldAccountPlan span:last-child{display:block;color:#ffd176;font-size:13px;margin-top:4px}
#ldAccountDialog .ldAccountPanel input{box-sizing:border-box;width:100%!important;border:2px solid #3fbfc1;border-radius:12px;background:#123f49;color:white;font-size:16px;padding:15px!important;margin:7px 0!important}
#ldAccountDialog .ldAccountPanel input::placeholder{color:#c7dedf}
#ldAccountDialog .ldAccountPanel form{display:flex;flex-wrap:wrap;gap:10px}
#ldAccountDialog .ldAccountPanel form input{flex:0 0 100%}
#ldAccountDialog .ldAccountPanel form button.ldAccountPrimary{order:1;width:100%;font-size:20px;font-weight:800;padding:17px;background:linear-gradient(130deg,#13b9ae,#006571);border:2px solid #7cfff0;box-shadow:0 7px 24px #001d28aa}
#ldAccountDialog .ldAccountPanel form button.ldAccountSecondary{order:2;flex:1;min-width:130px;margin:0!important;background:#075d65;border:1px solid #62eee1;font-weight:700}
#ldAccountDialog .ldAccountPanel form[hidden]{display:none!important}
@media(max-width:480px){#ldAccountDialog .ldAccountPlan{gap:10px;padding:12px}#ldAccountDialog .ldAccountShield{font-size:30px;padding-right:10px}#ldAccountDialog .ldAccountPanel form button.ldAccountSecondary{font-size:12px;min-width:110px}}
#ldAccountDialog::backdrop{background:#000b}
#ldAccountDialog .ldAccountHeading{display:flex;align-items:center;justify-content:space-between;gap:12px}
#ldAccountDialog .ldAccountHeading h2{margin:0}
#ldAccountDialog button{background:#17646a;border:1px solid #8ed4ca;border-radius:8px;color:#fff;padding:10px 12px;cursor:pointer}
#ldAccountDialog input{box-sizing:border-box;max-width:100%}
@media(min-width:1050px){#ldAccountOpenMobile{display:none}}
`;document.head.append(css);
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();