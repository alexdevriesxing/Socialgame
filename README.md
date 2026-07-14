# Sakura Crest: Social Summit — Cloudflare Release

This branch is the **Commercial Art & Walkable District v1.5** release of Sakura Crest. It retains the complete four-year / 48-chapter campaign, living-campus simulation, active classroom and club gameplay, thirty school friendship chapters, thirty off-campus friendship scenes, twenty phone conversations, twelve monthly showcases, twenty rivalry chapters, forty achievements, eight seasonal examinations, four annual elections and the complete graduation and New Game+ systems.

The v1.5 pass removes the remaining placeholder-style presentation. Sakura Crest Academy, the bedroom and every district destination are now proper illustrated 2D environments that the player can walk through with camera movement, collision geometry, entrances, exits, local props, wandering characters and location-specific interactions.

## Commercial visual foundation

- Premium rounded and glass-panel UI with gradients, lighting, depth, illustrated icons and consistent typography.
- A fully illustrated academy replacing the former diagram-like school map.
- Material-specific classroom, hallway, library, courtyard, cafeteria and gym artwork.
- Seasonal courtyard trees, windows, weather and environmental lighting.
- Improved character grounding, shadows, relationship/rival indicators and nearest-character labels.
- Illustrated district navigation instead of a grid of generic destination cards.
- Product artwork for every gift, visual wardrobe previews and category-specific collectible icons.
- Modal screens hide the HUD and notification clutter correctly.

## Fourteen walkable 2D maps

The player can freely walk through:

- Sakura Crest Academy;
- the persistent bedroom;
- Shopping Street;
- Maple Café;
- Starline Arcade;
- Riverside Park;
- Public Library;
- Moonlight Cinema;
- Sports Center;
- Echo Live House;
- Festival Grounds;
- City Museum;
- Study Center;
- Crest Convenience;
- Sakura Station.

The bedroom and thirteen off-campus areas use their own collision maps, camera-follow movement, entrances, return points, illustrated props and interactive hotspots. Students who visit these locations wander through the environment rather than appearing only in menus.

## Off-campus life

- Free-period, after-school and weekend district travel.
- Ten complete NPC preference profiles with birthdays, interests, likes, dislikes and favorite places.
- Three unique off-campus scenes per core student, for thirty authored scenes and memory cards.
- Twelve purchasable gifts with preference and birthday reactions.
- Eight persistent customization categories: hair, skin, face, outfit, accessory, bag, phone theme and room theme.
- Duplicate-safe photos, badges, trophies, posters, memory cards, wallpapers, music and graduation keepsakes.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **/** or **.**
- Environment variables: none

The repository root is the deployable site. No package installation, external image host, database or secrets are required. `sw.js` caches the complete v1.5 runtime for offline play after the first successful load.

## Controls

WASD or arrows move the character in the academy, bedroom and every district area. E or Space interacts. **X** opens the district map, **B** enters the bedroom and **U** opens collections. G opens Active Learning, C Campus Pulse, R rankings, Q schedule, J friendships, P phone, K memories, A campus activities, V rivals, Y yearbook, O accessibility, L leadership and M sound. Touch controls appear on coarse-pointer devices; standard controllers remain supported.

## Production and visual validation

The `Production browser QA` workflow validates:

- the complete campaign, active-school systems and all 154 living-campus routines;
- the premium UI and eight-room commercial academy renderer;
- fourteen walkable maps and thirteen free-roaming off-campus destinations;
- player movement, prop collision, camera containment and NPC wandering;
- every map’s illustrated canvas complexity, color diversity and visual transitions;
- the illustrated district map, gift shop, wardrobe and collection book;
- zero placeholder map/card flags from all commercial-art validators;
- customization persistence, gift behavior and duplicate-safe collection unlocks;
- offline reload, portrait guidance and landscape mobile containment;
- screenshot evidence for every walkable environment and major interface.

## Release scope

This is a deployable complete-campaign browser release with commercial-quality procedural illustration, a fully walkable school and city, meaningful evenings and weekends, persistent self-expression, preference-driven friendships, duplicate-safe collections, annual leadership campaigns and a post-prom New Game+ loop.
