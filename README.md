# Sakura Crest: Social Summit — Immersive Foundations v1.2

This branch is the tested, no-build Cloudflare Pages release of Sakura Crest: Social Summit.

## v1.2 gameplay

- Eight segmented reputation dimensions and five circle-specific standing profiles
- Replayable lesson mastery for homeroom, mathematics, literature, PE and social studies
- Fifteen dynamic school stories with persistent choices and collectibles
- Recovery routes after failed exams, election defeats and attendance problems
- Living relationships with trust, respect, tension, moods, promises and group invitations
- Complete four-year / 48-chapter campaign, separate boys’ and girls’ ladders, clubs, exams, elections, prom and New Game+

The complete implementation plan through commercial v2.0 is in `MASTER_PRODUCTION_ROADMAP.md`.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **.**
- Root directory: repository root
- Environment variables: none

No Worker, package install, database, secret or external asset host is required.

## Validation

The embedded standalone payload is gzip-compressed and divided into immutable JavaScript chunks. `build-manifest.json` records the exact decompressed byte count and SHA-256. The branch workflow reconstructs and verifies it on every push and pull request.
