import Link from "next/link";
import SiteShell from "../_components/SiteShell";
export const metadata = { title: "Bodolvo Live | Bodolvo" };
export default function LivePage() { return <SiteShell><section className="site-intro compact"><h1>Bodolvo Live</h1><p>In development. A live streaming service is not available on this website yet.</p><Link className="simple-button" href="/products">All products →</Link></section></SiteShell>; }
