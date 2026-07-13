# Sakura Crest: Social Summit

A fully 2D, family-friendly anime high-school social simulation for the browser. The player follows a real class timetable, builds friendships, joins a club, competes on a separate boys' or girls' social ladder and tries to become Prom King or Prom Queen after four school years.

## Current playable systems

- Top-down school exploration with classrooms, hallways, library, courtyard, cafeteria and gym.
- Bell-driven schedule, attendance, late arrival dialogue, warnings, demerits and detention.
- Separate boys' and girls' social rankings with monthly finals.
- Ten recurring students, four teachers, relationships, branching dialogue and NPC routines.
- Daily missions, random school incidents, family-friendly bully situations and school hazards.
- Four-year / 48-month progression framework ending at prom.
- Local saving, keyboard controls, touch controls and original browser audio.

## Social status difficulty

Starting social status is the difficulty setting:

| Status | Difficulty | Effect |
|---|---|---|
| Established | Easy | Existing contacts, easier invitations and club promotion, softer penalties and lower rival pressure. |
| Ordinary | Normal | Neutral starting position and standard ranking pressure. |
| Outsider | Hard | Fewer initial connections, higher rumor risk, stronger rivals, tougher club gates and larger penalties. |

Status affects starting relationships, teacher trust, score gains and losses, rumor frequency, NPC ranking scores, invitation thresholds and club promotion requirements.

## Clubs

Choose one of four strategic long-term paths:

- **Skybound Athletics** — fitness, teamwork and sports competitions.
- **Velvet Bloom Arts** — performance, design and festival recognition.
- **Byte Brigade** — robotics, puzzles and technology tournaments.
- **Crest Council** — leadership, mediation and school-wide influence.

Each club has four ranks, XP, prestige, attendance reviews, a rival group, seasonal competitions and a leadership endpoint. Club prestige and wins contribute directly to the monthly social ranking.

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

Validation:

```bash
npm run check
```

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave empty
- Build output directory: `/`
- Root directory: repository root
- Environment variables: none required

The project is a dependency-free static site and can also run on GitHub Pages, Netlify or another static host.

## Project structure

```text
index.html              Static entry point
styles.css              Responsive game shell
src/main.js             Canvas engine, simulation, UI, rankings and saves
src/content.js          Schedule, NPCs, clubs, difficulty, events and dialogue
src/embedded-assets.js  Self-contained generated artwork payload
assets/                 Editable generated images in the downloadable project
scripts / tests         Validation and maintenance tooling
```

## Scope

The current branch contains the complete club and social-status difficulty architecture and the playable four-year progression framework. Bespoke story scenes, art and authored event chains for every individual month remain ongoing content-production work.

All characters, schools, clubs and conflicts are fictional and family friendly.
