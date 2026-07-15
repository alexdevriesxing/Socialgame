# Sakura Crest: Social Summit — Production Release v1.7

This branch is the **QA, Balance, Save Recovery & Release Readiness v1.7** release of Sakura Crest. It retains the complete four-year campaign, living campus, active classes and clubs, fourteen walkable illustrated environments, thirty school friendship chapters, thirty off-campus friendship scenes, monthly rankings, exams, elections, prom, graduation, New Game+ and the complete v1.6 audio and accessibility layer.

## Final campaign and balance pass

- Forty-eight authored monthly chapters remain playable for both boys' and girls' ranking ladders.
- All four club paths and Established, Ordinary and Outsider difficulty modes are covered by deterministic full-campaign simulations.
- Ranking contributions now use caps or diminishing returns, preventing cumulative multi-year systems from creating uncontrolled score inflation.
- Monthly momentum retention and daily recovery vary by difficulty while preserving earned progression.
- Committed play can reach the final top two with every ladder, club and difficulty combination; passive play does not receive an elite ending automatically.
- Prom crown and non-crown endings are validated for both ranking ladders.

## Resilient save format v10

- Save envelopes include an integrity checksum.
- The previous valid save is retained as a last-known-good backup.
- Writes pass through a pending envelope so interrupted writes can recover safely.
- Invalid JSON and checksum mismatches are quarantined rather than silently accepted.
- Unsafe numeric values are repaired into supported gameplay ranges.
- Save formats v1 through v9 migrate forward to v10.
- Continue recognizes the main save, pending write and backup.

Progress remains local to the browser. Clearing the site's browser storage removes local progress and recovery files.

## Audio, accessibility and input

- Thirteen original Web Audio themes and independent master, music, effects and dialogue controls.
- Slow, normal, fast and instant text speeds; safe auto-advance; skip-read; eighty-entry dialogue history.
- Persistent large text, high contrast, reduced motion and screen-reader live announcements.
- Remappable keyboard movement and actions, controller support and scalable touch controls.
- Tablet, landscape-phone and portrait-guidance layouts.
- Local performance monitor and automatic low-power fallback with no external analytics.

## Commercial walkable world

The player can freely walk through Sakura Crest Academy, their bedroom, Shopping Street, Maple Café, Starline Arcade, Riverside Park, Public Library, Moonlight Cinema, Sports Center, Echo Live House, Festival Grounds, City Museum, Study Center, Crest Convenience and Sakura Station. Every map includes collision geometry, camera-follow movement, exits, illustrated props, hotspots and wandering classmates.

## Cloudflare Pages

- Framework preset: **None**
- Root directory: repository root
- Build command: leave blank
- Build output directory: **.**
- Environment variables: none

The repository root is the complete static artifact. `_headers` supplies the production security and cache policy, `_redirects` provides stable entry aliases, and `sw.js` caches the v1.7 runtime for offline play after the first successful load.

Operational documents:

- `docs/release-v1.7.md` — release notes and validation scope.
- `docs/cloudflare-release-runbook.md` — production verification and rollback.
- `docs/known-issues.md` — explicit tradeoffs and severity register.
- `docs/pass-8-audio-accessibility.md` — audio and accessibility implementation notes.

## Validation

The `Production browser QA` workflow validates:

- syntax for every production and QA script;
- release inventory, service-worker cache, headers and redirects;
- the complete campaign, living-campus, active-school, social, collection and walkable-world systems;
- twenty-four deterministic 48-month campaign profiles;
- both Prom ending families for both ranking ladders;
- save v1-v10 migration, checksum tampering, interrupted writes, corrupted-main recovery and deletion;
- 50,000 long-session ranking calculations;
- thirteen original themes, four audio channels and persistent accessibility settings;
- remapped keyboard movement and touch-only controls;
- all fourteen commercial-quality maps and zero placeholder flags;
- service-worker-controlled offline reload;
- Chromium, installed Chrome, installed Edge, Firefox and WebKit desktop/mobile compatibility.

## Known release status

The validated repository build contains no known critical or high-severity defects. Final verification of the owner's custom domain, DNS, certificate and promoted Cloudflare production deployment occurs after merge using the release runbook.

## Controls

WASD or arrows move by default. E or Space interacts. O opens Accessibility, Audio & Controls; H opens dialogue history; X opens the district; B enters the bedroom; U opens collections. Keyboard mappings can be changed in-game. Touch controls appear on coarse-pointer devices and standard controllers remain supported.