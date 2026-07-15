# Sakura Crest v1.8 — Commercial Anime Art Release

This release replaces the visible procedural presentation with permanent local artwork stored under `assets/anime/`.

## Permanent release assets

- `keyart.webp` — 960×540 title and social-preview illustration
- `campus.webp` — 4096×768 three-wing academy panorama
- `characters.webp` — 1728×1024 sixteen-character action atlas
- `portraits.webp` — 512×512 dialogue portrait atlas
- `objects.webp` — 1024×512 environment and interface object atlas

`assets/anime/manifest.json` records dimensions, byte sizes and SHA-256 hashes. The released game has no runtime dependency on Canva, Drive, Adobe or another external asset host.

## Gameplay presentation changes

- Expanded connected academy wings and timetable-friendly transit points
- Visible classroom doors and aligned collision openings
- Thirty assigned classroom seats with seated lesson behavior
- Walking, sitting, reading, talking, waving, teaching and training poses
- Illustrated campus crops for the fourteen off-campus walkable locations
- Hallway entry begins in the clear central corridor rather than inside furniture collision geometry

## Release validation

The v1.8 release gate validates the exact artwork digests and dimensions, 32 production scripts, all campaign and save systems, the rendered desktop/tablet/phone experience, offline service-worker recovery and Chromium, Chrome, Edge, Firefox and WebKit compatibility. The browser suite also renders the title, expanded academy and every walkable destination to guard against blank, missing or visually underdeveloped screens.

## Deployment

Cloudflare Pages serves the exact artifact listed in `build-manifest.json`. The repository deployment workflow packages that inventory, discovers the Pages project linked to `Socialgame`, deploys the merged `main` commit and verifies that Cloudflare recorded the same commit hash as a successful deployment.
