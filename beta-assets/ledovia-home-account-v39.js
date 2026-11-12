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

/* Beta Phase 2: premium safety cards and Account moved to hamburger.
   Reuses the original account button and its existing auth handler. */
(()=>{'use strict';
const css=document.createElement('style');css.id='ldSafetyAccountPhase2';css.textContent=`
#appMain.scHomeActive #ldMobileAccountSection,#appMain.scHomeActive #ldDesktopAccountSection{display:none!important}
#ledoviaMenuPanel #ldAccountOpenMobile{display:flex!important;align-items:center;justify-content:space-between;width:100%!important;min-height:48px!important;margin:8px 0!important;padding:12px 15px!important;border:1px solid #59b4aa!important;border-radius:10px!important;background:#10494f!important;color:white!important;font-size:15px!important;font-weight:750!important;text-align:left!important}
#ledoviaMenuPanel #ldAccountOpenMobile:after{content:'›';font-size:24px;line-height:1}
@media(max-width:1049px){
#appMain.scHomeActive #ldSafetyFirst{gap:7px!important;margin:5px 0 12px!important}
#appMain.scHomeActive #ldSafetyFirst>button{box-sizing:border-box!important;position:relative!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:3px!important;width:100%!important;min-height:86px!important;padding:12px 43px 12px 58px!important;text-align:left!important;border-radius:13px!important;color:#fff!important;overflow:hidden!important;text-shadow:0 2px 4px #000!important;box-shadow:0 4px 14px #00151a80!important}
#appMain.scHomeActive #ldSafetyFirst>.scHomeSOS{background:linear-gradient(90deg,#710816f5 0%,#a9081eea 55%,#1a0916c0 100%),url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=75') center/cover,#760a18!important;border:2px solid #ff475a!important}
#appMain.scHomeActive #ldSafetyFirst>.scHomeNWS{background:linear-gradient(90deg,#00334eea 0%,#065477df 58%,#061c39c4 100%),url('https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=75') center/cover,#064768!important;border:2px solid #35c8ec!important}
#appMain.scHomeActive #ldSafetyFirst>button strong{display:block!important;width:100%!important;font-size:clamp(16px,4.1vw,19px)!important;line-height:1.2!important;margin:0!important;padding:0!important;text-align:left!important}
#appMain.scHomeActive #ldSafetyFirst>button span{font-size:11px!important;line-height:1.35!important;text-align:left!important}
#appMain.scHomeActive #ldSafetyFirst>button:before{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:29px;line-height:1}
#appMain.scHomeActive #ldSafetyFirst>.scHomeSOS:before{content:'🚨'}
#appMain.scHomeActive #ldSafetyFirst>.scHomeNWS:before{content:'⛈'}
#appMain.scHomeActive #ldSafetyFirst>button:after{content:'›';position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:29px;font-weight:300}
#appMain.scHomeActive #ldSafetyFirst>button>svg,#appMain.scHomeActive #ldSafetyFirst>button>.ledoviaIcon{display:none!important}
}
`;document.head.append(css);
function move(){
 const menu=document.getElementById('ledoviaMenuPanel'),button=document.getElementById('ldAccountOpenMobile');
 if(!menu||!button)return false;
 if(button.parentElement!==menu){
  const anchor=menu.querySelector('.ledoviaPanelTop');
  if(anchor)anchor.after(button);else menu.prepend(button);
  button.addEventListener('click',()=>menu.querySelector('[data-close-menu]')?.click());
 }
 return true;
}
if(!move()){let n=0;const timer=setInterval(()=>{if(move()||++n>120)clearInterval(timer)},100)}
})();


