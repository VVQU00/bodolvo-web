import Link from "next/link";
import type { ReactNode } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
];

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="simple-site">
      <header className="site-header">
        <div className="site-width site-header-inner">
          <Link className="site-brand" href="/">BODOLVO</Link>
          <nav className="site-nav" aria-label="Main navigation">
            {navigation.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}
          </nav>
        </div>
      </header>
      <main className="site-width site-main">{children}</main>
      <footer className="site-footer"><div className="site-width site-footer-inner">
        <span>© {new Date().getFullYear()} Bodolvo</span>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div></footer>
    </div>
  );
}
