# Silent Compass — Offline navigation implementation plan

Status: engineering plan only; offline turn-by-turn routing is NOT implemented.

## Non-negotiable requirements
- Android standalone PWA; fully local route calculation after download; no network calls needed for calculation or guidance.
- Keep existing USGS topo/satellite maps, tile storage, gestures, GPS, resource layers, private places, saved routes, and tab navigation functional.
- Clearly distinguish offline **map imagery**, offline **road routing data**, and offline **resource locations**.
- Never label a saved route as live navigation; never claim roads are currently open or safe.
- User controls region downloads and storage size; validate actual IndexedDB storage before showing Ready.
- Offline routing must handle missed turns, unavailable GPS, out-of-coverage destinations, and app restart safely.
- No account requirement; no reliance on online address search for offline destinations.
- Large touch targets, short plain-language directions, readable contrast, simple Back and Stop controls.
- No paid hosting/services in beta.

## Stage 1: source and engine feasibility — no production UI integration
1. Audit OpenFreeMap vector tile licensing, browser User-Agent requirements, and offline caching conditions. Do not reuse raster-tile assumptions.
2. Compare browser-local WASM-compatible routing engines and OSM-derived road graph packaging. Validate license and distribution obligations.
3. Build a separate Florence-area test page, not an override of existing map code.
4. Demonstrate airplane-mode route calculation from coordinates or a saved point, using a downloaded graph.
5. Record package sizes, memory usage, load time, routing time, and Android performance. Stop if unsafe or impractical.

## Stage 2: street map
- Add Street / Road only after renderer and data downloads pass real Android offline tests.
- Download user-selected geographic area and zoom range, respecting provider terms and per-download byte/tile limits.
- Keep map type caches independent; show verified local coverage for current viewport and zoom.

## Stage 3: offline route planning
- Add a distinct "Download Roads for Offline Directions" action.
- Show coverage, date of road-data build, approximate storage, and a local route test.
- Route to saved locations, coordinates, and stored resources without online search.
- Display clear instructions and total distance; use separate status for unverified roads.

## Stage 4: guidance
- GPS progress along route, next-turn display, optional speech if the device supports offline speech.
- Reroute only when the local road graph covers the new path; otherwise give an explicit coverage warning.
- Test with GPS denied, GPS drifting, background/resume, airplane mode, and interrupted downloads.

## Acceptance tests before publishing a new feature
- No regression in two-finger pinch zoom, one-finger pan, map tile loading, or offline state resources.
- Android airplane-mode test: close and relaunch app, display road map, calculate a new route, show instructions.
- Offline readiness must not go green unless the specific required road graph and map coverage are present.
- Routing never implies emergency passability or current closure information.

## User-approved rollout
User authorized publishing the completed and verified update without another approval. Publish incrementally after verification; do not describe this planning document as an installed navigation feature.
