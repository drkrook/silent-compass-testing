/* LEDOVIA v45: hide only the successful link-verification notice, never errors. */
(()=>{'use strict';
const verified='Recovery link verified. Enter your new password below.';
const sync=()=>{
 const dlg=document.getElementById('ldAccountDialog');
 if(!dlg||!dlg.classList.contains('ldRecoveryPremium'))return;
 const status=dlg.querySelector('.ldResetStatus');
 if(!status)return;
 const isVerified=status.textContent.trim()===verified;
 status.dataset.verified=String(isVerified);
};
const observer=new MutationObserver(mutations=>{
 if(mutations.some(m=>m.target instanceof Element&&m.target.closest('.ldResetStatus')||m.target instanceof Text&&m.target.parentElement?.closest('.ldResetStatus')))sync();
});
observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
sync();
})();
