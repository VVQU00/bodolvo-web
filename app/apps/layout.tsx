import Link from "next/link";
import type { ReactNode } from "react";

export default function AppsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bodolvo-apps">
      <header className="site-header">
        <div className="site-width site-header-inner">
          <Link className="site-brand" href="/">BODOLVO</Link>
          <nav className="site-nav" aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/apps">Apps</Link>
            <Link href="/tools">Tools</Link>
            <Link href="/products">Products</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </header>
      <div className="app-page-content">{children}</div>
      <footer className="site-footer"><div className="site-width site-footer-inner">
        <span>© {new Date().getFullYear()} Bodolvo</span>
        <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      </div></footer>
    </div>
  );
}
