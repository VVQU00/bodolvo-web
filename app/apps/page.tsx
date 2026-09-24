import Link from "next/link";
import { apps } from "@/lib/siteDirectory";
export const metadata = { title: "Apps | Bodolvo", description: "Bodolvo web apps." };
export default function AppsIndex() {
  return <main className="min-h-screen bg-[#101114] px-5 py-8 text-white"><div className="mx-auto max-w-5xl"><Link href="/" className="text-sm underline underline-offset-4">← Home</Link><h1 className="mt-10 text-3xl font-bold">Apps</h1><p className="mt-3 text-[#c1c4ca]">Choose an app to open.</p><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{apps.map((app)=><Link href={app.href} prefetch={false} key={app.href} className="rounded-lg border border-white/15 bg-[#1a1c21] p-5 hover:border-white/50"><h2 className="font-semibold">{app.name} ↗</h2><p className="mt-2 text-sm leading-6 text-[#c1c4ca]">{app.description}</p></Link>)}</div></div></main>;
}
