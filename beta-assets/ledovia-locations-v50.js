/* LEDOVIA Beta v50: approved premium My Locations cards; original data handlers retained. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
let active=null;
function upgrade(){
 const list=$('#privateList'),group=$('#ld49YourLocations'),marks=$('#scBookmarkDetails');
 if(!list||!group)return;
 const rows=[...list.children].filter(x=>x.classList.contains('savedItem'));
 const heading=list.querySelector(':scope > strong');
 if(heading){heading.classList.add('ld50Count');heading.textContent=rows.length+' saved';}
 rows.forEach((row,i)=>{
  if(row.classList.contains('ld50Card'))return;
  const go=row.querySelector('.placeName');if(!go)return;
  const original=go.textContent.trim(),match=original.match(/^(\S+)\s+(.+)$/u);
  const emoji=match?match[1]:'📍',rest=match?match[2]:original;
  const parts=rest.split(' · '),name=parts.shift(),address=parts.join(' · ');
  row.classList.add('ld50Card');row.dataset.locationName=name;
  const toggle=document.createElement('button');toggle.type='button';toggle.className='ld50Toggle';toggle.setAttribute('aria-expanded','false');
  const ico=document.createElement('span');ico.className='ld50Icon';ico.textContent=emoji;
  const copy=document.createElement('span');copy.className='ld50Name';
  const title=document.createElement('strong');title.textContent=name;const sub=document.createElement('small');sub.textContent=address||'Saved offline location';copy.append(title,sub);
  const chevron=document.createElement('span');chevron.className='ld50Chevron';chevron.textContent='⌄';
  toggle.append(ico,copy,chevron);
  const detail=document.createElement('div');detail.className='ld50Details';detail.hidden=true;
  const actions=document.createElement('div');actions.className='ld50Actions';
  const nav=document.createElement('button');nav.type='button';nav.textContent='➤ Navigate';nav.onclick=()=>{go.click();const target=$('#selectedLocationPanel');const button=[...document.querySelectorAll('#selectedLocationPanel button')].find(b=>/destination/i.test(b.textContent));if(button)button.click();else document.getElementById('scPlacesMap')?.click();};
  const edit=document.createElement('button');edit.type='button';edit.textContent='✎ Edit';edit.onclick=()=>{go.click();const button=[...document.querySelectorAll('#selectedLocationPanel button')].find(b=>/^Edit$/i.test(b.textContent.trim()));button?.click();};
  const coords=document.createElement('button');coords.type='button';coords.textContent='▢ Copy Coords';coords.onclick=()=>{go.click();const button=[...document.querySelectorAll('#selectedLocationPanel button')].find(b=>/Copy coordinates/i.test(b.textContent));button?.click();};
  actions.append(nav,edit,coords);
  const photo=row.querySelector('button[title="Location photos"]');if(photo){photo.textContent='▧ Photos';actions.append(photo);}
  const del=row.querySelector('button[title="Delete this location"]');if(del){del.textContent='Delete';del.classList.add('ld50Delete');actions.append(del);}
  detail.append(actions);
  toggle.onclick=()=>{
   const wasOpen=!detail.hidden;
   list.querySelectorAll('.ld50Details').forEach(d=>d.hidden=true);
   list.querySelectorAll('.ld50Toggle').forEach(b=>b.setAttribute('aria-expanded','false'));
   if(!wasOpen){detail.hidden=false;toggle.setAttribute('aria-expanded','true');go.click();active=name;}
   else active=null;
  };
  go.hidden=true;row.prepend(toggle);row.append(detail);
  if(active===name){detail.hidden=false;toggle.setAttribute('aria-expanded','true');}
 });
 if(marks){const list=marks.querySelector('#scBookmarkList');const count=list?.querySelectorAll('.savedItem').length||0;marks.hidden=count===0;}
}
function init(){
 const list=$('#privateList'),group=$('#ld49YourLocations');
 if(!list||!group)return false;
 group.classList.add('ld50Premium');
 const h=group.querySelector(':scope > h3');if(h)h.textContent='✧ Your Locations';
 const p=group.querySelector(':scope > p');if(p)p.textContent='Your important places, saved and ready when you need them.';
 const intro=$('#privatePlacesPanel .scPlacesIntro');if(intro)intro.textContent='Your important places, saved and ready when you need them.';
 upgrade();
 const observer=new MutationObserver(()=>requestAnimationFrame(upgrade));
 observer.observe(list,{childList:true});
 return true;
}
let n=0;const timer=setInterval(()=>{if(init()||++n>100)clearInterval(timer)},150);
})();

/* v50.3: explicit gallery upload for Add/Edit Location, retaining native file-save handling. */
(()=>{'use strict';
function enhancePhoto(){
 const input=document.getElementById('privatePhoto');
 if(!input||input.dataset.ldGalleryReady)return false;
 input.dataset.ldGalleryReady='1';
 input.removeAttribute('capture');
 const row=document.createElement('div');row.className='ld50PhotoChoice';
 const choose=document.createElement('button');choose.type='button';
 choose.textContent='▧ Upload Photo from Device';
 choose.setAttribute('aria-label','Choose an existing photo from your device');
 const note=document.createElement('small');note.textContent='Choose a saved image from Photos or Files. Photo stays on this device.';
 choose.addEventListener('click',()=>input.click());
 row.append(choose,note);
 input.insertAdjacentElement('beforebegin',row);
 return true;
}
if(!enhancePhoto()){
 const observer=new MutationObserver(()=>{if(enhancePhoto())observer.disconnect()});
 observer.observe(document.documentElement,{childList:true,subtree:true});
}
})();
