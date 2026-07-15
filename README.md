# Sakura Crest: Social Summit — Cloudflare Release

This branch is the **Audio, Accessibility, Mobile UX & Performance v1.6** release of Sakura Crest. It retains the complete four-year campaign, living campus, active classes and clubs, fourteen walkable illustrated environments, thirty school friendship chapters, thirty off-campus friendship scenes, monthly rankings, exams, elections, prom, graduation and New Game+.

## Original procedural audio

All music and effects are generated locally through the Web Audio API. The game uses no copyrighted recordings, external audio hosts or downloadable audio packs.

- Thirteen contextual themes cover the title, four seasons, classes, clubs, incidents, competitions, district exploration, café scenes, prom and endings.
- Four independent controls cover master mute, music, effects and dialogue voice volume.
- Bells, movement, weather, crowds, messages, activities and interface actions have distinct synthesized cues.
- Every important audio cue also has a textual, symbolic or status-label equivalent.
- Audio preferences persist across reloads, save recovery and new-game resets.

## Reading and accessibility

- Slow, normal, fast and instant text speeds.
- Safe single-choice auto-advance.
- Skip-read support using a bounded completed-dialogue index.
- An in-game history containing the latest eighty conversations and selected results.
- Persistent large text, high contrast and reduced-motion settings.
- Color-independent labels and status text for critical feedback.
- Screen-reader live regions for dialogue, menus, location changes, notifications and urgent warnings.
- Strong browser focus indicators and a descriptive canvas label.

## Flexible input and mobile UX

- Fully remappable keyboard movement, interaction, options, history, map and bedroom controls.
- Existing controller support remains available and can be disabled independently.
- Touch controls appear only on coarse-pointer devices and offer small, medium and large sizing.
- Tablet and landscape-phone layouts retain the complete playable canvas.
- Portrait phones receive a readable orientation screen rather than a cramped game interface.
- WASD or arrows move by default; E or Space interacts; O opens accessibility; H opens dialogue history; X opens the district map; B enters the bedroom.

## Performance safeguards

- A rolling local frame monitor reports average frame time, estimated FPS, sampled frames and long frames.
- Automatic low-power mode activates only after sustained slow rendering.
- Low-power mode reduces decorative weather particles, ambient sound frequency and expensive presentation effects while preserving gameplay, collision, dialogue and UI clarity.
- Accessibility settings are normalized once and do not read storage during the frame loop.
- No performance analytics are transmitted externally.

## Commercial world retained

The player can freely walk through Sakura Crest Academy, their bedroom, Shopping Street, Maple Café, Starline Arcade, Riverside Park, Public Library, Moonlight Cinema, Sports Center, Echo Live House, Festival Grounds, City Museum, Study Center, Crest Convenience and Sakura Station. Every map includes collision geometry, camera-follow movement, exits, illustrated props, hotspots and wandering classmates.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **/** or **.**
- Environment variables: none

The repository root is the deployable site. `sw.js` caches the complete v1.6 runtime for offline play after the first successful load. No package installation, database, external image host, audio host or secrets are required.

## Validation

The `Production browser QA` workflow validates:

- all campaign, living-campus, active-school, social, collection and walkable-world systems;
- thirteen original themes and four independent audio controls;
- persistent volume, reading, visual, touch and remapping preferences after reload;
- dialogue history and recorded choice outcomes;
- remapped keyboard-only movement;
- touch-only controls on tablet and landscape phone;
- screen-reader structures, strong focus styling and portrait guidance;
- automatic low-power activation under sustained slow frames;
- all fourteen commercial-quality maps and zero placeholder flags;
- service-worker-controlled offline reload;
- screenshot evidence for accessibility pages, history, performance, desktop, tablet, mobile and every walkable environment.

## Release scope

This is a complete-campaign, installable browser release with commercial-quality visuals, an explorable school and city, original procedural audio, persistent accessibility and reading tools, flexible keyboard/controller/touch input, local performance safeguards and offline play.
