const CACHE='griddown-shell-v95-beta-0-8-3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon.svg','./offline-engine.js','./package-manager.js','./survival-hub.js','./hazard-safety.js','./circle-media.js','./zones-presets.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('griddown-shell-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 // App shell files: fetch current versions when online; keep cached copies for offline use.
 const shellFile=SHELL.some(path=>new URL(path,self.registration.scope).pathname===url.pathname);
 if(event.request.mode==='navigate'||shellFile){
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{
   if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request.mode==='navigate'?'./index.html':event.request,copy)));}
   return response;
  }).catch(async()=>await caches.match(event.request)||await caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)))}return response})));
});