/* Ledovia Beta v7 — UI relocation only; original action handlers remain attached. */
(()=>{'use strict';
function init(){
 const header=document.querySelector('body > header'),home=document.querySelector('.scSimpleHome'),grid=home?.querySelector('.scHomeGrid');
 const language=document.querySelector('.scLanguageBar'),version=document.getElementById('scAppVersion'),connection=document.getElementById('connection');
 if(!header||!home||!grid||!language||!version||!connection)return false;
 if(document.getElementById('ledoviaMenuButton'))return true;
 const menuButton=document.createElement('button');menuButton.id='ledoviaMenuButton';menuButton.type='button';menuButton.textContent='☰';menuButton.setAttribute('aria-label','Open navigation menu');menuButton.setAttribute('aria-controls','ledoviaMenuPanel');menuButton.setAttribute('aria-expanded','false');
 const bell=document.createElement('button');bell.id='ledoviaBellButton';bell.type='button';bell.textContent='♧';bell.innerHTML='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';bell.setAttribute('aria-label','Open app notifications');bell.setAttribute('aria-controls','ledoviaNotificationPanel');bell.setAttribute('aria-expanded','false');
 header.append(menuButton,bell);
 const backdrop=document.createElement('div');backdrop.id='ledoviaBackdrop';backdrop.hidden=true;
 const panel=document.createElement('nav');panel.id='ledoviaMenuPanel';panel.setAttribute('aria-label','Ledovia navigation');panel.hidden=true;
 panel.innerHTML='<div class="ledoviaPanelTop"><strong>☰ Ledovia Menu</strong><button type="button" data-close-menu aria-label="Close menu">✕</button></div><h3>Navigation & Places</h3><div id="ledoviaPlaces"></div><h3>Family & Sharing</h3><div id="ledoviaFamily"></div><h3>Preparedness</h3><div id="ledoviaPreparedness"></div><h3>Settings</h3><div id="ledoviaSettings"></div>';
 const notice=document.createElement('section');notice.id='ledoviaNotificationPanel';notice.setAttribute('aria-label','App notifications');notice.hidden=true;
 notice.innerHTML='<div class="ledoviaPanelTop"><strong>Notifications</strong><button type="button" data-close-notice aria-label="Close notifications">✕</button></div><p id="ledoviaConnectionState" role="status"></p><p>For official weather warnings, use the Official Weather Alerts feature. New alerts require an internet connection to refresh.</p><button type="button" id="ledoviaOfflineLink">Offline Readiness</button>';
 document.body.append(backdrop,panel,notice);
 const offline=grid.querySelector('[data-go="offline"]'),places=grid.querySelector('[data-go="places"]'),family=grid.querySelector('#scFamilyOpen'),hazard=grid.querySelector('[data-go="hazards"]');
 if(!offline||!places||!family||!hazard)return false;
 panel.querySelector('#ledoviaPreparedness').append(offline);
 panel.querySelector('#ledoviaPlaces').append(places);
 panel.querySelector('#ledoviaFamily').append(family);
 panel.querySelector('#ledoviaSettings').append(language);
 language.hidden=false;
 const hazardTitle=hazard.querySelector('strong');if(hazardTitle)hazardTitle.textContent='Report a Hazard';
 const foot=document.createElement('div');foot.id='ledoviaBetaFooter';foot.append(version);home.append(foot);
 version.removeAttribute('style');version.setAttribute('aria-label','Ledovia Beta version');
 connection.classList.add('ledoviaConnectionHidden');
 function state(){const online=navigator.onLine;notice.querySelector('#ledoviaConnectionState').textContent=online?'● Device reports an internet connection. Download availability is not verified.':'○ Device reports offline. Only previously stored resources may be available.';}
 function close(){panel.hidden=true;notice.hidden=true;backdrop.hidden=true;menuButton.setAttribute('aria-expanded','false');bell.setAttribute('aria-expanded','false')}
 function open(which){close();backdrop.hidden=false;which.hidden=false;(which===panel?menuButton:bell).setAttribute('aria-expanded','true');which.querySelector('button')?.focus();if(which===notice)state()}
 menuButton.onclick=()=>panel.hidden?open(panel):close();bell.onclick=()=>notice.hidden?open(notice):close();
 backdrop.onclick=close;panel.querySelector('[data-close-menu]').onclick=()=>{close();menuButton.focus()};
 notice.querySelector('[data-close-notice]').onclick=()=>{close();bell.focus()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(!panel.hidden||!notice.hidden))close()});
 panel.querySelectorAll('#ledoviaPlaces button,#ledoviaFamily button,#ledoviaPreparedness button').forEach(b=>b.addEventListener('click',close));
 notice.querySelector('#ledoviaOfflineLink').onclick=()=>{close();offline.click()};
 window.addEventListener('online',state);window.addEventListener('offline',state);
 const update=document.getElementById('scUpdateNotice');
 if(update){const observer=new MutationObserver(()=>{if(!update.hidden){bell.classList.add('ledoviaHasNotice');bell.setAttribute('aria-label','App update available; open notifications')}else{bell.classList.remove('ledoviaHasNotice');bell.setAttribute('aria-label','Open app notifications')}});observer.observe(update,{attributes:true,attributeFilter:['hidden']});}
 return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>100)clearInterval(t)},100)}
})();

