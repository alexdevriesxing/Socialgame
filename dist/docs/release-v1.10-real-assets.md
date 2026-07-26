# Sakura Crest v1.10 — Dedicated Real Assets

## Release goal

v1.10 removes the final recycled and procedural presentation surfaces from the playable game. Every world, story, rivalry and memory surface now has a dedicated permanent repository asset.

## Permanent artwork

- `district-map.webp`: illustrated Sakura district map used by the travel overlay.
- `world-locations.webp`: sixteen distinct environment cells covering the bedroom, fourteen destinations, school courtyard and rooftop garden.
- `events.webp`: twelve distinct illustrated campaign and school-event scenes.
- `rivals.webp`: twelve dedicated rivalry illustrations with character-focused competitive framing.
- `memories.webp`: twelve dedicated friendship-memory illustrations with warm archival framing.

The existing commercial key art, three-wing campus panorama, transparent 16-character animation atlas, portrait atlas and object atlas remain intact. All files are served locally by GitHub and Cloudflare Pages. There are no Canva, Drive, Adobe, Vercel or third-party runtime dependencies.

## Runtime integration

The district map renderer uses the dedicated map asset. All fourteen walkable locations use their assigned atlas cells. Event, rival and memory dialogue panels no longer reuse the campus panorama or title key art. Functional exits, collision landmarks, NPC navigation and interaction anchors remain available over the illustrated environments.

## Release gates

The v1.10 browser gate verifies exact image dimensions, unique file sources, distinct visual signatures for all fourteen destinations and at least ten distinct cells in each story atlas. It captures the district map and arcade environment, then runs the full campaign, save, mobile, offline, sprite-transparency and Chrome/Edge/Firefox/WebKit suites.

Known critical defects: **0**. Known high-severity defects: **0**.
