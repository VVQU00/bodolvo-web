import Link from "next/link";
import { apps, siteLinks } from "@/lib/siteDirectory";

export const metadata = {
  title: "Bodolvo | Apps and tools",
  description: "Quick access to Bodolvo apps, tools, and projects.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#101114] text-[#f5f5f5]">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link href="/" className="text-lg font-bold tracking-wide">BODOLVO</Link>
          <nav aria-label="Main navigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/apps" className="hover:underline">Apps</Link>
            <Link href="/tools" className="hover:underline">Tools</Link>
            <Link href="/products" className="hover:underline">Products</Link>
            <Link href="/support" className="hover:underline">Support</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">Apps and tools. Nothing in the way.</h1>
        <p className="mt-4 max-w-2xl text-base text-[#c1c4ca]">Open what you need, get things done, and move on.</p>
        <section aria-labelledby="apps-heading" className="mt-12">
          <div className="mb-4 flex items-center justify-between gap-4"><h2 id="apps-heading" className="text-xl font-semibold">Web apps</h2><Link href="/apps" className="text-sm underline underline-offset-4">View all</Link></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => <Link key={app.href} href={app.href} prefetch={false} className="block rounded-lg border border-white/15 bg-[#1a1c21] p-5 hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><h3 className="font-semibold">{app.name} <span aria-hidden="true">↗</span></h3><p className="mt-2 text-sm leading-6 text-[#bfc2c9]">{app.description}</p></Link>)}
          </div>
        </section>
        <section aria-labelledby="explore-heading" className="mt-12">
          <h2 id="explore-heading" className="mb-4 text-xl font-semibold">Explore Bodolvo</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {siteLinks.map((item) => <Link key={item.href} href={item.href} prefetch={false} className="block rounded-lg border border-white/15 p-5 hover:border-white/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><h3 className="font-semibold">{item.name} <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm text-[#bfc2c9]">{item.description}</p></Link>)}
          </div>
        </section>
      </div>
      <footer className="mx-auto max-w-5xl border-t border-white/10 px-5 py-6 text-sm text-[#bfc2c9]"><Link href="/about" className="mr-5 hover:underline">About</Link><Link href="/privacy" className="mr-5 hover:underline">Privacy</Link><Link href="/terms" className="hover:underline">Terms</Link></footer>
    </main>
  );
}