/* Mobile Survival focus v1: keep original guide and checklist handlers. */
(()=>{'use strict';
const style=document.createElement('style');style.id='ldSurvivalMobileFocusV1';
style.textContent=`
@media(max-width:760px){
 #appMain:has(#panel-survival.active) .atlasTabs{display:none!important}
 #panel-survival.active{padding:10px 12px 28px!important}
 #panel-survival.active .survivalSubnav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important}
 #panel-survival.active .survivalSubnav button{margin:0!important;min-height:48px!important;border-radius:12px!important;font-size:14px!important}
 #panel-survival.active .survivalHead{padding:4px 0 10px!important}
 #panel-survival.active .survivalPack{border-radius:14px!important;padding:14px!important}
}`;document.head.append(style);
function focusSurvival(){
 if(!matchMedia('(max-width:760px)').matches)return;
 const panel=document.getElementById('panel-survival');
 if(!panel?.classList.contains('active'))return;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if(panel.classList.contains('active'))panel.scrollIntoView({block:'start',behavior:'instant'});
 }));
}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-go="survival"],#tab-survival'))focusSurvival();
});
})();


/* Mobile Survival dedicated page v2: hide map presentation only in Survival. */
(()=>{'use strict';
const style=document.createElement('style');style.id='ldSurvivalDedicatedMobileV2';
style.textContent=`
@media(max-width:760px){
 #appMain:has(#panel-survival.active){display:block!important;min-height:0!important}
 #appMain:has(#panel-survival.active)>#mapwrap{display:none!important}
 #appMain:has(#panel-survival.active)>#sidePanel{display:block!important;width:100%!important;max-width:none!important;max-height:none!important;height:auto!important;overflow:visible!important;margin:0!important;padding:0 10px 24px!important}
 #appMain:has(#panel-survival.active) #sidePanel>.panelTop{display:none!important}
 #appMain:has(#panel-survival.active) #panel-survival{display:block!important;width:100%!important;margin:0!important}
}`;document.head.append(style);
})();


