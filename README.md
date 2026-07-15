# Sakura Crest: Social Summit — Production Release v1.8

Sakura Crest is a complete four-year anime school-life RPG built as a static browser game. Release v1.8 combines the full campaign, living campus, active classes and clubs, fourteen walkable destinations, monthly rankings, elections, Prom, graduation, New Game+, resilient saves, original audio and accessibility with a permanent commercial anime-art presentation.

## Commercial anime artwork

- Permanent illustrated title key art stored locally in the repository.
- A connected 4096×768 three-wing Sakura Crest Academy panorama.
- A sixteen-character action atlas with walking, sitting, reading, talking, waving, teaching and training poses.
- A dedicated dialogue portrait atlas and environment-object atlas.
- Illustrated campus crops across all fourteen walkable maps.
- No runtime Canva, Drive, Adobe or other external asset-host dependency.
- `assets/anime/manifest.json` records the dimensions, byte sizes and SHA-256 digest of every release asset.

## Expanded academy and classes

- Class 1-A, Mathematics and Literature rooms have visible doors and aligned collision openings.
- Thirty assigned student positions support seated classroom behavior.
- Students route through doors and settle into lesson poses rather than pacing through desks.
- The player sits during class and returns to walking animation on movement.
- Fast wing-transit points keep the larger academy practical within the daily timetable.

## Complete campaign and balance

- Forty-eight authored monthly chapters are playable for both boys' and girls' ranking ladders.
- All four club paths and Established, Ordinary and Outsider difficulty modes are covered by deterministic full-campaign simulations.
- Ranking contributions use caps and diminishing returns to prevent uncontrolled multi-year score inflation.
- Committed play can reach the final top two with every ladder, club and difficulty combination; passive play does not receive an elite ending automatically.
- Prom crown and non-crown endings are validated for both ranking ladders.

## Resilient save format v10

- Save envelopes include an integrity checksum and last-known-good backup.
- Writes pass through a pending envelope so interrupted writes can recover safely.
- Invalid JSON and checksum mismatches are quarantined rather than silently accepted.
- Unsafe numeric values are repaired into supported gameplay ranges.
- Save formats v1 through v9 migrate forward to v10.

Progress remains local to the browser. Clearing the site's browser storage removes local progress and recovery files.

## Audio, accessibility and input

- Thirteen original Web Audio themes and independent master, music, effects and dialogue controls.
- Slow, normal, fast and instant text speeds, safe auto-advance, skip-read and dialogue history.
- Persistent large text, high contrast, reduced motion and screen-reader live announcements.
- Remappable keyboard movement and actions, controller support and scalable touch controls.
- Tablet, landscape-phone and portrait-guidance layouts.
- Local performance monitoring and automatic low-power fallback with no external analytics.

## Commercial walkable world

The player can freely walk through Sakura Crest Academy, their bedroom, Shopping Street, Maple Café, Starline Arcade, Riverside Park, Public Library, Moonlight Cinema, Sports Center, Echo Live House, Festival Grounds, City Museum, Study Center, Crest Convenience and Sakura Station. Every map includes collision geometry, camera-follow movement, exits, illustrated props, hotspots and wandering classmates.

## Cloudflare Pages

- Framework preset: **None**
- Root directory: repository root
- Build command: leave blank
- Build output directory: **.**
- Production branch: **main**

The repository root is the complete static artifact. `_headers` supplies the production security and cache policy, `_redirects` provides stable entry aliases, and `sw.js` caches the v1.8 runtime and artwork for offline play after the first successful load.

Operational documents:

- `docs/release-v1.8-art.md` — commercial art release and validation scope.
- `docs/release-v1.7.md` — campaign, balance and save-recovery foundation.
- `docs/cloudflare-release-runbook.md` — production verification and rollback.
- `docs/known-issues.md` — explicit tradeoffs and severity register.
- `docs/pass-8-audio-accessibility.md` — audio and accessibility implementation notes.

## Validation

The `Production browser QA` workflow validates:

- syntax for every production and QA script;
- all permanent artwork dimensions and SHA-256 digests;
- release inventory, service-worker cache, security headers and redirects;
- the complete campaign, living-campus, active-school, social, collection and walkable-world systems;
- twenty-four deterministic 48-month campaign profiles;
- both Prom ending families for both ranking ladders;
- save v1-v10 migration, checksum tampering, interrupted writes, corrupted-main recovery and deletion;
- 50,000 long-session ranking calculations;
- thirteen original themes, four audio channels and persistent accessibility settings;
- remapped keyboard movement and touch-only controls;
- all fourteen walkable maps and zero placeholder flags;
- service-worker-controlled offline reload;
- Chromium, installed Chrome, installed Edge, Firefox and WebKit desktop/mobile compatibility.

## Known release status

The validated repository build contains no known critical or high-severity defects. Production is deployed from `main` through Cloudflare Pages after the exact merge commit passes the release gate.

## Controls

WASD or arrows move by default. E or Space interacts. O opens Accessibility, Audio & Controls; H opens dialogue history; X opens the district; B enters the bedroom; U opens collections. Keyboard mappings can be changed in-game. Touch controls appear on coarse-pointer devices and standard controllers remain supported.
