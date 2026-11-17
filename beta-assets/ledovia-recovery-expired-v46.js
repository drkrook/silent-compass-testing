/* LEDOVIA Beta v46: explicit feedback for rejected recovery links. */
(()=>{'use strict';
const params=new URLSearchParams(location.hash.replace(/^#/,''));
const code=(params.get('error_code')||'').toLowerCase();
const error=(params.get('error')||'').toLowerCase();
const desc=(params.get('error_description')||'').toLowerCase();
const rejected=(code==='otp_expired'||code==='access_denied'||error==='access_denied'||(error&&/expired|invalid|already used/.test(desc)));
if(!rejected)return;
history.replaceState(null,'',location.pathname+location.search);
function show(){
 if(!document.body)return;
 const dlg=document.createElement('dialog');dlg.id='ldRecoveryExpiredDialog';dlg.setAttribute('aria-labelledby','ldRecoveryExpiredTitle');
 dlg.innerHTML='<div class="ldRecoveryExpiredInner"><img class="ldRecoveryExpiredLogo" src="./ledovia-approved-logo-v45.jpg" alt="LEDOVIA"><h2 id="ldRecoveryExpiredTitle">Password Reset Link Expired</h2><p>This password-reset link has expired or has already been used. For your security, please request a new password-reset email.</p><button type="button" class="ldRecoveryExpiredButton">Return to Sign In</button></div>';
 document.body.append(dlg);
 dlg.querySelector('button').addEventListener('click',()=>{
  dlg.close();dlg.remove();
  const button=document.getElementById('ldAccountOpenDesktop')||document.getElementById('ldAccountOpenMobile');
  button?.click();
 });
 dlg.addEventListener('cancel',e=>{e.preventDefault()});
 dlg.showModal();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',show,{once:true});else show();
})();
