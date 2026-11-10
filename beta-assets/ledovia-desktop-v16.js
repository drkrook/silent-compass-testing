/* Beta v0.8.16: dashboard presentation only; Compass engine untouched. */
(()=>{'use strict';function apply(){const dash=document.getElementById('ledoviaDesktopDashboard');if(!dash)return false;
 const brand=dash.querySelector('.ld14Brand');if(brand&&!brand.querySelector('img')){brand.textContent='';const logo=document.createElement('img');logo.src='./ledovia-logo.svg';logo.alt='';logo.className='ld16Logo';brand.append(logo,document.createTextNode('LEDOVIA'));}
 dash.querySelector('.ld14Plan button[data-action="compass"]')?.remove();return true}
 if(!apply()){let n=0;const t=setInterval(()=>{if(apply()||++n>100)clearInterval(t)},100)}
})();