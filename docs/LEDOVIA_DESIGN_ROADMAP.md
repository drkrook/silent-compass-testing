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
