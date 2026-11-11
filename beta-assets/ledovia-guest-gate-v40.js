/* LEDOVIA Beta guest gate: presentation-only access restriction; emergency controls remain live. */
(()=>{'use strict';
const style=document.createElement('style');
style.textContent=`
body.ldGuestGate #appMain,body.ldGuestGate > header,body.ldGuestGate > footer{display:none!important}
#ldGuestScreen{display:none;min-height:100dvh;background:#103c40;color:#fff;padding:24px 16px;font-family:system-ui,sans-serif}
body.ldGuestGate #ldGuestScreen{display:block}
#ldGuestScreen .ldGuestWrap{max-width:720px;margin:auto}
#ldGuestScreen .ldGuestTop{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px}
#ldGuestScreen button.ldGuestSignIn{background:#17646a;border:1px solid #8ed4ca;border-radius:9px;color:white;padding:12px 16px;font-weight:700;cursor:pointer}
#ldGuestScreen .scEmergencyHelp{background:#17282c;border:1px solid #668c82;border-radius:14px;padding:18px}
#ldGuestScreen .scHelpActions{display:none;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
#ldGuestScreen.ldGuestExpanded .scHelpActions{display:grid}
#ldGuestScreen #scHelpOutput{display:none}
#ldGuestScreen.ldGuestExpanded #scHelpOutput{display:block}
#ldGuestScreen .ldGuestExpand{display:block;width:100%;margin:16px 0 0;padding:12px;border:1px solid #668c82;border-radius:10px;background:#244b4d;color:#fff;font-weight:700;cursor:pointer}
#ldGuestScreen .scEmergencyHelp>.scHelpNote:last-child{display:none}
#ldGuestScreen .scHelpActions button{min-height:72px;white-space:normal}
#ldGuestScreen .scCall911{display:block;text-align:center;padding:17px;background:#7c2525;color:white;border-radius:12px;font-weight:700}
@media(max-width:440px){#ldGuestScreen .scHelpActions{grid-template-columns:1fr}}
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
 const brand=document.createElement('strong');brand.textContent='🏔️ LEDOVIA · Emergency Access';
 const signIn=document.createElement('button');signIn.type='button';signIn.className='ldGuestSignIn';signIn.textContent='Sign in';signIn.onclick=()=>homeAccount.click();
 top.append(brand,signIn);
 const note=document.createElement('p');note.textContent='Emergency assistance is available without signing in. Sign in to access the rest of LEDOVIA.';
 wrap.append(top,note);screen.append(wrap);document.body.append(screen);
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