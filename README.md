# Sakura Crest: Social Summit

A fully 2D, family-friendly anime high-school social simulation built as a browser-first vertical slice with original 16-bit-inspired pixel art.

## Playable vertical slice

The current build includes:

- A top-down, explorable school with classrooms, hallway, library, courtyard, cafeteria and gym.
- Original pixel-art student sprites, teacher sprites, portraits, school map, UI icons and title key art.
- Separate boys' and girls' social rankings.
- A real bell-driven timetable with required rooms, grace periods, attendance and lateness.
- Teacher discipline conversations, warnings, demerits and after-school detention.
- Ten recurring student NPCs, four teachers, distinct school circles and relationship progression.
- Dialogue choices that affect charisma, intellect, fitness, talent, kindness, courage, reliability, stress and social score.
- Class activities for homeroom, mathematics, literature, physical education, club period, social studies and closing homeroom.
- Non-violent bully situations, rumors, fire drills, storms, leaks, blackouts and a missing mascot prop.
- Daily missions, energy/stress management, local saving and monthly ranking finals.
- A progression structure for 4 years × 12 months, ending at prom.
- Desktop and touch controls plus lightweight original chiptune-style Web Audio.

This is a **vertical slice**, not yet the complete 48-month commercial game. The long-term calendar and ending are wired, while later months still need their own environments, story arcs, competitions and bespoke dialogue.

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

No build step is required.

```bash
python -m http.server 4173
```

Open `http://localhost:4173`.

Validation:

```bash
npm run check
```

## Project structure

```text
assets/              Generated game art and sprite sheets
src/content.js       NPCs, classes, schedules, events, missions and dialogue
src/main.js          Canvas engine, simulation, UI, ranking and save systems
tools/generate_assets.py  Reproducible pixel-art generation pipeline
docs/                Game design, art bible and expansion roadmap
```

## Deployment

The project is static and can be deployed directly to Cloudflare Pages, GitHub Pages, Netlify or any static host. For Cloudflare Pages, use the repository root as the output directory and leave the build command empty.

## Originality and safety

All included art and writing were created specifically for this project. The game uses fictional students, fictional school circles and family-friendly, non-violent conflict resolution.
