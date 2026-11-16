#!/usr/bin/env python3
"""Build a versioned Silent Compass state resource pack from a Geofabrik OSM PBF extract.
Requires: pip install osmium
Usage: python tools/build-state-resource-pack.py SC south-carolina-latest.osm.pbf state-packs/SC.json
Source data must be obtained and license-checked separately (OpenStreetMap ODbL).
"""
import argparse, datetime, json, pathlib
import osmium

def classify(t):
    if ((t.get("tourism")=="information" and t.get("information")=="ranger_station")
        or t.get("amenity")=="ranger_station" or t.get("office")=="forestry"
        or (t.get("office")=="government" and any(x in t.get("name","").lower() for x in ("ranger","forest service","forestry")))): return "rangers"
    if t.get("amenity")=="hospital" or t.get("healthcare")=="hospital" or t.get("emergency")=="emergency_ward": return "hospitals"
    if t.get("landuse")=="military" or t.get("military") in ("base","barracks","airfield","naval_base"): return "military"
    if t.get("aeroway") in ("aerodrome","airstrip"): return "airports"
    if t.get("leisure")=="slipway" or t.get("waterway")=="boat_launch": return "ramps"
    if (t.get("waterway")=="river" or t.get("natural")=="water") and t.get("name"): return "water"
    return None

class Extract(osmium.SimpleHandler):
    def __init__(self):
        super().__init__(); self.features={}; self.counts={}
    def add(self, obj, location):
        tags={k:v for k,v in obj.tags}; kind=classify(tags)
        if not kind or not location or not location.valid(): return
        lat,lon=round(location.lat,6),round(location.lon,6)
        if not (-90<=lat<=90 and -180<=lon<=180): return
        key=f"{obj.type_str()}:{obj.id}"
        self.features[key]={"type":kind,"name":tags.get("name") or kind.replace("_"," ").title(),"lat":lat,"lon":lon,
            "detail":" · ".join(filter(None,[tags.get("addr:street"),tags.get("addr:city"),tags.get("phone") or tags.get("contact:phone"),tags.get("website") or tags.get("contact:website")]))[:220],
            "source":"OpenStreetMap","osmId":key}
    def node(self,n):
        if n.location.valid(): self.add(n,n.location)
    def area(self,a):
        # Area geometries need a separate centroid calculation; intentionally omitted.
        pass
    def way(self,w):
        # Approximate representative position for mapped lines and polygons.
        # Not a verified entrance or access point.
        pts=[n.location for n in w.nodes if n.location.valid()]
        if not pts or len(pts)!=len(w.nodes): return
        class Position:
            def valid(self): return True
        pos=Position()
        pos.lat=sum(p.lat for p in pts)/len(pts)
        pos.lon=sum(p.lon for p in pts)/len(pts)
        self.add(w,pos)

def main():
    p=argparse.ArgumentParser();p.add_argument("state");p.add_argument("pbf");p.add_argument("output");a=p.parse_args()
    if len(a.state)!=2 or not a.state.isalpha(): p.error("Use two-letter state abbreviation")
    h=Extract();h.apply_file(a.pbf,locations=True)
    items=list(h.features.values());counts={}
    for f in items: counts[f["type"]]=counts.get(f["type"],0)+1
    out={"schema":1,"state":a.state.upper(),"generatedAt":datetime.datetime.now(datetime.timezone.utc).isoformat(),
         "source":"OpenStreetMap contributors","license":"ODbL-1.0","coverageNote":"Nodes and ways included; relations not included. Way markers are approximate, not entrances. Not a complete statewide inventory.",
         "counts":counts,"features":items}
    path=pathlib.Path(a.output);path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(out,separators=(",",":"),ensure_ascii=False),encoding="utf-8")
    print(f"Wrote {len(items)} node features to {path}. INCOMPLETE: relations excluded; way positions approximate.")

if __name__=="__main__": main()
