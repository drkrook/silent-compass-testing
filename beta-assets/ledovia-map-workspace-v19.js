/* Beta v0.8.19: desktop map workspace only. Reuse existing map controls and layers. */
(()=>{'use strict';
function init(){
 const app=document.getElementById('appMain'),side=document.getElementById('sidePanel'),map=document.getElementById('mapwrap');
 const select=document.getElementById('basemapStyle'),resource=document.getElementById('mapResourceMenu');
 if(!app||!side||!map||!select||!resource||!document.getElementById('scMapTools'))return false;
 if(document.getElementById('ld19MapStyles'))return true;
 const bar=document.createElement('div');bar.id='ld19MapStyles';bar.setAttribute('role','group');bar.setAttribute('aria-label','Map appearance');
 let selected='topo';const opts=[['map','Map'],['satellite','Satellite'],['topo','Topo']];
 for(const [id,label] of opts){const b=document.createElement('button');b.type='button';b.dataset.style=id;b.textContent=label;
 b.title=id==='map'?'Standard topographic map (street basemap not yet available)':id==='topo'?'USGS topographic map':'USGS satellite imagery';
 b.addEventListener('click',()=>{select.value=id==='satellite'?'satellite':'topo';selected=id;select.dispatchEvent(new Event('change',{bubbles:true}));update()});bar.appendChild(b)}
 const full=document.createElement('button');full.type='button';full.id='ld19Full';full.title='Toggle fullscreen map';full.setAttribute('aria-label','Toggle fullscreen map');full.textContent='⛶';
 full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await map.requestFullscreen()}catch(e){full.title='Fullscreen unavailable in this browser'}};
 bar.appendChild(full);map.prepend(bar);
 const box=document.createElement('section');box.id='ld19Layers';const heading=document.createElement('h2');heading.textContent='Map Layers';box.appendChild(heading);side.appendChild(box);
 const oldParent=resource.parentElement;
 const oldNext=resource.nextSibling;
 const tools=document.getElementById('scMapTools');tools.textContent='Advanced Tools';
 function update(){for(const b of bar.querySelectorAll('[data-style]')){const active=b.dataset.style===selected;b.setAttribute('aria-pressed',String(active));}}
 function sync(){
 const desktop=matchMedia('(min-width:1100px)').matches;
 app.classList.toggle('ld19DesktopMap',desktop&&app.classList.contains('scMapSimple'));
 if(desktop&&document.fullscreenElement===map){update();return;} if(desktop){if(resource.parentElement!==box)box.appendChild(resource);resource.hidden=false}
 else if(resource.parentElement===box){oldParent.insertBefore(resource,oldNext);resource.hidden=true}
 update();
 }
 const mo=new MutationObserver(()=>{if(matchMedia('(min-width:1100px)').matches&&resource.parentElement===box&&resource.hidden)resource.hidden=false});
 mo.observe(resource,{attributes:true,attributeFilter:['hidden']});
 select.addEventListener('change',update);
 window.addEventListener('resize',sync);
 document.addEventListener('click',()=>setTimeout(sync,0),true);
 const classes=new MutationObserver(sync);classes.observe(app,{attributes:true,attributeFilter:['class']});
 sync();return true;
}
if(!init()){let n=0;const t=setInterval(()=>{if(init()||++n>120)clearInterval(t)},100)}
})();