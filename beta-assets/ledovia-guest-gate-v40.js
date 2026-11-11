/* LEDOVIA Beta guest gate: presentation-only access restriction; emergency controls remain live. */
(()=>{'use strict';
const style=document.createElement('style');
style.textContent=`
body.ldGuestGate #appMain,body.ldGuestGate > header,body.ldGuestGate > footer{display:none!important}
#ldGuestScreen{display:none;min-height:100dvh;background-image:linear-gradient(90deg,#021c26eb 0%,#063c43b8 54%,#021c26b0 100%),linear-gradient(180deg,#082b3200 0%,#061e29d9 85%),url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=85'),url('./ledovia-landscape-desktop-v4.svg');background-size:cover,cover,cover,cover;background-position:center,center,center 48%,center;background-repeat:no-repeat;background-attachment:fixed;color:#fff;padding:clamp(18px,3vw,38px) 16px;font-family:system-ui,sans-serif}
body.ldGuestGate #ldGuestScreen{display:block}
#ldGuestScreen .ldGuestWrap{max-width:900px;margin:clamp(12px,5vh,65px) auto 0}
#ldGuestScreen .ldGuestTop{display:flex;align-items:flex-start;flex-direction:column;gap:20px;margin-bottom:22px}
#ldGuestScreen button.ldGuestSignIn{background:linear-gradient(135deg,#1a8c89,#09616b);border:2px solid #a5f3e5;border-radius:12px;color:white;padding:16px 36px;font-size:18px;font-weight:800;box-shadow:0 6px 24px #001b24a6;cursor:pointer}
#ldGuestScreen .ldGuestBrand{display:block;width:clamp(180px,32vw,330px);height:116px;object-fit:contain;object-position:left center;filter:drop-shadow(0 6px 16px #001a20)}
#ldGuestScreen .ldGuestTagline{font-size:clamp(16px,2.1vw,23px);font-weight:650;line-height:1.4;max-width:650px;text-shadow:0 3px 15px #001820}
#ldGuestScreen .scEmergencyHelp{background:linear-gradient(130deg,#102d33f2,#09252ae8);border:1px solid #7ebeb6;border-radius:16px;padding:clamp(16px,3vw,26px);box-shadow:0 16px 44px #00141b9c;backdrop-filter:blur(5px)}
#ldGuestScreen .scEmergencyHelp h2{margin-top:0}
#ldGuestScreen .scHelpActions{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#ldGuestScreen.ldGuestExpanded .scHelpActions{display:grid}
#ldGuestScreen #scHelpOutput{display:none}
#ldGuestScreen.ldGuestExpanded #scHelpOutput{display:block}
#ldGuestScreen .ldGuestExpand{display:block;width:100%;margin:16px 0 0;padding:12px;border:1px solid #668c82;border-radius:10px;background:#244b4d;color:#fff;font-weight:700;cursor:pointer}
#ldGuestScreen .scEmergencyHelp>.scHelpNote:last-child{display:none}
#ldGuestScreen .scHelpActions button{min-height:72px;white-space:normal}
#ldGuestScreen .scCall911{display:block;text-align:center;padding:17px;background:linear-gradient(180deg,#b52d35,#7c2029);color:white;border-radius:12px;font-weight:800}
@media(max-width:700px){#ldGuestScreen{background-attachment:scroll;background-position:center,center,center,center}#ldGuestScreen .ldGuestWrap{margin:10px auto 0}#ldGuestScreen .ldGuestBrand{height:90px}}
@media(max-width:440px){#ldGuestScreen .scHelpActions{grid-template-columns:1fr}}
@media(prefers-reduced-data:reduce){#ldGuestScreen{background-image:linear-gradient(90deg,#021c26e8,#063c43b0),url('./ledovia-landscape-desktop-v4.svg');background-size:cover}}
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
 const signIn=document.createElement('button');signIn.type='button';signIn.className='ldGuestSignIn';signIn.textContent='Sign in to LEDOVIA';signIn.onclick=()=>homeAccount.click();
 top.append(brand,signIn);
 const note=document.createElement('p');note.className='ldGuestTagline';note.textContent='Ready for the Adventure. Prepared for the Unexpected.';
 wrap.append(top,note);screen.append(wrap);document.body.append(screen);
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
  if(next===guest)return;guest=next;
  if(guest){wrap.append(help);document.body.classList.add('ldGuestGate')}
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