/* Beta Phase 3 — photographic adventure tiles; safety cards, Account, actions unchanged. */
(()=>{'use strict';
const style=document.createElement('style');style.id='ldAdventurePhotoPhase3';
style.textContent=`
@media(max-width:1049px){
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button:not(.scHomeSOS):not(.scHomeNWS){
background-color:#06343b!important;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;
border:1px solid #368d89!important;border-radius:12px!important;
box-shadow:inset 0 0 0 1px #ffffff10,0 3px 10px #00161caa!important;
text-shadow:0 2px 5px #001017!important;
align-items:flex-start!important;justify-content:flex-end!important;text-align:left!important;
padding:12px!important;min-height:110px!important;gap:3px!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button strong{color:#fff!important;font-size:clamp(13px,3.4vw,16px)!important;text-align:left!important;line-height:1.2!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button span:not(.scLedoviaNew):not(.ledoviaIcon){color:#eaf6f4!important;font-size:10px!important;line-height:1.25!important;text-align:left!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button .ledoviaIcon{width:31px!important;height:31px!important;filter:drop-shadow(0 2px 5px #000)!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-map-action="open"]{background-image:linear-gradient(0deg,#00141df2 0%,#001b2770 65%),url('https://images.unsplash.com/photo-1500534623283-312aade485b7?w=650&q=75')!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-map-action="gps"]{background-image:linear-gradient(0deg,#00141df2 0%,#001b2770 65%),url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=650&q=75')!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-go="routes"]{background-image:linear-gradient(0deg,#00141df2 0%,#001b2770 65%),url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=650&q=75')!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-go="survival"]{background-image:linear-gradient(0deg,#00141df2 0%,#001b2770 65%),url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=650&q=75')!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-go="hazards"]{background-image:linear-gradient(0deg,#00141df2 0%,#001b2770 65%),url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=650&q=75')!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button#scFamilyOpen{background-image:linear-gradient(0deg,#00141df2 0%,#001b2770 65%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=650&q=75')!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button.scLedoviaCompass{background-image:linear-gradient(0deg,#001b1ff0,#003c3999 65%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=650&q=75')!important;border:2px solid #50f3da!important;box-shadow:0 0 12px #28cdb6a8!important}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button:focus-visible{outline:3px solid #fff0a6!important;outline-offset:2px!important}
}
@media(prefers-reduced-data:reduce){#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button{background-image:linear-gradient(155deg,#06464a,#03232b)!important}}
`;document.head.append(style);
})();


/* Beta Phase 4: category-specific photographic cards and clearer safety imagery.
   Purely visual: existing actions, card order, account drawer and offline logic unchanged. */
(()=>{'use strict';
const style=document.createElement('style');style.id='ldCategoryPhotographyPhase4';
style.textContent=`
@media(max-width:1049px){
/* Leave the emergency label side dark; expose more photo on the right. */
#appMain.scHomeActive #ldSafetyFirst>.scHomeSOS{
 background-image:linear-gradient(90deg,rgba(95,3,18,.96) 0%,rgba(115,7,26,.77) 48%,rgba(18,2,12,.24) 100%),url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900&q=80')!important;
 background-position:center,center!important;background-size:cover!important;
}
#appMain.scHomeActive #ldSafetyFirst>.scHomeNWS{
 background-image:linear-gradient(90deg,rgba(0,37,64,.96) 0%,rgba(0,66,104,.73) 48%,rgba(3,16,39,.23) 100%),url('https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900&q=80')!important;
 background-position:center,center!important;background-size:cover!important;
}
/* Each card now has its own subject; gradients preserve legible white labels. */
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button.scLedoviaCompass{
 background-image:linear-gradient(0deg,#001b21f2 0%,#002a2d17 85%),url('https://images.unsplash.com/photo-1472396961693-142e6e269027?w=650&q=80')!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-map-action="open"]{
 background-image:linear-gradient(0deg,#00141df0 0%,#001b2730 85%),url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=650&q=80')!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-map-action="gps"]{
 background-image:linear-gradient(0deg,#00141df0 0%,#001b2730 85%),url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=650&q=80')!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-go="routes"]{
 background-image:linear-gradient(0deg,#00141df0 0%,#001b2730 85%),url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=650&q=80')!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-go="survival"]{
 background-image:linear-gradient(0deg,#00141df0 0%,#001b2730 85%),url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=650&q=80')!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button[data-go="hazards"]{
 background-image:linear-gradient(0deg,#00141df0 0%,#001b2730 85%),url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=650&q=80')!important;
}
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button#scFamilyOpen{
 background-image:linear-gradient(0deg,#00141df0 0%,#001b2730 85%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=650&q=80')!important;
}
/* Stronger image contrast, readable labels and distinct card outline. */
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button:not(.scHomeSOS):not(.scHomeNWS){
 background-position:center!important;background-size:cover!important;
 border-color:#4a9e99!important;
}
}
@media(prefers-reduced-data:reduce){
#appMain.scHomeActive #ldAdventureTiles .scHomeGrid>button,
#appMain.scHomeActive #ldSafetyFirst>button{background-image:linear-gradient(135deg,#083e46,#071c27)!important}
}
`;document.head.append(style);
})();
