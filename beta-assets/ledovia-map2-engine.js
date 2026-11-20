/* Ledovia Maps 2.0 Beta migration candidate.
 * Not activated by the current Beta deployment workflow.
 * Integration gate: preserve existing location, hazard, resource and routing APIs.
 * Online imagery only. Do not cache SC HD aerial tiles without license review.
 */
(function(global){
 'use strict';
 const BASE='https://basemap.nationalmap.gov/arcgis/rest/services/';
 const HD='https://tiles.arcgis.com/tiles/RvqSyw3diI7dTKo5/arcgis/rest/services/SC_2023_RGB/MapServer/tile/{z}/{y}/{x}';
 const MODES={
   topo:{tiles:[BASE+'USGSTopo/MapServer/tile/{z}/{y}/{x}'],maxzoom:16},
   satellite:{tiles:[BASE+'USGSImageryOnly/MapServer/tile/{z}/{y}/{x}'],maxzoom:16},
   hd:{tiles:[HD],maxzoom:20},
   relief:{tiles:[BASE+'USGSShadedReliefOnly/MapServer/tile/{z}/{y}/{x}'],maxzoom:16}
 };
 function create(options){
   if(!global.maplibregl||!global.pmtiles||!global.basemaps)throw Error('MapLibre, PMTiles and basemaps required');
   const protocol=new global.pmtiles.Protocol();
   global.maplibregl.addProtocol('pmtiles',protocol.tile);
   const map=new global.maplibregl.Map({
     container:options.container,
     center:options.center||[-79.77,34.22],
     zoom:options.zoom==null?9:options.zoom,
     minZoom:3,maxZoom:20,
     attributionControl:false,
     style:{version:8,glyphs:'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
       sprite:'https://protomaps.github.io/basemaps-assets/sprites/v4/light',
       sources:{basemap:{type:'vector',url:'pmtiles://https://tiles.jasontally.com/basemap.pmtiles',attribution:'© OpenStreetMap contributors'}},
       layers:global.basemaps.layers('basemap',global.basemaps.namedFlavor('light'),{lang:'en'})}
   });
   const active={topo:false,satellite:false,hd:false,relief:false};
   function ensure(mode){
     const id='ld2-'+mode;
     if(map.getSource(id))return;
     map.addSource(id,Object.assign({type:'raster',tileSize:256},MODES[mode]));
     const labels=map.getStyle().layers.find(x=>x.type==='symbol');
     map.addLayer({id,source:id,type:'raster',layout:{visibility:'none'},
       paint:{'raster-opacity':mode==='relief'?0.42:1}},labels&&labels.id);
   }
   function sync(){
     for(const mode of Object.keys(active)){
       const id='ld2-'+mode;
       if(map.getLayer(id))map.setLayoutProperty(id,'visibility',active[mode]?'visible':'none');
     }
     if(active.relief&&map.getLayer('ld2-relief')){
       const labels=map.getStyle().layers.find(x=>x.type==='symbol');
       if(labels)map.moveLayer('ld2-relief',labels.id);
     }
   }
   function setMode(mode){
     if(!['standard','topo','satellite','hd'].includes(mode))throw Error('Unknown base map mode');
     if(!map.getSource('ld2-topo'))return false;
     for(const key of ['topo','satellite','hd'])active[key]=key===mode;
     sync();
     return true;
   }
   function setRelief(on){
     if(!map.getSource('ld2-relief'))return false;
     ensure('relief');active.relief=!!on;sync();return true;
   }
   map.on('load',()=>{Object.keys(MODES).forEach(ensure);if(typeof options.onReady==='function')options.onReady(map)});
   return {map,setMode,setRelief,getState:()=>({...active}),destroy:()=>{map.remove();global.maplibregl.removeProtocol('pmtiles')}};
 }
 global.LedoviaMap2={create};
})(window);
