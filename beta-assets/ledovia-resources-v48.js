/* LEDOVIA Gucci Resources v48 — Beta only. Progressive enhancement of existing live resource controls. */
(()=>{'use strict';
const descriptions={
 hospitals:'Hospitals and emergency rooms; availability is not live.',
 military:'Restricted facilities; not public shelters.',
 water:'Mapped freshwater; never assume water is safe to drink.',
 ramps:'Mapped boat launches; verify public access.',
 airports:'Airfields; access is not guaranteed.',
 rangers:'Forest offices; hours and staffing may vary.'
};
const symbols={hospitals:'🏥',military:'🛡️',water:'💧',ramps:'🚤',airports:'✈️',rangers:'🌲'};
function init(){
 const menu=document.getElementById('mapResourceMenu');
 if(!menu||!menu.classList.contains('ld47PremiumResources'))return false;
 if(menu.dataset.ld48Ready==='yes')return true;
 const section=menu.querySelector('.section:has(#hospitals)');
 if(!section||!section.querySelector('#scClearAllLayers'))return false;
 menu.dataset.ld48Ready='yes';menu.classList.add('ld48Resources');
 const heading=menu.querySelector('.ld47ResourcesHeading');
 if(heading){
  const strong=heading.querySelector('strong'),small=heading.querySelector('small');
  if(strong)strong.textContent='Resource Layers';
  if(small)small.textContent='Helpful places for travel, planning and emergencies';
  const emblem=document.createElement('span');emblem.className='ld48Emblem';emblem.textContent='◈';emblem.setAttribute('aria-hidden','true');heading.prepend(emblem);
 }
 const tabs=document.createElement('div');tabs.className='ld48Tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Resource filters');
 const filters=[['all','✓ All Resources'],['selected','✓ Selected'],['offline','↓ Offline Info']];
 let current='all';
 const intro=document.createElement('div');intro.className='ld48Intro';intro.innerHTML='<strong>Select Layers by Category</strong>';
 const search=document.createElement('input');search.type='search';search.placeholder='Search resources…';search.setAttribute('aria-label','Search resource categories');search.className='ld48Search';intro.append(search);
 const rows=[...section.querySelectorAll('label.check')].filter(l=>l.querySelector('input[type="checkbox"]'));
 const rowContainer=document.createElement('div');rowContainer.className='ld48Rows';
 for(const label of rows){
  const input=label.querySelector('input[type="checkbox"]'),id=input.id;
  const text=label.textContent.replace(/^\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\uFE0F\u200D]+\s*/u,'').trim();
  label.classList.add('ld48Row');label.textContent='';label.append(input);
  const ico=document.createElement('span');ico.className='ld48RowIcon';ico.textContent=symbols[id]||'📍';ico.setAttribute('aria-hidden','true');
  const copy=document.createElement('span');copy.className='ld48RowCopy';
  const title=document.createElement('strong');title.textContent=text;
  const subtitle=document.createElement('small');subtitle.textContent=descriptions[id]||'Locally saved resource information.';
  copy.append(title,subtitle);label.append(ico,copy);
  const check=document.createElement('span');check.className='ld48Check';check.textContent='✓';check.setAttribute('aria-hidden','true');label.append(check);
  rowContainer.append(label);
 }
 const footer=document.createElement('div');footer.className='ld48Footer';
 const clear=section.querySelector('#scClearAllLayers');clear.classList.add('ld48Clear');clear.textContent='Clear All';
 const apply=document.createElement('button');apply.type='button';apply.className='ld48Apply';apply.textContent='✓ Apply Layers';
 apply.addEventListener('click',()=>{document.getElementById('mapResourceButton')?.click()});
 footer.append(clear,apply);
 // Preserve the original live checkbox nodes and their event listeners.
 section.prepend(tabs,intro,rowContainer);section.append(footer);
 const note=document.createElement('p');note.className='ld48Caution';note.textContent='Map resources are not live emergency alerts. Offline access requires previously downloaded data.';section.append(note);
 const info=document.createElement('p');info.className='ld48OfflineInfo';info.hidden=true;info.textContent='Offline readiness depends on saved state resource packs. Check Offline Readiness to download or verify your data.';section.insertBefore(info,rowContainer);
 const offlineButton=document.createElement('button');offlineButton.type='button';offlineButton.className='ld48OfflineAction';offlineButton.textContent='Open Offline Readiness';offlineButton.hidden=true;
 offlineButton.addEventListener('click',()=>{document.getElementById('mapResourceButton')?.click();document.getElementById('tab-offline')?.click()});section.insertBefore(offlineButton,rowContainer);
 const render=()=>{
  const query=search.value.trim().toLocaleLowerCase();
  for(const label of rows){const input=label.querySelector('input');label.hidden=(current==='selected'&&!input.checked)||(current==='offline')||!label.textContent.toLocaleLowerCase().includes(query);label.classList.toggle('ld47SelectedResource',input.checked)}
  info.hidden=current!=='offline';offlineButton.hidden=current!=='offline';intro.hidden=current==='offline';rowContainer.hidden=current==='offline';
  for(const b of tabs.querySelectorAll('button'))b.setAttribute('aria-pressed',String(b.dataset.filter===current));
 };
 for(const [key,name] of filters){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.filter=key;b.setAttribute('aria-pressed',String(key===current));b.addEventListener('click',()=>{current=key;render()});tabs.append(b)}
 search.addEventListener('input',render);menu.addEventListener('change',render);clear.addEventListener('click',()=>requestAnimationFrame(render));render();
 return true;
}
if(!init()){let tries=0;const timer=setInterval(()=>{if(init()||++tries>120)clearInterval(timer)},100)}
})();