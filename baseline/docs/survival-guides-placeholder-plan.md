# Silent Compass — Survival Guides (WikiHow Placeholder Plan)

Status: Approved for development — 2026-11-06

## Goal
Provide a branded Survival Guides section while original downloadable offline survival content is developed.

## Initial categories
- Fire Starting
- Water Purification
- Shelter Building
- First Aid
- Navigation
- Food Gathering
- Emergency Preparedness

## Temporary guide behavior
- Each guide entry may link to a relevant WikiHow article as an **Online Reference**.
- Clearly mark every linked placeholder **Online Reference — Internet Required**.
- Open external articles via their original URL; do not present linked material as bundled offline content.
- Keep Silent Compass branding and navigation within the guide directory.
- Do not copy WikiHow article text, illustrations, or photographs into the app without verifying and satisfying applicable rights and licensing requirements.
- External advice is not independently verified by Silent Compass. Prioritize qualified, authoritative sources and appropriate warnings for high-risk survival or first-aid topics.

## Future-proof content model
Store guide metadata separately from the interface. Suggested fields:
- `id`
- `title`
- `category`
- `sourceType`: `external_reference` or `offline_original`
- `externalUrl` (for temporary online references)
- `offlineContentId` (for original downloadable content)
- `availability`: `online_only` or `offline_ready`
- `lastReviewedAt`

Guide cards should use the content model so placeholders can later be replaced with original downloadable instructions, illustrations, and checklists without redesigning the UI.

## Acceptance criteria
1. Users can browse guides by survival category.
2. WikiHow placeholders are clearly labeled as online-only.
3. Offline users are not misled into believing linked articles are available offline.
4. Replacing an external link with original offline content does not require a guide-directory redesign.
5. Existing offline map, waypoint, and pinch-to-zoom behavior remains unchanged.

## Implementation note
This document records the approved feature plan. It does not implement the guide UI or ship offline survival articles.
