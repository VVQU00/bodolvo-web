import Link from "next/link";
import SiteShell from "../_components/SiteShell";

export const metadata = { title: "About | Bodolvo", description: "About Bodolvo and its apps and tools." };

export default function AboutPage() {
  return <SiteShell>
    <section className="site-intro compact">
      <h1>About Bodolvo</h1>
      <p>Bodolvo is a collection of practical digital tools and software. Choose a tool, use it, and get on with your day.</p>
      <p>Browse the tools available here or check the products directory for other Bodolvo projects.</p>
      <div className="site-actions"><Link className="simple-button" href="/tools">Browse tools</Link><Link className="simple-button secondary" href="/products">Products</Link></div>
    </section>
  </SiteShell>;
}
