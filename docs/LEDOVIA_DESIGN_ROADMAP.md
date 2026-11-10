# Ledovia — Approved Visual Direction & UI Roadmap
Updated: 2026-11-10
Status: Planned; NOT authorized for implementation by this roadmap entry.

## Reference and goal
The user prefers the previously approved high-fidelity Ledovia mobile and desktop renderings. Current Beta uses vector mountain art, which does not match the realistic, richly detailed pine forests and mountain scenery in the renderings. Preserve the clean, modern dark-teal card style and improve visual fidelity.

## Roadmap priorities
1. **Photorealistic/scenic header and background**: real-looking evergreen pine trees, distant layered mountain ranges, snow-dusted peaks, atmospheric depth, tasteful lighting, and composition matching the approved rendering. Use responsive desktop and mobile assets that avoid cropping important scenery and text. Asset licensing and performance/offline caching must be reviewed before release. The user wants the *exact visual feel* of the approved rendering, not flat geometric mountain silhouettes.
2. **Hamburger menu (top left)**: three-bar navigation affordance, opening an accessible menu to existing app sections. Preserve all existing routes, shortcuts, and event handlers; do not create duplicate features. Support keyboard navigation, focus management, and closing behavior.
3. **Notification bell (top right)**: recognizable bell with accessible notifications panel. Display only grounded, meaningful app information; never fabricate active weather alerts, emergency notifications, connectivity, or offline readiness. Define notification sources, permission behavior, offline state, and badge semantics before implementation.

## Protected scope
- Keep Emergency Help and Official Weather Alerts prominent.
- Preserve the functioning phone Compass, night modes, maps, GPS, routes, offline packs, saved locations, Family Circles, survival content, and all existing Home shortcuts.
- Cruise Test is a separate project: do NOT add it to Ledovia Beta.
- Do not show unverified pack counts or offline-ready status merely because they appeared in a mockup.
- Stable repository drkrook/silent-compass-family-beta must not be changed without separate explicit promotion approval.
- Continue suggest → design → user approval → build/validate/deploy to Beta → user tests → separate Stable approval.

## Acceptance criteria for future implementation
- Mobile and desktop screenshots visually compared against the approved renderings.
- Important mountain peaks, pine trees, brand mark and tagline visible at typical phone and desktop aspect ratios.
- Hamburger menu works with the existing app navigation.
- Bell accurately reflects real notification state and remains useful without an internet connection.
- No regressions to protected functionality; Beta tested before any Stable promotion.

## Proposed Home decluttering (design planning, not yet approved for implementation)
Sequence: finish the approved realistic pine-and-mountain appearance first; only then implement navigation and notifications.

**Keep on Home:** Emergency Help, Official Weather Alerts, Compass on supported mobile devices, Open Map, Show My Location, Get Directions, Survival Guides, Offline Readiness.

**Consider moving to hamburger:** Report a Hazard, Family Circles, My Saved Locations, Settings, and other secondary features, after confirming their existing destinations and whether they remain discoverable. This is a proposal only: user approval of the final menu arrangement is still required.

**Non-negotiables:** Every moved feature must remain accessible with its original behavior and data; no deletion of existing sections, no regression of emergency access, and no Cruise Test tile. Ensure the hamburger menu is accessible, clearly labeled, keyboard-friendly, and easy to close. Notification bell implementation follows separately once real data sources and states are defined.

## Home navigation decision — 2026-11-10
User direction: **Move Offline Readiness from the Home tile grid into the hamburger menu, and replace its Home position with Report a Hazard** so reporting hazards remains a quick action.

Revised proposed Home quick actions: Emergency Help (prominent), Official Weather Alerts (prominent), Compass (supported mobile devices), Open Map, Show My Location, Get Directions, Survival Guides, Report a Hazard. Keep the established underlying actions and navigation; do not replace or remove any working feature.

Proposed hamburger organization (subject to visual design review): Navigation & Places (Saved Locations, saved routes, related location tools); Family & Sharing (Family Circles); Preparedness (Offline Readiness, map/resource pack downloads); Settings (preferences, language, app/data management). Consider consolidating related destinations into clear sections, not merging or deleting their stored data.

Offline readiness status may remain visible in a small, accurate status indicator, separate from the moved shortcut. Avoid unverified 'Offline Ready' claims.

Priority remains: approved realistic scenery first, then implement approved Home/menu structure, then functional notifications. The user is approving this information architecture direction, not authorizing unreviewed changes to emergency functionality or Stable.
