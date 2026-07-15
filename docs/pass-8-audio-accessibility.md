# Pass 8 — audio, accessibility, mobile UX and performance

## Completed scope

- Original procedural themes for title, all four seasons, classes, clubs, incidents, competitions, the walkable district, prom and endings.
- Independent master mute plus music, effects and dialogue volume channels.
- Persistent reading settings: four text speeds, auto-advance, skip-read and dialogue history.
- Persistent visual settings: large text, high contrast, reduced motion and color-independent status labels.
- Persistent input settings: keyboard remapping, gamepad enablement and three touch-control sizes.
- Screen-reader live announcements for dialogue, notifications, location changes and menu changes.
- Runtime frame telemetry with an automatic low-power rendering mode and a player-facing performance report.
- Desktop, tablet, landscape-phone, portrait-guidance, keyboard-only and touch-only QA.

## Design constraints

All music and sound are synthesized at runtime with the Web Audio API. No copyrighted recordings, external audio hosts or binary audio downloads are used. Settings remain part of the existing save snapshot and are also mirrored to a dedicated local preference key so accessibility choices survive new-game resets and save recovery.
