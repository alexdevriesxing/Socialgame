# Cloudflare Pages release and rollback runbook

## Production configuration

- Framework preset: None
- Root directory: repository root
- Build command: leave blank, or use `exit 0` if the dashboard requires a command
- Build output directory: `.`
- Environment variables: none for the static runtime
- Production branch: `main`

The repository root is the finished static artifact. `_headers` and `_redirects` must remain in that output directory so Cloudflare Pages can apply them. The `assets/anime/` directory is part of the release artifact and must be deployed without image transformation or path rewriting.

## Pre-deployment gate

1. Confirm the `Production browser QA` workflow is green on the exact PR head and exact merge commit.
2. Confirm `build-manifest.json` reports version `1.8.0`.
3. Confirm `assets/anime/manifest.json` reports version `1.8.0`, no procedural fallback and no external runtime dependency.
4. Confirm the QA artifact contains inventory, campaign, desktop, tablet, phone, offline and multi-engine evidence.
5. Confirm the PR is mergeable and contains no unresolved critical or high-severity issue.
6. Merge the v1.8 production PR into `main`.
7. Confirm the connected Cloudflare Pages project starts a production deployment for the new `main` commit. When the repository deployment workflow is used instead, confirm the workflow completes successfully with the same commit SHA.

## Production verification

After Cloudflare reports a successful production deployment:

1. Open the production URL in a private Chromium window.
2. Verify the title screen reports v1.8 and displays the permanent illustrated key art.
3. Inspect the network panel and confirm the five `assets/anime/*.webp` files and `assets/anime/manifest.json` return HTTP 200 from the production origin.
4. Start a new game and verify the expanded academy, visible classroom doors and seated class behavior.
5. Save, reload and continue the game.
6. Open Accessibility and verify all four settings pages.
7. Install or refresh the PWA, then reload once while offline.
8. Verify `/play`, `/game` and `/sakura-crest` redirect to `/`.
9. Inspect response headers for CSP, nosniff, frame denial, referrer policy and the service-worker cache policy.
10. Confirm no browser console errors or failed same-origin runtime requests.

## Rollback

Cloudflare Pages keeps deployment history. To roll back:

1. Open Workers & Pages in the Cloudflare dashboard.
2. Select the Sakura Crest Pages project and open Deployments.
3. Locate the last verified production deployment before v1.8.
4. Use the deployment menu to roll back or promote that deployment to production.
5. Verify the production URL and offline service worker after rollback.
6. Revert the release PR in GitHub or create a corrective branch so the repository once again matches production.

Because service workers can retain the newer shell, test rollback in a private window and perform one hard reload. The versioned cache removes old Sakura Crest caches when the selected worker activates.

## Save safety during rollback

v1.8 continues to write save version 10. Do not intentionally deploy an older runtime that rejects future save versions without first preserving the v1.8 branch. The v1.8 release can migrate all earlier saves, but substantially older releases are not guaranteed to read v10. If an emergency rollback is required, keep the v1.8 deployment available for players who need to recover or export current local progress.
