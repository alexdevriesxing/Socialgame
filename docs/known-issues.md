# Sakura Crest v1.8 known issues and tradeoffs

## Severity summary

- Known critical defects: **0**
- Known high-severity defects: **0**
- Known progression blockers: **0** in the validated repository build

## Browser audio activation

Modern browsers may suspend Web Audio until the player clicks, taps or presses a key. Sakura Crest starts audio after user interaction and keeps every gameplay-relevant cue available through text, icons or status labels.

Severity: informational.

## Safari coverage

The release workflow validates WebKit desktop and mobile behavior as the automated Safari compatibility proxy. A final production-domain check on current physical Apple hardware remains part of the external deployment checklist because GitHub Actions does not run the branded Safari application or the owner's Cloudflare custom domain.

Severity: low operational risk.

## Save downgrade compatibility

Version 1.8 continues to write save format v10. The v1.8 runtime migrates all earlier save formats, but older game versions are not guaranteed to read v10 saves. Emergency rollback procedures therefore preserve access to the v1.8 deployment for progress recovery.

Severity: low operational risk.

## Local-device persistence

Progress is stored locally in the browser and is not synchronized between devices or browser profiles. Clearing site storage removes the main save, backup and recovery envelope from that browser.

Severity: expected product behavior.

## Permanent artwork delivery

The v1.8 artwork is stored locally under `assets/anime/` and cached by the versioned service worker. A first visit requires the browser to download the artwork before it becomes available offline; subsequent offline loads use the local cache.

Severity: expected product behavior.

## Production infrastructure verification

The repository validates the complete deployable static artifact, artwork digests, headers, redirects, service worker and browser behavior. The GitHub deployment workflow then submits the exact `main` artifact to Cloudflare Pages and verifies the deployed commit hash. Custom-domain DNS and certificate status remain Cloudflare account settings and should be checked after the first production deployment.

Severity: deployment checklist item.
