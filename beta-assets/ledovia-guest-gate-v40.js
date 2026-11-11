/* LEDOVIA Beta guest gate: presentation-only access restriction; emergency controls remain live. */
(()=>{'use strict';
const style=document.createElement('style');
style.textContent=`
body.ldGuestGate #appMain,body.ldGuestGate > header,body.ldGuestGate > footer{display:none!important}
#ldGuestScreen{display:none;min-height:100dvh;color:#fff;padding:clamp(20px,4vw,48px) 18px 42px;font-family:system-ui,sans-serif;background-image:linear-gradient(180deg,#062d36a8 0%,#0538438c 46%,#031b28d1 100%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85'),url('./ledovia-landscape-desktop-v4.svg');background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#062e37}
body.ldGuestGate #ldGuestScreen{display:block}
#ldGuestScreen .ldGuestWrap{max-width:1040px;margin:0 auto;text-align:center}
#ldGuestScreen .ldGuestTop{display:flex;align-items:center;flex-direction:column;gap:28px}
#ldGuestScreen .ldGuestBrand{display:block;width:clamp(260px,45vw,570px);height:auto;max-height:245px;object-fit:contain;filter:drop-shadow(0 5px 18px #001a23)}
#ldGuestScreen .ldGuestTagline{font-size:clamp(22px,3vw,40px);font-weight:800;line-height:1.25;text-shadow:0 4px 18px #001820;margin:16px auto 34px}
#ldGuestScreen .ldGuestTagline span{display:block}
#ldGuestScreen .ldGuestTagline span:last-child{color:#69e9e3;font-style:italic}
#ldGuestScreen .ldGuestAccent{height:5px;width:140px;border-radius:5px;background:#31c5bd;margin:8px auto 28px;box-shadow:0 0 20px #18b6ae66}
#ldGuestScreen button.ldGuestSignIn{background:linear-gradient(135deg,#159c98,#086a72);border:3px solid #b5fff3;border-radius:16px;color:white;padding:20px clamp(24px,6vw,76px);font-size:clamp(18px,2.2vw,28px);font-weight:800;box-shadow:0 12px 35px #001b24a6;cursor:pointer;min-height:72px}
#ldGuestScreen button.ldGuestSignIn:hover,#ldGuestScreen button.ldGuestSignIn:focus-visible{background:#138c8b;outline:3px solid #fff;outline-offset:3px}
#ldGuestScreen .ldGuestEmergencyLink{display:inline-block;background:none;border:0;color:#d6f8f5;text-decoration:underline;text-underline-offset:4px;cursor:pointer;font:600 14px system-ui;margin:30px auto 0;padding:10px}
#ldGuestScreen .ldGuestEmergency{display:none;text-align:left;max-width:780px;margin:20px auto 0}
#ldGuestScreen.ldGuestShowEmergency .ldGuestEmergency{display:block}
#ldGuestScreen .scEmergencyHelp{background:#10272df2;border:1px solid #7ebeb6;border-radius:16px;padding:clamp(16px,3vw,26px);box-shadow:0 16px 44px #00141b9c}
#ldGuestScreen .scEmergencyHelp h2{margin-top:0}
#ldGuestScreen .scHelpActions{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#ldGuestScreen.ldGuestExpanded .scHelpActions{display:grid}
#ldGuestScreen #scHelpOutput{display:none}
#ldGuestScreen.ldGuestExpanded #scHelpOutput{display:block}
#ldGuestScreen .ldGuestExpand{display:block;width:100%;margin:16px 0 0;padding:12px;border:1px solid #668c82;border-radius:10px;background:#244b4d;color:#fff;font-weight:700;cursor:pointer}
#ldGuestScreen .scEmergencyHelp>.scHelpNote:last-child{display:none}
#ldGuestScreen .scHelpActions button{min-height:72px;white-space:normal}
#ldGuestScreen .scCall911{display:block;text-align:center;padding:17px;background:linear-gradient(180deg,#b52d35,#7c2029);color:white;border-radius:12px;font-weight:800}
@media(max-width:700px){#ldGuestScreen{padding:30px 14px 42px;min-height:100dvh;background-position:center}#ldGuestScreen .ldGuestTop{gap:18px}#ldGuestScreen .ldGuestBrand{width:min(86vw,420px)}#ldGuestScreen .ldGuestTagline{font-size:clamp(19px,5.3vw,30px);margin:14px auto 25px}#ldGuestScreen button.ldGuestSignIn{width:min(92%,440px)}#ldGuestScreen .ldGuestEmergencyLink{margin-top:32px}}
@media(max-width:440px){#ldGuestScreen .scHelpActions{grid-template-columns:1fr}}
@media(prefers-reduced-data:reduce){#ldGuestScreen{background-image:linear-gradient(180deg,#062d36a8,#031b28d1),url('./ledovia-landscape-desktop-v4.svg')}}
`;
document.head.append(style);
function init(){
 const help=document.querySelector('.scEmergencyHelp');
 const homeAccount=document.getElementById('ldAccountOpenDesktop');
 if(!help||!homeAccount||typeof scAuthGet!=='function')return false;
 if(document.getElementById('ldGuestScreen'))return true;
 const originalParent=help.parentNode,anchor=document.createComment('Emergency Help original position');
 originalParent.insertBefore(anchor,help);
 const screen=document.createElement('section');screen.id='ldGuestScreen';screen.setAttribute('aria-label','Emergency access');
 const wrap=document.createElement('div');wrap.className='ldGuestWrap';
 const top=document.createElement('div');top.className='ldGuestTop';
 const brand=document.createElement('img');brand.className='ldGuestBrand';brand.src='./ledovia-official-logo.svg';brand.alt='LEDOVIA';
 const accent=document.createElement('div');accent.className='ldGuestAccent';accent.setAttribute('aria-hidden','true');
 const note=document.createElement('p');note.className='ldGuestTagline';
 const first=document.createElement('span');first.textContent='Ready for the Adventure.';
 const second=document.createElement('span');second.textContent='Prepared for the Unexpected.';
 note.append(first,second);
 const signIn=document.createElement('button');signIn.type='button';signIn.className='ldGuestSignIn';signIn.textContent='Sign in to LEDOVIA  →';signIn.onclick=()=>homeAccount.click();
 top.append(brand,accent,note,signIn);
 const emergencyLink=document.createElement('button');emergencyLink.type='button';emergencyLink.className='ldGuestEmergencyLink';emergencyLink.textContent='Emergency Access · No sign-in required';
 emergencyLink.setAttribute('aria-expanded','false');emergencyLink.setAttribute('aria-controls','ldGuestEmergencyArea');
 const emergencyArea=document.createElement('div');emergencyArea.id='ldGuestEmergencyArea';emergencyArea.className='ldGuestEmergency';
 emergencyLink.onclick=()=>{const visible=screen.classList.toggle('ldGuestShowEmergency');emergencyLink.setAttribute('aria-expanded',String(visible));if(visible)emergencyArea.scrollIntoView({block:'nearest',behavior:'smooth'});};
 wrap.append(top,emergencyLink,emergencyArea);screen.append(wrap);document.body.append(screen);
 const emergencyDescription=help.querySelector('p');if(emergencyDescription)emergencyDescription.textContent='If someone is in immediate danger, contact emergency services if possible. LEDOVIA cannot send an emergency alert.';
 const actions=help.querySelector('.scHelpActions');
 if(!actions) return false;
 const expand=document.createElement('button');expand.type='button';expand.className='ldGuestExpand';
 expand.textContent='More Emergency Tools';expand.setAttribute('aria-expanded','false');
 expand.setAttribute('aria-controls',actions.id||'ldGuestEmergencyActions');
 if(!actions.id)actions.id='ldGuestEmergencyActions';
 actions.before(expand);
 expand.onclick=()=>{
  const open=screen.classList.toggle('ldGuestExpanded');
  expand.setAttribute('aria-expanded',String(open));
  expand.textContent=open?'Hide Emergency Tools':'More Emergency Tools';
 };
 let guest=null;
 function check(){
  const a=scAuthGet();const next=!(a&&a.access_token&&a.expires_at>Date.now()/1000);
  if(next===guest)return;
  const previous=guest;guest=next;
  if(previous!==null){const dlg=document.getElementById('ldAccountDialog');if(dlg&&dlg.open)dlg.close();}
  if(guest){emergencyArea.append(help);document.body.classList.add('ldGuestGate')}
  else{anchor.parentNode.insertBefore(help,anchor.nextSibling);document.body.classList.remove('ldGuestGate')}
 }
 check();
 // Existing authentication UI saves tokens without emitting an event.
 setInterval(check,500);
 window.addEventListener('storage',check);
 return true;
}
if(!init()){let tries=0;const timer=setInterval(()=>{if(init()||++tries>150)clearInterval(timer)},100)}
})();