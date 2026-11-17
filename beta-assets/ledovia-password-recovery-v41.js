/* LEDOVIA Beta: accessible password visibility and secure recovery completion. */
(()=>{'use strict';
const base='https://uymjxxgpsnezlaifsgwv.supabase.co/auth/v1';
const key='sb_publishable_EYvWf8w_3n79nnVgmESJLw_Q_vMeXM_';
const style=document.createElement('style');
style.textContent=`
#ldAccountDialog .ldPasswordWrap{position:relative;flex:0 0 100%;width:100%;min-width:0;box-sizing:border-box}\n#ldAccountDialog .ldAccountPanel form:not(.ldResetForm)>.ldPasswordWrap{order:0;margin:0 0 10px}\n#ldAccountDialog .ldAccountPanel form:not(.ldResetForm)>.ldPasswordWrap input{display:block;width:100%!important;margin:0!important}\n#ldAccountDialog .ldAccountPanel form:not(.ldResetForm)>.ldPasswordWrap .ldPasswordEye{order:unset;width:auto!important;flex:none!important;margin:0!important}
#ldAccountDialog .ldPasswordWrap input{padding-right:80px!important}
#ldAccountDialog .ldPasswordEye{position:absolute;right:9px;top:50%;transform:translateY(-50%);min-width:60px;min-height:44px;padding:7px!important;border:1px solid #8ed4ca!important;border-radius:9px!important;background:#07545e!important;color:white!important;font-size:13px;font-weight:700}
#ldAccountDialog .ldResetTitle{text-align:center;font-size:clamp(22px,4vw,30px);margin:8px 0}
#ldAccountDialog .ldResetText{text-align:center;line-height:1.5}
#ldAccountDialog .ldResetForm{display:grid;gap:14px}\n#ldAccountDialog .ldResetForm[hidden]{display:none!important}
#ldAccountDialog .ldResetForm label{display:block;font-weight:700}
#ldAccountDialog .ldResetForm .ldPasswordWrap{margin-top:5px}
#ldAccountDialog .ldResetForm input{width:100%!important}
#ldAccountDialog .ldResetRules{padding:14px;border:1px solid #31c9c4;border-radius:12px;background:#003942;color:#ddf8f5;line-height:1.8}
#ldAccountDialog .ldResetRules strong{display:block;color:#7ef0e4}
#ldAccountDialog .ldResetPrimary{width:100%;min-height:58px;background:linear-gradient(130deg,#13b9ae,#006571)!important;border:2px solid #7cfff0!important;font-size:19px;font-weight:800}
#ldAccountDialog:has(.ldResetForm) {width:min(94vw,520px);max-height:94dvh;overflow:auto;border:1px solid rgba(119,241,222,.5);border-radius:22px;background:linear-gradient(180deg,rgba(3,32,43,.91),rgba(3,22,32,.97)),url('./ledovia-mountains.svg') center/cover;color:#f2fffd;box-shadow:0 22px 80px #00151dcc;backdrop-filter:blur(16px)}
#ldAccountDialog:has(.ldResetForm) .ldAccountHeading{background:transparent}
#ldAccountDialog:has(.ldResetForm) .ldAccountHero{background:transparent}
#ldAccountDialog:has(.ldResetForm) .ldAccountPanel{background:rgba(2,30,39,.7);border:1px solid rgba(107,225,211,.4);border-radius:18px;padding:clamp(14px,4vw,24px);box-shadow:0 12px 35px #001b2599}
#ldAccountDialog .ldResetTitle{color:#f4fffd;letter-spacing:.01em;font-weight:800}
#ldAccountDialog .ldResetText{color:#c5e8e4}
#ldAccountDialog .ldResetForm label{color:#e7fffa}
#ldAccountDialog .ldResetForm input{min-height:52px;border:1px solid #72bdb6!important;border-radius:10px!important;background:#052b37!important;color:#fff!important}
#ldAccountDialog .ldResetRules{background:rgba(0,49,57,.85);border-color:#428f89}
#ldAccountDialog .ldResetRule{display:flex;align-items:center;gap:9px;line-height:1.65;font-size:14px}
#ldAccountDialog .ldResetRule::before{content:'○';color:#a2bdb9;font-weight:900}
#ldAccountDialog .ldResetRule[data-valid="true"]{color:#b8ffe5}
#ldAccountDialog .ldResetRule[data-valid="true"]::before{content:'✓';color:#63efb4}
#ldAccountDialog .ldResetMatch{min-height:20px;font-size:13px;color:#b5d4d0}
#ldAccountDialog .ldResetMatch[data-valid="true"]{color:#79f1ba}
#ldAccountDialog .ldResetPrimary:disabled{opacity:.5;cursor:not-allowed;filter:grayscale(.4)}
#ldAccountDialog .ldResetStatus{white-space:pre-wrap;line-height:1.5}

/* Recovery-only premium visual treatment; account sign-in remains unchanged. */
#ldAccountDialog.ldRecoveryPremium{width:min(96vw,640px)!important;max-height:calc(100dvh - 20px)!important;overflow-y:auto!important;box-sizing:border-box;padding:clamp(16px,4vw,30px)!important;border:1px solid #3de2dc!important;border-radius:22px!important;background:linear-gradient(180deg,rgba(0,24,35,.26),rgba(0,24,35,.75)),url('./ledovia-mountains.svg') center/cover no-repeat!important;color:#fff!important;box-shadow:0 24px 75px #00141de8!important}
#ldAccountDialog.ldRecoveryPremium::backdrop{background:#00131cd9}
#ldAccountDialog.ldRecoveryPremium .ldAccountHeading{display:flex;align-items:center;justify-content:space-between;background:transparent!important;padding:0!important}
#ldAccountDialog.ldRecoveryPremium .ldAccountHeading h2{font-size:18px!important;margin:0!important}
#ldAccountDialog.ldRecoveryPremium .ldAccountHeading button{background:#003f4bcf;color:#fff;border:1px solid #55dcd7;border-radius:9px;padding:10px 14px}
#ldAccountDialog.ldRecoveryPremium .ldAccountHero{background:transparent!important;text-align:center;padding:0!important}
#ldAccountDialog.ldRecoveryPremium .ldAccountLogo{display:block;width:min(78%,330px)!important;max-height:145px!important;object-fit:contain;margin:auto!important;filter:drop-shadow(0 3px 12px #001c26)}
#ldAccountDialog.ldRecoveryPremium .ldResetTitle{font-size:clamp(24px,5vw,32px)!important;margin:6px 0!important;color:white!important;text-shadow:0 2px 10px #001923}
#ldAccountDialog.ldRecoveryPremium .ldResetTitle::before{content:'🔒';font-size:.8em;margin-right:10px}
#ldAccountDialog.ldRecoveryPremium .ldResetText{color:#fff!important;margin:0 0 16px!important}
#ldAccountDialog.ldRecoveryPremium .ldAccountPanel{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
#ldAccountDialog.ldRecoveryPremium .ldResetStatus{padding:15px!important;margin:0 0 16px!important;border:1px solid #4de3aa;border-radius:13px;background:#003c3ce8;color:#e9fff6!important;font-weight:700}
#ldAccountDialog.ldRecoveryPremium .ldResetStatus[data-verified="true"]::before{content:'✓';display:inline-block;margin-right:12px;padding:1px 9px;border:2px solid #83f7a5;border-radius:50%;color:#83f7a5;font-size:23px}
#ldAccountDialog.ldRecoveryPremium .ldResetForm{gap:13px!important}
#ldAccountDialog.ldRecoveryPremium .ldResetForm label{color:white!important;font-size:15px!important}
#ldAccountDialog.ldRecoveryPremium .ldResetForm input{min-height:53px!important;background:#00313edc!important;border:1.5px solid #3ce4e2!important;border-radius:11px!important;color:white!important;font-size:16px!important}
#ldAccountDialog.ldRecoveryPremium .ldPasswordEye{background:#00434d!important;border-color:#37c6c2!important}
#ldAccountDialog.ldRecoveryPremium .ldResetRules{padding:17px!important;border:1px solid #3ad8d4!important;border-radius:16px!important;background:#003640ed!important}
#ldAccountDialog.ldRecoveryPremium .ldResetRules strong{font-size:19px!important;color:white!important;margin-bottom:8px}
#ldAccountDialog.ldRecoveryPremium .ldResetRules strong::before{content:'⚿';margin-right:10px;color:#d5fffa}
#ldAccountDialog.ldRecoveryPremium .ldResetRule{font-size:15px!important;color:#eafff9!important;line-height:1.85!important}
#ldAccountDialog.ldRecoveryPremium .ldResetRule::before{content:' ';display:inline-block;flex:none;width:18px;height:18px;border:2px solid #94b4b6;border-radius:50%}
#ldAccountDialog.ldRecoveryPremium .ldResetRule[data-valid="true"]::before{content:'✓';border-color:#a3fb29;color:#a3fb29;text-align:center;line-height:16px}
#ldAccountDialog.ldRecoveryPremium .ldResetPrimary{min-height:60px!important;border-radius:13px!important;background:linear-gradient(180deg,#10cbc9,#00727c)!important;box-shadow:0 0 20px #10c9c655!important;font-size:21px!important}
#ldAccountDialog.ldRecoveryPremium .ldResetBack{display:block;margin:5px auto 0;padding:11px 22px;border:1px solid #39d4d0;border-radius:10px;background:#003944;color:#fff;font-weight:700}
@media(max-width:480px){#ldAccountDialog.ldRecoveryPremium{width:calc(100vw - 20px)!important;max-height:calc(100dvh - 16px)!important;padding:16px!important}#ldAccountDialog.ldRecoveryPremium .ldAccountLogo{max-height:105px!important}#ldAccountDialog.ldRecoveryPremium .ldResetRules{padding:13px!important}}

`;
document.head.append(style);
function eye(input){
 if(!input||input.parentElement?.classList.contains('ldPasswordWrap'))return;
 const wrap=document.createElement('div');wrap.className='ldPasswordWrap';
 input.before(wrap);wrap.append(input);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='ldPasswordEye';
 toggle.textContent='Show';toggle.setAttribute('aria-label','Show password');toggle.setAttribute('aria-pressed','false');
 toggle.onclick=()=>{const visible=input.type==='password';input.type=visible?'text':'password';toggle.textContent=visible?'Hide':'Show';toggle.setAttribute('aria-label',visible?'Hide password':'Show password');toggle.setAttribute('aria-pressed',String(visible));input.focus()};
 wrap.append(toggle);
}
function addEyes(host){host.querySelectorAll('input[type="password"]').forEach(eye)}
function patchAuth(){
 if(typeof window.scFamilyAuthUI!=='function')return false;
 const original=window.scFamilyAuthUI;
 if(original.ldEyes)return true;
 const wrapped=function(host){const result=original.apply(this,arguments);addEyes(host);return result};
 wrapped.ldEyes=true;window.scFamilyAuthUI=wrapped;return true;
}
if(!patchAuth()){let attempts=0;const t=setInterval(()=>{if(patchAuth()||++attempts>120)clearInterval(t)},100)}
const hash=new URLSearchParams(location.hash.replace(/^#/,''));
if(hash.get('type')!=='recovery'||!hash.get('access_token'))return;
const token=hash.get('access_token');
const clean=location.pathname+location.search;
history.replaceState(null,'',clean);
function init(){
 if(typeof window.scFamilyAuthUI!=='function'||!document.body)return false;
 let dlg=document.getElementById('ldAccountDialog');
 if(!dlg){dlg=document.createElement('dialog');dlg.id='ldAccountDialog';document.body.append(dlg)}
 dlg.replaceChildren();dlg.classList.add('ldRecoveryPremium');
 const heading=document.createElement('div');heading.className='ldAccountHeading';
 const h=document.createElement('h2');h.textContent='My Account';
 const close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=()=>dlg.close();
 heading.append(h,close);dlg.append(heading);
 const hero=document.createElement('div');hero.className='ldAccountHero';
 const logo=document.createElement('img');logo.src='./ledovia-official-logo.svg';logo.alt='LEDOVIA';logo.className='ldAccountLogo';hero.append(logo);dlg.append(hero);
 const title=document.createElement('h2');title.className='ldResetTitle';title.textContent='Set a New Password';dlg.append(title);
 const info=document.createElement('p');info.className='ldResetText';info.textContent='Create a new password for your LEDOVIA account.';dlg.append(info);
 const panel=document.createElement('section');panel.className='ldAccountPanel';dlg.append(panel);
 const status=document.createElement('p');status.className='ldResetStatus';status.setAttribute('role','status');status.textContent='Verifying your recovery link…';panel.append(status);
 const form=document.createElement('form');form.className='ldResetForm';form.hidden=true;panel.append(form);
 function field(labelText){
  const label=document.createElement('label');label.textContent=labelText;
  const input=document.createElement('input');input.type='password';input.required=true;input.minLength=8;input.autocomplete='new-password';input.placeholder=labelText;input.setAttribute('aria-label',labelText);
  label.append(input);form.append(label);eye(input);return input;
 }
 const first=field('New password');const second=field('Confirm new password');
 const rules=document.createElement('div');rules.className='ldResetRules';
 rules.innerHTML='<strong>Password Requirements</strong>';
 const checks=[['At least 8 characters',v=>v.length>=8],['Uppercase letter (A–Z)',v=>/[A-Z]/.test(v)],['Lowercase letter (a–z)',v=>/[a-z]/.test(v)],['Number (0–9)',v=>/[0-9]/.test(v)],['Symbol (such as ! or #)',v=>/[^a-zA-Z0-9\s]/.test(v)]];
 const indicators=checks.map(([label])=>{const item=document.createElement('div');item.className='ldResetRule';item.textContent=label;item.dataset.valid='false';rules.append(item);return item});
 const match=document.createElement('div');match.className='ldResetMatch';match.setAttribute('aria-live','polite');match.textContent='Confirm your new password.';
 form.append(rules,match);
 const submit=document.createElement('button');submit.type='submit';submit.className='ldResetPrimary';submit.textContent='Update Password →';submit.disabled=true;form.append(submit);
 function validate(){
  const value=first.value;
  const valid=checks.map(([,test])=>test(value));
  indicators.forEach((item,i)=>{item.dataset.valid=String(valid[i])});
  const matching=second.value.length>0&&value===second.value;
  match.dataset.valid=String(matching);
  match.textContent=!second.value?'Confirm your new password.':matching?'✓ Passwords match':'Passwords do not match yet.';
  submit.disabled=!(valid.every(Boolean)&&matching);
  return valid.every(Boolean)&&matching;
 }
 first.addEventListener('input',validate);second.addEventListener('input',validate);validate();
 const back=document.createElement('button');back.type='button';back.className='ldResetBack';back.textContent='← Back to Sign In';back.onclick=()=>{dlg.close();const b=document.getElementById('ldAccountOpenDesktop')||document.getElementById('ldAccountOpenMobile');b?.click()};panel.append(back);
 if(!dlg.open)dlg.showModal();
 async function request(path,method,body){
  const response=await fetch(base+path,{method,headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.msg||data.error_description||data.message||data.error||'Unable to verify recovery link');
  return data;
 }
 (async()=>{try{await request('/user','GET');status.textContent='Recovery link verified. Enter your new password below.';status.dataset.verified='true';form.hidden=false}catch(e){status.textContent='This recovery link is invalid or expired. Please request a new password-reset email.'}})();
 form.onsubmit=async e=>{
  e.preventDefault();
  const value=first.value;
  if(!validate()){status.textContent='Complete all password requirements and confirm your password.';return}
  if(value.length<8||!/[a-z]/.test(value)||!/[A-Z]/.test(value)||!/[0-9]/.test(value)||!/[^a-zA-Z0-9\s]/.test(value)){status.textContent='Use at least 8 characters, including uppercase, lowercase, a number and a symbol.';return}
  if(value!==second.value){status.textContent='Passwords do not match.';return}
  submit.disabled=true;status.textContent='Updating password…';
  try{await request('/user','PUT',{password:value});first.value='';second.value='';validate();form.hidden=true;status.textContent='Password updated successfully. You can now sign in with your new password.'}
  catch(e){status.textContent=String(e.message||e)}finally{submit.disabled=false}
 };
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();