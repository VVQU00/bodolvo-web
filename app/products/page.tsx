import SiteShell from "../_components/SiteShell";
import Directory from "../_components/Directory";
import { productItems } from "@/lib/directory";

export const metadata = { title: "Products | Bodolvo", description: "Bodolvo products and their current availability." };

export default function ProductsPage() {
  return <SiteShell>
    <section className="site-intro compact">
      <h1>Products</h1>
      <p>See what Bodolvo offers and what is currently available. Products without an active website or download are clearly marked.</p>
    </section>
    <Directory items={productItems} searchable />
  </SiteShell>;
}
