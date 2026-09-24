import Link from "next/link";
import { toolCatalog } from "@/lib/toolCatalog";
export const metadata = { title: "Tools | Bodolvo", description: "Free browser-based everyday tools from Bodolvo." };
export default function ToolsIndex() {
  return <main className="min-h-screen bg-[#080a10] px-5 py-10 text-white sm:px-10">
    <div className="mx-auto max-w-6xl"><Link href="/" className="text-sm text-white/60 hover:text-white">← Bodolvo</Link>
      <p className="mt-14 text-xs uppercase tracking-[.3em] text-violet-300">Bodolvo utilities</p>
      <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">Your everyday toolkit.</h1>
      <p className="mt-5 max-w-2xl text-white/55">Seven new browser-first tools. Some features are ready to try; others are being developed. No account is required for these previews.</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{toolCatalog.map((tool)=><Link key={tool.slug} href={`/apps/${tool.slug}`} className="group min-h-48 rounded-2xl border border-white/10 bg-white/[.035] p-6 backdrop-blur-xl transition hover:border-violet-300/40 hover:bg-white/[.07]">
        <span className="text-xs uppercase tracking-widest text-violet-300/80">Utility / {tool.slug.replaceAll('-', ' ')}</span>
        <h2 className="mt-8 text-2xl font-medium">{tool.name} <span className="inline-block text-white/35 transition group-hover:translate-x-1">↗</span></h2>
        <p className="mt-2 text-sm text-white/50">{tool.description}</p>
      </Link>)}</div>
    </div></main>;
}
