# GridDown Atlas v0.2 — installable offline-first web application

## What is included

- A Progressive Web App (PWA) shell: `index.html`, `manifest.webmanifest`, `sw.js`, and `icon.svg`.
- A dropdown with all 50 U.S. states and geographic center presets.
- A real USGS USGSTopo raster map viewer with pan, zoom and GPS location.
- Browser IndexedDB storage for downloaded map tiles and resource points.
- Resource layers: hospitals (OSM hospital-tagged facilities, **not a verified ER list**), named water features (not potable water), and boat launches (SCDNR public water access in SC, OSM slipways elsewhere).
- Map-tile downloading for the current viewport at selected zoom levels, up to 1,800 tiles per batch, with progress, stop and clear controls.
- Resource GeoJSON import/export, and storage estimate / persistence request.
- Service worker caching of the application shell for offline reloading.

## Installation / run

**Important: Opening `index.html` from a ZIP or using `file://` is NOT a reliable installable PWA.** A service worker requires HTTPS or localhost.

For a computer with Python installed:

```bash
cd griddown_atlas
python -m http.server 8000
```

Visit `http://localhost:8000` in Chrome/Edge. The install button may appear once the browser considers the app installable; alternatively use the browser menu's **Install app** option. On phones/tablets, deploy the contents of this folder to an HTTPS static host (for example GitHub Pages or Netlify), open that URL and use **Add to Home Screen / Install**. The ZIP alone cannot install a PWA on a phone. You can host the files yourself; the app does not require a proprietary backend.

## Preparing an area for offline use

1. Open the app online and choose a state from the dropdown.
2. Zoom into the county or region of interest. For an offline field test, start with Florence/Darlington, SC.
3. Choose a practical zoom range (for example 8–10), click **Download map area**, and wait for completion. Repeat at other views/zoom ranges to cover a route. Statewide high-zoom coverage is not included, and may require huge storage.
4. At a reasonably close zoom (bounding-box area <= 9 square degrees), click **Download / refresh resource data**. SC also requests statewide SCDNR public water-access points. Remote APIs may rate-limit or fail; inspect the on-screen result and retry later if necessary.
5. Reload once while connected so the PWA shell caches. Then switch to airplane mode and reload. Check map coverage and resource points **before relying on the app**.
6. Export GeoJSON for a backup of saved points. Browser storage may be evicted, especially when storage is low or site data is cleared.

## Scope and caveats

- **No prebundled statewide maps or resource datasets.** The ZIP contains working code, not a ready-to-use offline South Carolina map. You must pre-download geographic coverage while online.
- **Not all 50 states are preloaded.** The state selector is functional; downloading USGS tiles works nationwide and OSM resource fetching is based on the currently visible map. SCDNR's enhanced water-access dataset is specific to SC.
- **Topographic raster imagery is not offline route navigation.** No turn-by-turn directions, offline routing, current bridge status, road closures or shelter activations.
- Hospitals are crowdsourced OSM points and should not be assumed to offer 24/7 ER care. Water features are not verified potable water. Boat ramps may be private, seasonal, blocked or closed.
- USGS/OSM/SCDNR APIs require an internet connection for new downloads, may change or restrict bulk requests, and may block CORS. Failed downloads are reported; previously saved tiles remain available.
- Browser storage is per origin and per browser/device. A download on one device does not automatically transfer to another.
- This build was syntax-checked but not field-tested on mobile devices or against live data APIs. It should not be a sole emergency navigation tool. Carry paper maps and confirm emergency locations through official agencies.

## Sources and attribution

- USGS The National Map USGSTopo: https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer
- OpenStreetMap contributors: https://www.openstreetmap.org/copyright
- South Carolina DNR public water access: https://services.arcgis.com/acgZYxoN5Oj8pDLa/ArcGIS/rest/services/South_Carolina_Public_Water_Access_PUBLIC_VIEW/FeatureServer/0

## v0.3 terrain upgrade
- Enable **Shaded relief** to overlay USGS relief tiles over USGS topo maps; adjust relief strength.
- **Download map area** now stores both the topo and relief layers (if relief is enabled). This increases offline download size.
- **Check center elevation** queries the USGS Elevation Point Query Service while online and saves that specific coordinate reading for offline retrieval. Elevation values are approximate, not continuously available across the map offline.
- At low zoom, contour lines may not be visible; zoom in to see the contour detail supported by the USGS topo service.
- Live service availability and cross-origin access were not validated in this environment; verify online downloads and airplane-mode operation on your device before relying on the app.

## v0.3.1 terrain rendering fix
Shaded relief now uses a grayscale high-contrast Multiply blend rather than normal alpha compositing. Default strength is 85%. This avoids the pale transparent-filter appearance. Low-relief coastal plains still have subtle hillshading; elevation contour detail depends on USGS zoom level. Previously downloaded relief tiles remain compatible. Reload the page after updating; clear old cached app files if needed.


## v0.5: offline road routing and real elevation samples

