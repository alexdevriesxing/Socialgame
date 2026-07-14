# Sakura Crest: Social Summit — Cloudflare Release

This branch is the **Living Campus v1.2** release of Sakura Crest. It retains the complete four-year / 48-chapter campaign, thirty friendship-route chapters, twenty phone conversations, twelve monthly showcases, twenty rivalry chapters, ten illustrated friendship moments, twenty-four contextual campus incidents, eight mastery minigames, forty achievements, eight seasonal examinations, eight weekend outings, four annual elections and twelve graduation legacies.

The v1.2 pass makes the academy operate like a believable school instead of a collection of static rooms. Every named student and teacher now has a complete routine for all eleven daily schedule periods, including assigned classroom seating, lunch groups, clique-specific club gatherings, teacher patrols, passing-period movement and weather or chapter-dependent changes.

## Living Campus systems

- Smooth room-to-room movement through valid doors and hallway lanes instead of period teleports.
- Complete 110-period student routine matrix and 44-period teacher duty matrix.
- Assigned seating, recurring lunch groups, club gatherings and independent free-period interests.
- Busy hallway transitions, visible movement states and a live crowd-density indicator.
- Contextual dialogue that references the current duty, room, weather and featured monthly event.
- Weather closures and automatic indoor rerouting when the courtyard is unsafe.
- Interactive noticeboard, school office, counselor desk and nurse station.
- A **Campus Pulse** screen showing every named character’s current room, activity and movement state.
- Press **C** or use the Campus HUD button to open the live campus view.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **/** or **.**
- Environment variables: none

The repository root is the deployable site. No Worker, package installation, database, external image host or secrets are required. `sw.js` is served from the repository root and caches the complete v1.2 game for offline play.

## Controls

WASD / arrows to move, E or Space to interact, C campus pulse, R rankings, Q schedule, J friendships, P phone, K memories, A activities, V rivals, Y yearbook, O accessibility/options, L leadership, M sound and Escape pause. Standard controllers are supported.

## Production validation

The `Production browser QA` GitHub Actions workflow launches the exact static release in Chromium and checks:

- title-screen rendering and non-blank canvas output;
- new-game creation and entry into the live school simulation;
- the complete student and teacher routine matrices;
- valid movement destinations and finite actor positions;
- Campus Pulse, accessibility and ranking overlays;
- service-worker registration and a full offline reload;
- mobile viewport containment and touch-ready layout;
- browser console errors, page exceptions and failed asset requests;
- screenshot artifacts for title, campus, rankings, offline and mobile review.

The lightweight `tests/remote-static-smoke.mjs` also validates all authored systems, the living-campus routine graph, weather rerouting and release initialization.

## Release scope

This is a deployable complete-campaign browser release with a living daily school simulation, playable midterms and finals, monthly weekend friend outings, persisted accessibility options, controller input, four annual leadership campaigns and a post-prom New Game+ loop with four legacy perks.
