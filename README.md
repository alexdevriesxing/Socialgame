# Sakura Crest: Social Summit

A fully 2D, family-friendly anime high-school social simulation for the browser. Follow a real class timetable, build relationships, join a club, compete on a separate boys' or girls' social ladder and aim to become Prom King or Prom Queen after four school years.

## Current playable systems

- Top-down school exploration with classrooms, hallways, library, courtyard, cafeteria and gym.
- Bell-driven schedule, attendance, lateness, teacher discipline, demerits and detention.
- Separate boys' and girls' social rankings with monthly finals.
- Social-status difficulty: Established, Ordinary and Outsider.
- Four club careers with ranks, XP, prestige, rivals and competitions.
- Ten recurring students, four teachers, relationships, branching dialogue and NPC routines.
- Daily missions, school incidents, family-friendly bully situations and hazards.
- Four-year / 48-month progression framework ending at prom.
- Local saving, keyboard controls, touch controls and original browser audio.

The full 48-month authored campaign and final crisp anime art replacement remain scheduled in the development roadmap.

## Local development

```bash
npm ci
npm run serve
```

Open `http://localhost:4173`. The serve command regenerates assets, builds `dist/` and serves the verified release output.

## Validation and release

```bash
npm run check
```

This runs syntax and content validation, save migration tests, initialization smoke tests, a reproducible release build, release verification and a static-server HTTP load of the HTML, modules, content, assets and build manifest. Browser verification remains part of final QA.

Build only:

```bash
npm run build
```

The deployable static site is created in `dist/` with an integrity manifest.

## Project structure

```text
assets/                    Generated baseline runtime art (created by the asset tool)
src/runtime/               Readable ordered runtime fragments assembled at build time
src/content.js             Compatibility barrel for declarative content
src/data/                  School, characters, activities, events and progression data
src/save.js                Versioned saves and legacy migration
tests/                     Unit, initialization and browser smoke tests
scripts/                   Syntax/content validation and release packaging
tools/generate_assets.py   Deterministic baseline art generation
docs/                      Architecture, design, roadmap and deployment documentation
```

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 20+
- Environment variables: none

See `docs/CLOUDFLARE_DEPLOYMENT.md` for verification and rollback instructions.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | WASD / Arrow keys | On-screen direction pad |
| Interact | E / Space | E button |
| Rankings | R | Rankings button |
| Schedule | Q | Schedule button |
| Sound | M | Sound button |
| Pause | Escape | — |

## Originality and safety

All included characters, schools, clubs and conflicts are fictional and family friendly.
