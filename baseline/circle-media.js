/* Silent Compass: local photo evidence and Account & Sync workspace.
   Photos stay on this device; circle cloud sync is not configured. */
(()=>{'use strict';
const account=document.getElementById('panel-account');
if(account){
 const section=document.createElement('div');section.className='section';
 section.innerHTML='<strong>👥 Account & Sync</strong><p>Family circle sharing is not connected yet. Photos and reports are stored only in this browser until a secure, authenticated sync service is configured.</p><p id="circleSyncStatus" role="status">Sync status: Local only · Not connected</p><p class="muted">Do not rely on this device for family-wide emergency alerts. Export backups separately and keep sensitive cache locations private.</p>';
 account.append(section);
}
const DB='silent-compass-photos-v1';let database;
function open(){if(database)return Promise.resolve(database);return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('photos',{keyPath:'id'});r.onsuccess=()=>{database=r.result;resolve(database)};r.onerror=()=>reject(r.error)})}
async function entries(kind,id){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('photos').objectStore('photos').getAll();r.onsuccess=()=>resolve(r.result.filter(p=>p.kind===kind&&p.parentId===id).sort((a,b)=>b.created.localeCompare(a.created)));r.onerror=()=>reject(r.error)})}
async function save(item){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('photos','readwrite').objectStore('photos').put(item);r.onsuccess=resolve;r.onerror=()=>reject(r.error)})}
async function remove(id){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('photos','readwrite').objectStore('photos').delete(id);r.onsuccess=resolve;r.onerror=()=>reject(r.error)})}
async function attachFile(kind,parentId,file,note=''){
 if(!file||!file.type.startsWith('image/'))throw Error('Choose a valid image.');
 if(file.size>8000000)throw Error('Maximum photo size is 8 MB.');
 const bitmap=await createImageBitmap(file);
 try{const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',0.8));if(!blob)throw Error('Image conversion failed');await save({id:crypto.randomUUID(),kind,parentId,created:new Date().toISOString(),note:String(note).slice(0,500),blob})}finally{bitmap.close?.()}
}
const dialog=document.createElement('dialog');dialog.style.cssText='max-width:min(94vw,520px);max-height:85vh;overflow:auto;background:#172428;color:#eef5ef;border:1px solid #638378;border-radius:12px;padding:18px';dialog.innerHTML='<h3 id="scPhotoTitle">Location photos</h3><p class="muted">Private on this device. Photos are not shared with your circle.</p><label for="scPhotoFile">Add photo</label><input id="scPhotoFile" type="file" accept="image/*" capture="environment"><label for="scPhotoNote">Observation / landmark notes</label><textarea id="scPhotoNote" maxlength="500" rows="2"></textarea><button id="scPhotoAdd" type="button">Save photo offline</button><p id="scPhotoMessage" role="status"></p><div id="scPhotoList"></div><button id="scPhotoClose" type="button">Close</button>';document.body.append(dialog);
let current=null;const $=id=>document.getElementById(id);
async function draw(){const root=$('scPhotoList');root.replaceChildren();for(const p of await entries(current.kind,current.id)){const card=document.createElement('div');card.style.cssText='padding:10px 0;border-bottom:1px solid #50645d';const img=document.createElement('img');const url=URL.createObjectURL(p.blob);img.src=url;img.alt='Saved observation';img.style.cssText='max-width:100%;max-height:220px;object-fit:contain';img.onload=()=>URL.revokeObjectURL(url);const caption=document.createElement('p');caption.textContent=new Date(p.created).toLocaleString()+' · '+(p.note||'No notes');const del=document.createElement('button');del.textContent='Remove photo';del.onclick=async()=>{if(confirm('Remove this photo from this device?')){await remove(p.id);draw()}};card.append(img,caption,del);root.append(card)}}
$('scPhotoClose').onclick=()=>dialog.close();
$('scPhotoAdd').onclick=async()=>{const file=$('scPhotoFile').files?.[0];if(!file)return $('scPhotoMessage').textContent='Choose an image first.';if(!file.type.startsWith('image/'))return $('scPhotoMessage').textContent='Only images are supported.';if(file.size>8000000)return $('scPhotoMessage').textContent='Maximum photo size is 8 MB.';try{await attachFile(current.kind,current.id,file,$('scPhotoNote').value.trim());$('scPhotoFile').value='';$('scPhotoNote').value='';$('scPhotoMessage').textContent='Photo saved locally for offline viewing.';draw()}catch(e){$('scPhotoMessage').textContent='Unable to save: '+e.message}};
window.SilentCompassPhotos={attachFile,open:async(kind,id,name)=>{current={kind,id};$('scPhotoTitle').textContent='📷 '+name;dialog.showModal();try{await draw()}catch(e){$('scPhotoMessage').textContent='Photo storage unavailable: '+e.message}}};
})();
