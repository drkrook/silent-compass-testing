# Silent Compass v0.8.7 — Autonomous Builder Assignments

## Operating rules
- Work only in `drkrook/silent-compass-testing` on the assigned branch.
- Treat `drkrook/silent-compass-family-beta` (Stable v0.8.3) as strictly read-only.
- No direct commits to Beta `main`, no merges, no deployment approvals, no destructive migrations.
- Preserve GPS, existing raster maps, offline tile caching, pinch-to-zoom, saved locations, 5,128 SC resources, and user data.
- Never claim statewide coverage or offline verification without a real archive and reproducible tests.
- Submit changes by pull request with test evidence, known limitations, and rollback instructions.
- Do not bulk-download from public map tile servers without explicit license authorization.
- Keep changes scoped to assigned files; coordinate shared contracts through pull requests.
- User remains final approver for integrating and deploying changes.

## Builder A — Offline Map Engine
Branch: `agents/v087-map-engine`
Mission: Prototype a state-archive reader and renderer integration, retaining existing raster fallback. Identify compatibility with the existing canvas renderer and pinch-to-zoom. No live download promises without package availability.
Deliverables: implementation, automated tests, PR, offline verification plan.

## Builder B — State Package Pipeline
Branch: `agents/v087-state-packages`
Mission: Produce a reproducible, license-compliant South Carolina OSM-derived map archive pipeline and manifest schema (URL, SHA-256, bytes, bounds, zoom, attribution). Evaluate hosting limits and mobile storage; prepare NC as a later phase.
Deliverables: build scripts, license evidence, artifact checksum, package-size estimates, PR. No unlicensed bulk tile scraping.

## Builder C — Regression & Validation
Branch: `agents/v087-validation`
Mission: Build automated checks for existing features and state archive install integrity, offline persistence, failure recovery, and zoom gestures. Provide phone-test checklist.
Deliverables: test suite, reproducible results, PR. Do not alter production data.

## Release gate
1. Review three PRs and resolve conflicts.
2. Verify the SC archive exists, is legally distributable, and is correctly hosted.
3. Verify download, SHA-256 integrity, IndexedDB/OPFS persistence, offline rendering, and pinch zoom.
4. Ask user approval before Beta integration/deployment.
5. Phone-test browser and installed PWA; Stable remains untouched.

## Execution status
Branch creation and task assignment alone do not start an autonomous coding runtime. Each builder must be launched in an actual coding-agent environment with GitHub access.
