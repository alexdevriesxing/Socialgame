# Cloudflare Pages release and rollback runbook

## Production configuration

- Framework preset: None
- Root directory: repository root
- Build command: leave blank, or use `exit 0` if the dashboard requires a command
- Build output directory: `.`
- Environment variables: none
- Production branch: the branch selected by the repository owner after the stacked release PRs are merged

The repository root is the finished static artifact. `_headers` and `_redirects` must remain in that output directory so Cloudflare Pages can apply them.

## Pre-deployment gate

1. Confirm the `Production browser QA` workflow is green on the exact PR merge commit.
2. Confirm `build-manifest.json` reports version `1.7.0`.
3. Confirm the workflow artifact contains desktop, tablet, phone, offline and multi-engine evidence.
4. Confirm the PR is mergeable and contains no unresolved critical or high-severity issue.
5. Merge the stacked release branches in order, ending with the v1.7 release-readiness branch.

## Production verification

After Cloudflare reports a successful production deployment:

1. Open the production URL in a private Chromium window.
2. Verify the title screen reports v1.7 and the canvas is not blank.
3. Start a new game, save, reload and continue.
4. Open Accessibility and verify all four settings pages.
5. Install or refresh the PWA, then reload once while offline.
6. Verify `/play`, `/game` and `/sakura-crest` redirect to `/`.
7. Inspect response headers for CSP, nosniff, frame denial, referrer policy and the service-worker cache policy.
8. Confirm no browser console errors or failed same-origin runtime requests.

## Rollback

Cloudflare Pages keeps deployment history. To roll back:

1. Open Workers & Pages in the Cloudflare dashboard.
2. Select the Sakura Crest Pages project and open Deployments.
3. Locate the last verified production deployment before v1.7.
4. Use the deployment menu to roll back or promote that deployment to production.
5. Verify the production URL and offline service worker after rollback.
6. Revert the release PR in GitHub or create a corrective branch so the repository once again matches production.

Because service workers can retain the newer shell, test rollback in a private window and perform one hard reload. The versioned cache removes old Sakura Crest caches when the selected worker activates.

## Save safety during rollback

v1.7 writes save version 10. Do not intentionally deploy an older runtime that rejects future save versions without first preserving the v1.7 branch. The v1.7 release can migrate all earlier saves, but earlier releases are not guaranteed to read v10. If an emergency rollback is required, keep the v1.7 deployment available for players who need to recover or export their current local progress.