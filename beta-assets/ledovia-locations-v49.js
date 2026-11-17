/* LEDOVIA Beta v49: simplify My Locations without replacing stored data or event handlers. */
(()=>{'use strict';
function apply(){
 const app=document.getElementById('appMain'),dash=document.querySelector('#privatePlacesPanel .scPlacesDashboard');
 const saved=document.getElementById('scSavedPlacesDetails'),marks=document.getElementById('scBookmarkDetails');
 const backup=document.querySelector('#privatePlacesPanel .scPlacesBackup');
 const nav=document.getElementById('scSimplePlacesNav');
 if(!app||!dash||!saved||!marks||!backup||!nav)return false;
 let group=document.getElementById('ld49YourLocations');
 if(!group){
  group=document.createElement('section');group.id='ld49YourLocations';
  group.setAttribute('aria-label','Your Locations');
  const heading=document.createElement('h3');heading.textContent='Your Locations';
  const help=document.createElement('p');help.textContent='Select a saved place to view, edit, or navigate. Bookmarked map markers are below.';
  group.append(heading,help);
  dash.append(group);
 }
 if(saved.parentElement!==group)group.append(saved);
 if(marks.parentElement!==group)group.append(marks);
 saved.open=true;
 saved.querySelector(':scope > summary')?.setAttribute('aria-label','Saved locations list');
 const summary=saved.querySelector(':scope > summary');
 if(summary)summary.textContent='Saved places';
 const bookmarkSummary=marks.querySelector(':scope > summary');
 if(bookmarkSummary)bookmarkSummary.textContent='Bookmarked map markers';
 let tools=document.getElementById('ld49BackupTools');
 if(!tools){
  tools=document.createElement('section');tools.id='ld49BackupTools';
  tools.setAttribute('aria-label','Data and backups');
  const h=document.createElement('h3');h.textContent='Data & Backups';
  const note=document.createElement('p');note.textContent='Export a private backup or restore locations from a backup file.';
  tools.append(h,note);
  nav.insertAdjacentElement('afterend',tools);
 }
 if(backup.parentElement!==tools)tools.append(backup);
 return true;
}
let count=0;const timer=setInterval(()=>{if(apply()||++count>100)clearInterval(timer)},150);
document.addEventListener('DOMContentLoaded',apply);
})();
