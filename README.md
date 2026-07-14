# Sakura Crest: Social Summit — Cloudflare Release

This branch is the **Production QA & Offline v1.1** release of Sakura Crest. It includes the complete four-year / 48-chapter campaign, thirty friendship-route chapters, twenty phone conversations, twelve monthly showcases, twenty rivalry chapters, ten illustrated friendship moments, twenty-four contextual campus incidents, eight mastery minigames, forty achievements, eight seasonal examinations, eight weekend outings, four annual elections and twelve graduation legacies.

The v1.1 pass adds an installable PWA shell, offline play after the first successful load, persistent-storage requests, mobile safe-area handling, visible runtime recovery, stricter Cloudflare cache rules and automated Chromium validation of the actual canvas game.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **/** or **.**
- Environment variables: none

The repository root is the deployable site. No Worker, package installation, database, external image host or secrets are required. `sw.js` must be served from the repository root so it can control the complete game scope.

## Controls

WASD / arrows to move, E or Space to interact, R rankings, Q schedule, J friendships, P phone, K memories, A activities, V rivals, Y yearbook, O accessibility/options, L leadership, M sound and Escape pause. Standard controllers are supported.

## Production validation

The `Production browser QA` GitHub Actions workflow launches the exact static release in Chromium and checks:

- title-screen rendering and non-blank canvas output;
- new-game creation and entry into the live school simulation;
- accessibility and ranking overlays;
- service-worker registration and a full offline reload;
- mobile viewport containment and touch-ready layout;
- browser console errors, page exceptions and failed asset requests;
- screenshot artifacts for desktop, gameplay, offline and mobile review.

The lightweight `tests/remote-static-smoke.mjs` remains available for fast content, initialization, save-schema and authored-system checks.

## Release scope

This is a deployable complete-campaign browser release with playable midterms and finals, monthly weekend friend outings, persisted accessibility options, controller input, four annual leadership campaigns and a post-prom New Game+ loop with four legacy perks.
