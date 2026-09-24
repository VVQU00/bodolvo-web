# Bodolvo Tools — Pass 09: Browser-to-browser media remote

Visit `/apps/remote-control` on the viewer and phone. On the viewer, select a video. On the phone, select Remote and generate an offer. Copy the offer to the viewer, accept it, copy the viewer's answer to the phone, and complete pairing. Playback controls appear on the phone when connected.

**Scope:** Controls only an HTML video playing within the Bodolvo viewer page, not any system-wide player, smart-TV interface, PC desktop, Xbox, or PlayStation. The user must explicitly accept pairing on the viewer. Browsers may block initiating playback until the user first taps Play on the viewer. Direct WebRTC connections may fail behind some networks/firewalls; there is no relay service in this pass. Both devices need HTTPS in production. Video files remain on the viewer device. The pairing exchange can disclose network information; share it privately. No server credentials or keys required.

Run `npm run dev` and `npm run build` before deployment.
