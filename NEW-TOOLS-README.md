# Bodolvo seven-tool pass 01

Seven routes: /tools, /apps/pdf-toolkit, /apps/file-converter, /apps/digital-measure, /apps/compass, /apps/magnifier, /apps/media-toolkit, /apps/remote-control.

Implemented now: tools directory and routing; local image PNG/JPEG/WebP conversion; camera previews and reference-based manual measurement estimator; sensor orientation/location on supported devices; camera digital magnifier with freeze/save; local audio/video preview; PDF file staging; remote device-type UI. The PDF processor, broader file conversions, true camera AR measurement, media editing and device pairing are **not** implemented. Do not market them as functioning until tested and built.

Extract this archive over a BACKUP COPY of your existing project root. It is a complete source snapshot excluding .env files and node_modules. Keep your local .env.local; never upload it. Run `npm install` and `npm run build` from the project root. Browser cameras/sensors require HTTPS or localhost and device permission. On iOS, orientation permission may require a direct button tap. A native app may eventually be necessary for some capabilities.
