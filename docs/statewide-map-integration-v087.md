# Silent Compass Beta v0.8.7 — Statewide Map Package Integration Contract

Status: architecture specification; **not an available download**.

## Current verified architecture
- Stable source `index.html` renders raster map tiles via `tile(zoom,x,y,layer)`.
- Existing tile blobs live in IndexedDB database `griddown-atlas-v1`, store `tiles`.
- Existing area downloader caps jobs at 1,800 tiles per batch.
- The published South Carolina resource pack is separate from map coverage.
- Beta overrides must not change the stable repository.

## Delivery architecture
1. Publish a licensed, prebuilt state vector map archive (candidate: PMTiles) alongside a manifest recording state, archive URL, SHA-256, bytes, geographic bounds, supported zooms, map attribution, data source, license, and package version.
2. Check availability and show estimated device storage **before** enabling the state download.
3. Download the archive into browser-managed persistent storage with explicit progress, interruption handling, integrity verification, and a storage-capacity check. Do not mark installed until verification succeeds. Never silently overwrite an existing working pack.
4. Use a vector-capable renderer for installed archive data; retain the existing raster renderer as fallback until pan, zoom, GPS, and offline operation pass phone tests.
5. Store state-resource pack installation separately. Display independent installed/failed/partial statuses for vector maps, resources, and optional imagery/terrain.
6. Optional topographic styling can reuse vector road/label data but may require additional licensed elevation/contour data. Satellite imagery requires separate licensed raster packages.
7. Test offline mode with networking disabled, pan across multiple distant locations inside the state, and zoom at the declared supported levels. Do not claim all-zoom coverage.
8. Validate archive licensing and hosting/bandwidth/storage limits before distribution. Do not bulk-download from prohibited public tile services.

## Release gates
- South Carolina essential map archive generated and checksum verified.
- Browser and installed PWA can download, retain, and render it offline.
- Existing 5,128 SC resource locations remain accessible and existing saved data is preserved.
- Real package size, zoom coverage, and license shown to user.
- Beta phone test passes before considering NC or stable promotion.

## Non-goals for this step
No statewide map package has been published. No download button may imply otherwise.
No changes to the stable release, cloud accounts, Family Circles, or saved data.
