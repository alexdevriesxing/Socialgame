# Sakura Crest v1.11 — Living District

Sakura Crest v1.11 turns the dedicated v1.10 district artwork into a more active part of the game loop. The fourteen walkable destinations still use their permanent repository-hosted illustrations, but each location now has its own signature activity, persistent mastery track and ambient behavior.

## Signature activities

Every destination awards a location-specific effect instead of relying only on the previous generic exploration reward. The café emphasizes kindness and recovery, the library develops intellect and reliability, the sports center rewards measured training, the station develops courage and future planning, and the remaining locations follow similarly distinct themes. A signature activity may advance mastery only once per in-game day, preventing repeated exits and re-entry from becoming an unlimited progression exploit.

## Persistent mastery

Each destination stores a mastery value in the player save. Reaching mastery level three earns the location’s district stamp and a modest allowance reward. Reaching level six awards local-expert status and a social-score reward. Progress, stamps, expert status and the latest district moments remain part of the serialized player state and therefore survive save, recovery and offline play.

## Living environments

The permanent district illustrations receive location-specific ambient animation without replacing or hiding the real assets. Café tables produce subtle steam, park water ripples and seasonal particles move across the scene, arcade lights pulse, the cinema uses a soft projector beam, the live venue has moving stage lights, festival lanterns flicker, exhibits glint in the museum, a train moves through Sakura Station and every other destination has its own restrained visual profile. Reduced-motion preferences freeze or simplify these effects.

## Interface and validation

The walkable-location HUD now shows local mastery, district-stamp and local-expert status without covering the existing map, room or school controls. The release validator confirms fourteen complete signature definitions, persistent progression fields, fourteen ambient profiles, reduced-motion support and continued use of the dedicated v1.10 artwork. No procedural placeholder card or recycled campus/title scene has been reintroduced.

## Deployment

The release remains a static GitHub-to-Cloudflare Pages build. `src/living-district-v111.js` is included in the build manifest and service-worker core cache. The v1.11 release keeps all anime art local to the repository and introduces no new external runtime dependency.
