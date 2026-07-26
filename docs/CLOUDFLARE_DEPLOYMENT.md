# Cloudflare Pages Deployment

## Recommended settings

- Framework preset: **None**
- Production branch: the accepted release branch
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js: 20 or newer
- Environment variables: none required

## Verification before deployment

```bash
npm ci
npm run check
```

`npm run check` regenerates the baseline assets, validates JavaScript syntax and declarative content, tests save migrations and runtime initialization, verifies the release manifest and performs a static HTTP load of the produced site. Browser-matrix verification is performed in release QA because local Chromium is restricted in the authoring environment.

## Rollback

Cloudflare Pages retains previous deployments. If a release fails after deployment, select the last verified deployment and choose **Rollback to this deployment**. The release package is deterministic: identical source and assets produce identical runtime files and integrity hashes.
