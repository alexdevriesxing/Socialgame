# Production Architecture

## Canonical source

The readable files in the repository root are the only canonical implementation. The game no longer depends on generated JavaScript payload chunks or runtime decompression.

- `index.html` and `styles.css` provide the static shell.
- `src/runtime/` contains ordered, readable runtime fragments grouped by responsibility. The release builder assembles them into `dist/src/main.js` as one browser module.
- `src/content.js` is a compatibility barrel for declarative content modules.
- `src/data/` separates school, characters, activities, events and progression data.
- `src/save.js` owns the versioned save envelope and migrations.
- `tools/generate_assets.py` deterministically creates the current baseline PNG atlases in `assets/`; those generated placeholders are intentionally not canonical and are replaced by final production art in Pass 2.
- `scripts/` validates source/content and creates the release directory.
- `tests/` covers initialization, save migration and static HTTP loading.

## Release flow

`npm run build` regenerates baseline assets, assembles the ordered runtime fragments, and recreates `dist/` from canonical runtime inputs and writes `dist/build-manifest.json` with SHA-256 hashes. `npm run verify:release` rejects compressed legacy chunks, missing runtime files and incomplete manifests.

Cloudflare Pages should run `npm run build` and publish `dist`.

## Save compatibility

Save files use the canonical key `sakura-crest-social-summit` and an envelope containing `version`, `savedAt` and `data`. The loader also recognizes the original `sakura-crest-social-summit-v1` key and migrates it to version 2.

## Content expansion

New authored content should be added to the relevant file under `src/data/`. The content validator checks IDs, references, room mappings, schedule order, club prompts and baseline content counts before release.
