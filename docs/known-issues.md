# Sakura Crest v1.7 known issues and tradeoffs

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

Version 1.7 writes save format v10. The v1.7 runtime migrates all earlier save formats, but older game versions are not guaranteed to read v10 saves. Emergency rollback procedures therefore preserve access to the v1.7 deployment for progress recovery.

Severity: low operational risk.

## Local-device persistence

Progress is stored locally in the browser and is not synchronized between devices or browser profiles. Clearing site storage removes the main save, backup and recovery envelope from that browser.

Severity: expected product behavior.

## Production infrastructure verification

The repository validates the complete deployable static artifact, headers, redirects, service worker and browser behavior. The final custom-domain certificate, DNS, Cloudflare Pages project settings and promoted production deployment must be checked in the Cloudflare account after merge using `docs/cloudflare-release-runbook.md`.

Severity: deployment checklist item.