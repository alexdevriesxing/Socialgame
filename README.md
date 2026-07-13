# Sakura Crest: Social Summit

A fully 2D, family-friendly anime high-school social simulation built as a browser-first vertical slice with original 16-bit-inspired pixel art.

## Playable vertical slice

The current build includes:

- A top-down, explorable school with homeroom, mathematics and literature classrooms, hallway, library, courtyard, cafeteria and gym.
- Original pixel-art student sprites, teacher sprites, portraits, school map, UI icons and title key art.
- Separate boys' and girls' social rankings.
- A real bell-driven class timetable with required rooms, grace periods, attendance checks and lateness.
- Rich teacher discipline conversations, warnings, demerits, reliability loss, parent-note risk and after-school detention.
- Ten recurring student NPCs, four teachers, distinct school circles and relationship progression.
- Dialogue choices affecting charisma, intellect, fitness, talent, kindness, courage, reliability, stress and social score.
- Class activities for homeroom, mathematics, literature, physical education, club period, social studies and closing homeroom.
- Non-violent bully situations, rumors, fire drills, storms, leaks, blackouts and a missing mascot prop.
- Daily missions, energy/stress management, local saving and monthly ranking finals.
- A progression structure for 4 years × 12 months, ending at prom.
- Desktop and touch controls plus lightweight original chiptune-style Web Audio.

This is a **vertical slice**, not yet the complete 48-month commercial game. The four-year calendar, simulation framework and prom ending are wired; later months still require bespoke environments, story arcs, competitions, dialogue and seasonal art.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | WASD / Arrow keys | On-screen direction pad |
| Interact | E / Space | E button |
| Rankings | R | Rankings button |
| Schedule | Q | Schedule button |
| Sound | M | Sound button |
| Pause | Escape | — |

## Run locally

No build step is required:

```bash
python -m http.server 4173
```

Open `http://localhost:4173`.

## Repository build format

The branch contains a static, self-contained commercial-demo build. `index.html` reconstructs the complete game at runtime from `part-0.js` through `part-9.js`; those files contain the compressed HTML, CSS, JavaScript, dialogue data and original artwork. This keeps the deployment dependency-free and compatible with static hosting.

The editable development package is maintained separately and contains modular source, uncompressed generated assets, the reproducible pixel-art generator, tests, game design documents, art bible and content roadmap.

## Deployment

Deploy the repository root directly to Cloudflare Pages, GitHub Pages, Netlify or another static host. No build command or environment variables are required.

## Validation

The development source passed JavaScript syntax checks and a custom DOM/canvas smoke test. The compressed deployment payload was also reconstructed and compared byte-for-byte with the validated standalone build.

Automated Chromium visual verification could not run in the authoring environment because local browser navigation was blocked by an administrator policy; this limitation is documented rather than hidden.

## Originality and safety

All included art and writing were created specifically for this project. The game uses fictional students, a fictional academy and family-friendly, non-violent conflict resolution.
