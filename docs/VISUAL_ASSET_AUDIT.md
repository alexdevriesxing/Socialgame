# Sakura Crest v1.5 Commercial Visual Asset Audit

## Acceptance standard

Every player-facing surface must read as finished game art rather than scaffolding: layered material rendering, controlled lighting, coherent anime-school palette, readable typography, authored environmental props, clear interaction affordances and no generic placeholder cards or empty rectangles.

## Runtime visual coverage

- **Academy:** eight illustrated rooms with distinct floor and wall materials, windows, desks, shelving, cafeteria service, gym markings, courtyard planting and seasonal/weather treatment.
- **Characters:** sixteen authored students/teachers/player variants with portraits, directional walk cycles, idle/emotional frames, shadows and relationship/rival indicators.
- **Walkable district:** bedroom plus thirteen off-campus maps, each with unique collision geometry, camera-follow movement, environmental props, entrances/exits, ambient animation and staged visiting classmates.
- **Interfaces:** premium rounded/glass panels, gradients, lighting, icons, modal-safe HUD behavior and consistent typography.
- **World navigation:** illustrated district map with roads, river, buildings, trees and destination pins; no destination-card grid.
- **Commerce/customization:** illustrated gift products, wardrobe previews, phone and room-theme previews.
- **Collections:** category-specific collectible artwork with locked/unlocked states and no blank thumbnail placeholders.

## Placeholder rejection gates

The release validators explicitly require:

- `validateCommercialCampus().placeholderMap === false`
- `validateWalkableWorld().placeholderCards === false`
- `validateCommercialWorldArt().placeholderCards === false`
- fourteen valid walkable collision maps
- thirteen walkable off-campus locations plus the bedroom
- commercial canvas complexity and color-diversity thresholds in Chromium
- screenshot evidence for every environment and major interface

## Visual QA evidence

GitHub Actions captures the title, academy, Campus Pulse, active-learning screens, illustrated district map, all fourteen walkable environments, gift shop, wardrobe, collection book, rankings, offline reload and portrait/landscape mobile presentation.
