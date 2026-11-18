/* LEDOVIA Beta v0.8.503 — My Locations edit + existing-photo upload fixes.\n   Release notes: Correct Edit button target and open existing editor; expose gallery/file upload in existing-location Photos dialog. Preserve local data and original save handlers. */
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
  const nav=document.createElement('button');nav.type='button';nav.textContent='➤ Navigate';nav.onclick=()=>{go.click();const target=$('#selectedLocationPanel');const button=[...document.querySelectorAll('#selected button')].find(b=>/destination/i.test(b.textContent));if(button)button.click();else document.getElementById('scPlacesMap')?.click();};
  const edit=document.createElement('button');edit.type='button';edit.textContent='✎ Edit';edit.onclick=()=>{go.click();const button=[...document.querySelectorAll('#selected button')].find(b=>/^Edit$/i.test(b.textContent.trim()));if(button){button.click();const editor=document.getElementById('scPlaceEditor');if(editor){editor.open=true;editor.scrollIntoView({behavior:'smooth',block:'start'});}}};
  const coords=document.createElement('button');coords.type='button';coords.textContent='▢ Copy Coords';coords.onclick=()=>{go.click();const button=[...document.querySelectorAll('#selected button')].find(b=>/Copy coordinates/i.test(b.textContent));button?.click();};
  actions.append(nav,edit,coords);
  const photo=row.querySelector('button[title="Location photos"]');if(photo){photo.textContent='▧ Photos';actions.append(photo);}
  const del=row.querySelector('button[title="Delete this location"]');if(del){del.textContent='Delete';del.classList.add('ld50Delete');actions.append(del);}
  // Beta v0.8.507: approved expanded card — real offline photo and place metadata.
  const info=document.createElement('div');info.className='ld50PlaceInfo';
  const image=document.createElement('img');image.className='ld50PlacePhoto';image.alt='Saved location photo';image.hidden=true;
  const meta=document.createElement('div');meta.className='ld50PlaceMeta';
  info.append(image,meta);detail.append(info);
  async function refreshCard(){
    const places=window.ledoviaGetPrivatePlaces?.()||[];
    const place=places.find(p=>p.name===name&&(!address||p.address===address))||places.find(p=>p.name===name);
    if(!place)return;
    const rows=[];
    if(place.address?.trim())rows.push('⌖ Address: '+place.address.trim());else if(Number.isFinite(Number(place.lat))&&Number.isFinite(Number(place.lon)))rows.push('⌖ Coordinates: '+Number(place.lat).toFixed(6)+', '+Number(place.lon).toFixed(6));
    rows.push('▤ Notes: '+(place.notes||'No notes'));
    let photos=[];
    try{photos=await window.SilentCompassPhotos?.list?.('location',place.id)||[]}catch(e){console.warn('Location photo preview unavailable',e)}
    rows.push('▧ Photos: '+photos.length);
    meta.replaceChildren(...rows.map(line=>{const p=document.createElement('p');p.textContent=line;return p}));
    if(image.dataset.ldObjectUrl){URL.revokeObjectURL(image.dataset.ldObjectUrl);delete image.dataset.ldObjectUrl}
    image.hidden=!photos.length;
    if(photos.length){const url=URL.createObjectURL(photos[0].blob);image.dataset.ldObjectUrl=url;image.src=url;}
  }
  row.addEventListener('click',e=>{if(e.target===photo)setTimeout(refreshCard,500)});
  detail.append(actions);
  toggle.onclick=()=>{
   const wasOpen=!detail.hidden;
   list.querySelectorAll('.ld50Details').forEach(d=>d.hidden=true);
   list.querySelectorAll('.ld50Toggle').forEach(b=>b.setAttribute('aria-expanded','false'));
   if(!wasOpen){detail.hidden=false;toggle.setAttribute('aria-expanded','true');go.click();active=name;refreshCard();}
   else active=null;
  };
  go.hidden=true;row.prepend(toggle);row.append(detail);
  if(active===name){detail.hidden=false;toggle.setAttribute('aria-expanded','true');refreshCard();}
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

/* v50.4: make the existing-location Photos dialog support gallery uploads.
   The existing photo save button and offline storage handlers are unchanged. */
(()=>{'use strict';
function enhanceLocationPhotoDialog(){
 const inputs=[...document.querySelectorAll('input[type="file"]')];
 for(const input of inputs){
  if(input.id==='privatePhoto'||input.dataset.ldExistingPhotoUpload)continue;
  if(input.id!=='scPhotoFile')continue;
  const panel=input.closest('dialog');
  if(!panel||!/Save photo offline/i.test(panel.textContent||''))continue;
  input.dataset.ldExistingPhotoUpload='1';
  input.removeAttribute('capture');
  input.setAttribute('accept','image/*');
  const label=document.createElement('label');
  label.className='ld50ExistingPhotoLabel';
  label.textContent='Upload Existing Photo (Gallery / Files)';
  label.style.cssText='display:block;margin:10px 0 7px;color:#b8fff0;font-weight:700;font-size:15px';
  input.insertAdjacentElement('beforebegin',label);
  const note=document.createElement('small');
  note.textContent='Choose a photo already saved on your device, then tap Save photo offline.';
  note.className='ld50ExistingPhotoNote';
  note.style.cssText='display:block;margin:7px 0 14px;color:#bed7d5;line-height:1.4';
  input.insertAdjacentElement('afterend',note);
 }
}
enhanceLocationPhotoDialog();
const observer=new MutationObserver(()=>enhanceLocationPhotoDialog());
observer.observe(document.documentElement,{subtree:true,childList:true});
})();

/* BETA v0.8.509 — explicit cancel/collapse for Add New Location and Edit Location. */
(()=>{'use strict';
function setup(){
 const editor=document.getElementById('scPlaceEditor');
 if(!editor||editor.dataset.ldCollapseReady)return !!editor;
 editor.dataset.ldCollapseReady='1';
 const close=document.createElement('button');
 close.type='button';close.className='ld50CollapseEditor';
 close.textContent='✕ Cancel / Close';
 close.setAttribute('aria-label','Close location form without saving');
 close.addEventListener('click',()=>{
   editor.open=false;
   editor.removeAttribute('open');
   editor.querySelector('summary')?.focus({preventScroll:true});
 });
 editor.append(close);
 return true;
}
if(!setup()){
 const watcher=new MutationObserver(()=>{if(setup())watcher.disconnect()});
 watcher.observe(document.documentElement,{subtree:true,childList:true});
}
})();

/* BETA v0.8.510 — compact header only on My Locations; map/home unaffected. */
(()=>{'use strict';
 const main=document.getElementById('appMain');
 if(!main)return;
 const sync=()=>document.body.classList.toggle('ld510CompactPlacesHeader',main.classList.contains('scPlacesSimple'));
 sync();
 new MutationObserver(sync).observe(main,{attributes:true,attributeFilter:['class']});
})();
