/* LEDOVIA Beta: accessible password visibility and secure recovery completion. */
(()=>{'use strict';
const base='https://uymjxxgpsnezlaifsgwv.supabase.co/auth/v1';
const key='sb_publishable_EYvWf8w_3n79nnVgmESJLw_Q_vMeXM_';
const style=document.createElement('style');
style.textContent=`
#ldAccountDialog .ldPasswordWrap{position:relative;flex:0 0 100%;width:100%;min-width:0}
#ldAccountDialog .ldPasswordWrap input{padding-right:80px!important}
#ldAccountDialog .ldPasswordEye{position:absolute;right:9px;top:50%;transform:translateY(-50%);min-width:60px;min-height:44px;padding:7px!important;border:1px solid #8ed4ca!important;border-radius:9px!important;background:#07545e!important;color:white!important;font-size:13px;font-weight:700}
#ldAccountDialog .ldResetTitle{text-align:center;font-size:clamp(22px,4vw,30px);margin:8px 0}
#ldAccountDialog .ldResetText{text-align:center;line-height:1.5}
#ldAccountDialog .ldResetForm{display:grid;gap:14px}
#ldAccountDialog .ldResetForm label{display:block;font-weight:700}
#ldAccountDialog .ldResetForm .ldPasswordWrap{margin-top:5px}
#ldAccountDialog .ldResetForm input{width:100%!important}
#ldAccountDialog .ldResetRules{padding:14px;border:1px solid #31c9c4;border-radius:12px;background:#003942;color:#ddf8f5;line-height:1.8}
#ldAccountDialog .ldResetRules strong{display:block;color:#7ef0e4}
#ldAccountDialog .ldResetPrimary{width:100%;min-height:58px;background:linear-gradient(130deg,#13b9ae,#006571)!important;border:2px solid #7cfff0!important;font-size:19px;font-weight:800}
#ldAccountDialog .ldResetStatus{white-space:pre-wrap;line-height:1.5}
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
 dlg.replaceChildren();
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
 rules.innerHTML='<strong>Password Requirements</strong>At least 8 characters<br>Uppercase letter (A–Z)<br>Lowercase letter (a–z)<br>Number (0–9)<br>Symbol (such as ! or #)';
 form.append(rules);
 const submit=document.createElement('button');submit.type='submit';submit.className='ldResetPrimary';submit.textContent='Update Password →';form.append(submit);
 const back=document.createElement('button');back.type='button';back.textContent='← Back to Sign In';back.onclick=()=>{dlg.close();const b=document.getElementById('ldAccountOpenDesktop')||document.getElementById('ldAccountOpenMobile');b?.click()};panel.append(back);
 if(!dlg.open)dlg.showModal();
 async function request(path,method,body){
  const response=await fetch(base+path,{method,headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,cache:'no-store'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(data.msg||data.error_description||data.message||data.error||'Unable to verify recovery link');
  return data;
 }
 (async()=>{try{await request('/user','GET');status.textContent='Recovery link verified. Enter your new password.';form.hidden=false}catch(e){status.textContent='This recovery link is invalid or expired. Please request a new password-reset email.'}})();
 form.onsubmit=async e=>{
  e.preventDefault();
  const value=first.value;
  if(value.length<8||!/[a-z]/.test(value)||!/[A-Z]/.test(value)||!/[0-9]/.test(value)||!/[^a-zA-Z0-9\s]/.test(value)){status.textContent='Use at least 8 characters, including uppercase, lowercase, a number and a symbol.';return}
  if(value!==second.value){status.textContent='Passwords do not match.';return}
  submit.disabled=true;status.textContent='Updating password…';
  try{await request('/user','PUT',{password:value});first.value='';second.value='';form.hidden=true;status.textContent='Password updated successfully. You can now sign in with your new password.'}
  catch(e){status.textContent=String(e.message||e)}finally{submit.disabled=false}
 };
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();