/* LEDOVIA Survival master design — Row 1 only, mobile Beta. */
(()=>{'use strict';
const css=document.createElement('style');css.id='ldSurvivalPhotoRow1';
css.textContent=`
@media(max-width:760px){
 #ldSurvivalRow1{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:10px 0 18px}
 #ldSurvivalRow1 button{position:relative;overflow:hidden;min-width:0;width:100%;height:135px;min-height:135px;border:2px solid #57e4da;border-radius:17px;margin:0!important;padding:0!important;text-align:left;background:#123b3b;color:#fff;box-shadow:0 5px 18px #00191b99}
 #ldSurvivalRow1 button::before{content:"";position:absolute;inset:0;background-size:cover;background-position:center}
 #ldSurvivalRow1 button[data-topic="firstaid"]::before{background-image:linear-gradient(0deg,#001d25ed 0%,#06232908 75%),url('https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=560&q=80')}
 #ldSurvivalRow1 button[data-topic="shelter"]::before{background-image:linear-gradient(0deg,#001d25ed 0%,#06232908 75%),url('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=560&q=80')}
 #ldSurvivalRow1 button>span{position:absolute;bottom:13px;left:11px;right:7px;display:flex;gap:6px;align-items:center;font-size:17px;font-weight:750;line-height:1.12;text-shadow:0 2px 5px #001d22}
 #ldSurvivalRow1 .ldIcon{font-size:24px;flex-shrink:0}
 #ldSurvivalRow1 button:focus-visible{outline:3px solid #fff;outline-offset:2px}
 #ldSurvivalRow1Note{font-size:12px;color:#b8dad5;margin:0 0 12px}
}
@media(min-width:761px){#ldSurvivalRow1,#ldSurvivalRow1Note{display:none}}
`;document.head.append(css);
function init(){
 const panel=document.getElementById('panel-survival');if(!panel)return false;
 if(document.getElementById('ldSurvivalRow1'))return true;
 const row=document.createElement('div');row.id='ldSurvivalRow1';row.setAttribute('aria-label','Survival guide categories');
 for(const [topic,label,icon] of [['firstaid','First Aid','♡'],['shelter','Shelter','⌂']]){
  const button=document.createElement('button');button.type='button';button.dataset.topic=topic;
  button.innerHTML='<span><span class="ldIcon" aria-hidden="true">'+icon+'</span>'+label+'</span>';
  button.setAttribute('aria-label','Explore '+label+' survival guides');
  button.onclick=()=>{
   const guide=[...panel.querySelectorAll('button')].find(b=>/survival guides|guides/i.test(b.textContent)&&!row.contains(b));
   if(guide)guide.click();
   const words=topic==='firstaid'?/first aid|medical|injur/i:/shelter|exposure|camp/i;
   const headings=[...panel.querySelectorAll('h2,h3,h4,summary')];
   const match=headings.find(el=>words.test(el.textContent));
   if(match)match.scrollIntoView({block:'start',behavior:'smooth'});
   else {
    let notice=document.getElementById('ldSurvivalRow1Notice');
    if(!notice){notice=document.createElement('p');notice.id='ldSurvivalRow1Notice';notice.setAttribute('role','status');row.after(notice)}
    notice.textContent=label+' selected. Category-specific lessons will be organized during the content review.';
   }
  };
  row.append(button);
 }
 const note=document.createElement('p');note.id='ldSurvivalRow1Note';note.textContent='Explore essential outdoor skills';
 panel.prepend(note);note.after(row);
 return true;
}
if(!init()){let tries=0;const timer=setInterval(()=>{if(init()||++tries>120)clearInterval(timer)},150)}
})();


/* Approved Survival Row 1 photography correction — preserve layout and handlers. */
(()=>{'use strict';if(document.getElementById('ldSurvivalRow1PhotosV2'))return;
const css=document.createElement('style');css.id='ldSurvivalRow1PhotosV2';
css.textContent=`
@media(max-width:760px){
 #ldSurvivalRow1 button[data-topic="firstaid"]::before{
 background-image:linear-gradient(0deg,rgba(0,24,30,.92) 0%,rgba(0,24,30,.05) 65%),url('https://images.stockcake.com/public/1/5/4/15432da4-dcb4-4485-9128-3cd3eb706f17_medium/outdoor-medical-kit-stockcake.jpg')!important;
 background-position:center!important}
 #ldSurvivalRow1 button[data-topic="shelter"]::before{
 background-image:linear-gradient(0deg,rgba(0,24,30,.92) 0%,rgba(0,24,30,.05) 65%),url('https://images.unsplash.com/photo-1465695954255-a262b0f57b40?w=650&q=80')!important;
 background-position:center!important}
}`;document.head.append(css);
})();


/* Shelter visibility correction v3: brighter tent-focused composition only. */
(()=>{'use strict';if(document.getElementById('ldShelterVisibilityV3'))return;
const css=document.createElement('style');css.id='ldShelterVisibilityV3';
css.textContent=`
@media(max-width:760px){
 #ldSurvivalRow1 button[data-topic="shelter"]::before{
 background-image:linear-gradient(0deg,rgba(0,24,30,.84) 0%,rgba(0,24,30,.02) 55%),url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&q=85')!important;
 background-position:center center!important;
 filter:brightness(1.13) saturate(1.16);
 }
}`;document.head.append(css);
})();
