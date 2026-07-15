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

## Deployment

Cloudflare Pages serves the repository root as a static release. No framework build step is required.
