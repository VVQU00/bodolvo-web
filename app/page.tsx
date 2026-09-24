import Link from "next/link";
import SiteShell from "./_components/SiteShell";
import Directory from "./_components/Directory";
import { appItems, toolItems } from "@/lib/directory";

export default function Home() {
  return <SiteShell>
    <section className="site-intro">
      <h1>Tools that get the job done.</h1>
      <p>Find a tool, open it, and get to work. No unnecessary steps.</p>
      <div className="site-actions"><Link className="simple-button" href="/tools">Browse tools →</Link><Link className="simple-button secondary" href="/products">View products →</Link></div>
    </section>
    <section className="site-section" aria-labelledby="browse-title">
      <div className="section-head"><h2 id="browse-title">Browse Bodolvo</h2><p>Available apps and browser-based tool previews.</p></div>
      <Directory items={[...appItems, ...toolItems]} searchable />
    </section>
  </SiteShell>;
}
