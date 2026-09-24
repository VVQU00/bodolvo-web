import Link from "next/link";
import SiteShell from "../_components/SiteShell";

export const metadata = { title: "Support | Bodolvo", description: "Help using Bodolvo tools." };

export default function SupportPage() {
  return <SiteShell>
    <section className="site-intro compact">
      <h1>Support</h1>
      <p>Having trouble using a tool? Try the steps below.</p>
    </section>
    <section className="help-section" aria-label="Troubleshooting">
      <h2>Tool not loading?</h2>
      <p>Refresh the page. If the issue continues, try an updated browser or another device.</p>
      <h2>Camera or location not working?</h2>
      <p>Check your browser permissions and device compatibility. Camera and location tools require permission and a secure connection (HTTPS or localhost).</p>
      <h2>Is a product available?</h2>
      <p>Check the <Link className="inline-link" href="/products">products directory</Link>. Products without an active website or download are labeled.</p>
      <h2>Need to contact support?</h2>
      <p>A public support contact or ticket system is not configured on this site yet.</p>
    </section>
  </SiteShell>;
}
