# Bodolvo tools — pass 03

PDF Toolkit now supports merging multiple PDFs (with reorder and remove) and extracting selected pages into a downloadable PDF. Runs locally in the browser using `pdf-lib`. Compression, signing, and individual-per-page split are not implemented yet.

## Install

Back up your current project, then extract this ZIP over the project root (the ZIP contains a `bodolvo-web` folder). **Run `npm install`** to install the new `pdf-lib` dependency and update `package-lock.json`, then `npm run dev` and visit `/apps/pdf-toolkit`. Do not copy stale `node_modules` from another project.

The existing Apps and Tools dropdowns remain as in pass 02. No environment secrets are included intentionally.
