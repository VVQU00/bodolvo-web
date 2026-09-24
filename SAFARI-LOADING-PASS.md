# Safari initial-load pass

- Replaced optional Geist font fetching/preloading with system fonts in the shared layout to reduce initial resource work. This can slightly change typography.
- Added `/safari-check.html`, a static page without React, Next.js, or external resources. Compare its load time with the homepage on the same iPhone Safari browser. Its timing readout can help separate network/server wait from homepage work.
- Preserved other site routes and tools from the prior mobile-speed ZIP.
- This pass is a hypothesis-driven change, not proof of the 40-second cause; validate on the real device after deployment.