**Prepare while online:** Serve over localhost or HTTPS. Zoom to a town-sized view (roughly zoom 11–13) and click **Download roads in current view**. Repeat for adjoining map views to connect a larger area. Roads are downloaded from OpenStreetMap Overpass and saved in IndexedDB. Download map tiles separately with **Download map area**. Click **Download real USGS elevation samples** to save a 3×3 or 5×5 grid of real USGS EPQS point readings in the current view. This is *not* a continuous elevation raster or precise arbitrary-point DEM. The nearest saved reading is reported with distance.

**Route offline:** Use coordinates (latitude, longitude), an exact saved landmark label, or the exact name of a downloaded resource marker in the existing From and To fields. Click **Calculate new OFFLINE route**. Unknown street addresses require a one-time online lookup; save the resolved address as a label while connected. The algorithm uses a directed OSM road graph and shortest distance; it cannot account for live closures, temporary restrictions, traffic, or safe passage. Endpoint connectors can be up to 2 km and are not navigable road segments. It produces a route line, not spoken turn-by-turn directions.

**Back up:** Export offline data as JSON and import it on another device. This includes road graph, saved labels, and elevation samples, but **not** map image tiles or hospital/water/boat ramp GeoJSON (export those separately).

**Important limitations:** Overpass public servers may throttle or fail, particularly for large areas. Statewide offline road/elevation downloads are not bundled. USGS elevation point lookups may fail or be rate-limited. Browser storage can be evicted; test in airplane mode and keep paper maps. Offline routes are not validated for emergency safety. The PWA must be hosted via localhost or HTTPS for reliable installation.

## v0.9: Map symbols and touchscreen gestures

- Hospitals and emergency wards use a small red hospital-cross marker on the main map and mini map.
- OpenStreetMap mapped military landuse, bases, barracks, and airfields use a military shield marker. Military locations are **restricted** and are not designated public relief sites. The military layer is toggleable.
- Use two fingers to pinch inward/outward on the main map to zoom, or use the zoom buttons and mouse wheel. The mini map also supports two-finger zoom.
- While online, zoom to your area and select **Download / refresh resource data** to obtain military and hospital markers. These locations are not bundled with the app. Previously downloaded resources and maps are retained offline.
- Military map data can be incomplete or out of date; no access or safety status is implied.

This version was syntax-checked, but touch behavior and live resource retrieval have not been verified on a physical device.

## v1.0 — Private survival waypoints and bookmarks

Tap any visible hospital, military, water, boat ramp, or personal waypoint marker to see its name, coordinates, and available details. Use **Bookmark location** to keep a local shortcut or **Set as destination** to populate the routing panel. Bookmarks persist in IndexedDB and can be accessed without internet, although new online routes still require connectivity unless a road network has been downloaded for offline routing.

Below the navigation mini map, **My emergency locations** supports bug-out locations, family/trusted homes, cache/supply locations, meeting points, and custom waypoints. Enter a name and coordinates, or choose **Use map center**, **Use selected marker**, or **Use GPS**. Saved places appear on the main and mini maps with amber waypoint symbols and in a clickable saved-location list. Places can be edited or deleted. Toggle their visibility with **Show personal locations on maps**.

**Privacy and backup:** Personal places and bookmarks are stored only in this browser's IndexedDB, not uploaded to a server by this feature. Export/import private backups as JSON to move between devices. These backups are **unencrypted** and may reveal sensitive locations; store them securely and do not share publicly. Browser storage can be cleared or evicted, so keep a backup. This feature does not verify access, safety, road passability, or availability of any location. Test offline before relying on it.


## v1.2 coordinate entry
Personal waypoints accept `34.05239, -79.53528`, `34.05239° N, 79.53528° W`, `34.05239° N, -79.53528° W`, and `N 34.05239, W 79.53528`. Input validation now reports specific errors. Existing map gesture handlers and saved waypoints are unchanged. Update the deployed files and reload to receive the new service worker cache.


## v1.3 — Marker name labels
Tap any visible map marker to show a high-contrast name label directly on the map (e.g., Bug-Out-1, McLeod Regional Medical Center, or a mapped military installation). The existing marker details, bookmark and navigation actions remain in the Locations panel. The mini map also shows the selected marker's name. The label uses the actual saved/imported marker name, not an invented facility name. Pinch-to-zoom handlers are unchanged.

## v1.5 — Survival Hub prototype
- Seventh Survival tab with customizable go-bag, evacuation and home-readiness checklists, quantities, checkmarks and offline local persistence.
- Preview catalog for proposed one-time content packs and Survival Plus / Pro subscriptions. **No payments, user accounts, license server or paid entitlements are implemented.**
- Password-encrypted AES-GCM checklist backup import/export (PBKDF2-SHA256 310,000 iterations). Requires HTTPS/localhost; not a replacement for a reviewed production vault.
- No licensed training videos or plant/track recognition engine are included. Current private map locations remain stored unencrypted in the legacy database; their existing export is unencrypted.
- PWA installation and service-worker caching require HTTPS or localhost. Opening downloaded HTML directly in Chrome cannot provide full PWA/offline functionality.
