# Sakura Crest: Social Summit v1.7.0

Release date: 15 July 2026

## Release status

Sakura Crest v1.7.0 is the production-readiness release for the complete four-year campaign. It contains no known critical or high-severity defects in the validated repository build.

## Highlights

- Complete 48-month campaign for both boys' and girls' ranking ladders.
- Four complete club paths and three social-status difficulty modes.
- Diminishing-return ranking model that keeps long campaigns competitive without invalidating earned progress.
- Difficulty-specific monthly momentum retention and overnight recovery.
- Save format v10 with checksums, last-known-good backups, interrupted-write recovery, corrupted-save quarantine and repair of unsafe numeric values.
- Both Prom crown and non-crown endings validated for both ranking ladders.
- Original procedural music and effects, persistent accessibility preferences, remappable controls and scalable touch input.
- Fourteen walkable maps and thirteen illustrated district destinations retained without placeholder screens.
- Offline installation and reload through a versioned service worker cache.
- Hardened Cloudflare Pages headers, canonical entry redirects and reproducible rollback instructions.

## Balance targets

A committed playthrough can reach the final top two on Established, Ordinary or Outsider difficulty with any club and either ranking ladder. Passive play does not reach an elite ending automatically. Score sources now use caps or diminishing returns so multi-year friendship, club, activity and collection totals remain meaningful without creating unbounded ranking inflation.

## Save compatibility

Save versions 1 through 9 migrate to v10 when loaded. The current save is written through a temporary envelope and the prior valid envelope is retained as a backup. Invalid JSON, checksum mismatches and interrupted writes are recovered from the newest valid candidate when possible.

## Validation evidence

The release workflow runs:

- JavaScript syntax validation for every production and test script;
- release inventory and service-worker cache validation;
- complete static runtime regression;
- 24 deterministic 48-month campaign profiles;
- crown and non-crown ending reachability;
- save v1-v10 migration, tampering and recovery tests;
- 50,000 long-session score calculations;
- full Chromium visual, mobile, touch and offline regression;
- Chromium, Chrome, Edge, Firefox and WebKit desktop/mobile compatibility smoke tests.

## External release check

After merging, confirm the Cloudflare Pages production deployment against the checklist in `docs/cloudflare-release-runbook.md`. The repository can validate the deployable artifact and preview behavior; the production custom domain and Cloudflare account state remain external to GitHub Actions.