# Bodolvo simple rebuild

Based on Bodolvo-web-Safari-loading-pass.zip. This pass replaces only the landing page and tool directory and adds an apps index. Existing individual app routes, configurations, package versions, and lockfile are retained.

- Homepage is a server component with no client-side animations, web fonts, or heavy decorative backgrounds.
- The homepage and directories use ordinary anchor-based Next.js links with prefetch disabled to avoid loading unrelated app routes while browsing.
- Directory lists web routes that exist in this source ZIP; it does not claim that external services or integrations have been production-tested.
- Existing application routes retain their previous implementations and may still need backend setup and separate performance work.

## Install in existing Git repo
Extract the archive, then copy the contents of its `bodolvo-web` folder over the root of the existing `bodolvo-web-deploy` repository. Do not delete your `.git` directory or `.env` files. Run `npm ci`, `npm run build`, test the homepage and app links locally, then commit and push when ready. This archive contains no node_modules or Git metadata.

## Safari diagnosis
A simplified page removes initial UI overhead, but cannot prove the cause of Safari's reported 40-second navigation. If the delay persists, compare a fresh Safari private tab and `/safari-check.html` on the same network, then inspect server response time and Safari network/website data. Do not treat the issue as fixed until measured on the affected iPhone.
