# Sakura Crest: Social Summit — Cloudflare Release

This branch is the **Active School & Visual Polish v1.3** release of Sakura Crest. It retains the complete four-year / 48-chapter campaign, living-campus simulation, thirty friendship-route chapters, twenty phone conversations, twelve monthly showcases, twenty rivalry chapters, ten illustrated friendship moments, twenty-four contextual campus incidents, forty achievements, eight seasonal examinations, eight weekend outings, four annual elections and twelve graduation legacies.

The v1.3 pass makes ordinary classes and club attendance actively playable without turning reflex skill into a campaign gate. It adds nine academic activities, sixteen club activities, sixteen seasonal competition variants, persistent mastery records, practice mode and timing assists. It also rebuilds the title composition, simplifies the in-game HUD and adds a purpose-built portrait-phone rotation screen after a visual QA review of the v1.2 Chromium evidence.

## Active School systems

- Nine playable subjects: mathematics, literature, science, history, languages, physical education, visual art, music and computer studies.
- Four mechanically distinct activity types: timing, sequence memory, balance control and decision scenarios.
- Four unique activities for every club:
  - Skybound Athletics: explosive starts, match tactics, relay exchanges and captaincy.
  - Velvet Bloom Arts: composition, rehearsal, live performance and exhibition curation.
  - Byte Brigade: coding, robotics, debugging and innovation budgeting.
  - Crest Council: debate, budgets, petition review and peer mediation.
- A seasonal competition for every club in every season, producing sixteen authored event variants.
- Active options embedded directly into mathematics, literature, PE, social studies and scheduled club periods.
- A replayable Active Learning Lab opened with **G** or the Activities HUD button.
- Persistent subject mastery, club-activity mastery, personal bests, activity history and seasonal wins.
- Assist mode widens timing zones, extends sequence previews and softens balance controls without reducing access or rewards.
- Practice mode never advances the campaign clock or changes ranking, so every activity can be learned safely.

## Visual QA improvements

- Rebuilt title-screen hierarchy so the logo, story pitch and menu no longer collide with text embedded in the key art.
- New two-card title composition with explicit release scope and activity counts.
- Reworked right-side HUD with clearer spacing, shorter mission rows and direct Campus/Activities access.
- Touch controls now appear only on coarse-pointer devices instead of obscuring desktop play.
- Portrait phones receive a branded rotate-device screen rather than an unreadably small 16:9 canvas.
- Deterministic canvas-layout validation checks that title and HUD regions remain inside the 960 × 540 safe area and do not overlap.

## Living Campus systems

Every named student and teacher retains a complete routine for all eleven daily schedule periods, including assigned classroom seating, lunch groups, clique-specific club gatherings, teacher patrols, passing-period movement, support services and weather or chapter-dependent changes. Press **C** for the Campus Pulse.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **/** or **.**
- Environment variables: none

The repository root is the deployable site. No Worker, package installation, database, external image host or secrets are required. `sw.js` is served from the repository root and caches the complete v1.3 game for offline play.

## Controls

WASD / arrows to move, E or Space to interact, G active learning, C campus pulse, R rankings, Q schedule, J friendships, P phone, K memories, A campus activities, V rivals, Y yearbook, O accessibility/options, L leadership, M sound and Escape pause. Number keys operate sequence and decision activities. Standard controllers and touch buttons are supported.

## Production validation

The `Production browser QA` GitHub Actions workflow launches the exact static release in Chromium and checks:

- title-screen composition, safe-area geometry and non-blank canvas output;
- all nine subjects, sixteen club activities, four mechanics and sixteen seasonal event mappings;
- a complete decision activity and mastery persistence;
- Active Learning Lab, active-game presentation, living-campus movement and Campus Pulse;
- accessibility, rankings, service-worker registration and a full offline reload;
- desktop HUD presentation, portrait rotation guidance and landscape mobile containment;
- browser console errors, page exceptions and failed asset requests;
- screenshot artifacts for title, live HUD, active learning, campus, rankings, offline, portrait and landscape mobile review.

The lightweight `tests/remote-static-smoke.mjs` also validates all authored campaign systems, 154 living-campus routines, active-school content, assist behavior, activity rewards, weather rerouting and release initialization.

## Release scope

This is a deployable complete-campaign browser release with active daily school gameplay, a living campus, playable midterms and finals, monthly weekend friend outings, persisted accessibility options, four annual leadership campaigns and a post-prom New Game+ loop with four legacy perks.
