import Link from "next/link";
import { toolCatalog } from "@/lib/toolCatalog";
export const metadata = { title: "Tools | Bodolvo", description: "Bodolvo browser tools and previews." };
export default function ToolsIndex() {
  return <main className="min-h-screen bg-[#101114] px-5 py-8 text-white"><div className="mx-auto max-w-5xl"><Link href="/" className="text-sm underline underline-offset-4">← Home</Link><h1 className="mt-10 text-3xl font-bold">Tools</h1><p className="mt-3 text-[#c1c4ca]">Open a tool. Check its description for feature availability.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{toolCatalog.map((tool)=><Link key={tool.slug} href={`/apps/${tool.slug}`} prefetch={false} className="rounded-lg border border-white/15 bg-[#1a1c21] p-5 hover:border-white/50"><h2 className="font-semibold">{tool.name} ↗</h2><p className="mt-2 text-sm text-[#c1c4ca]">{tool.description}</p><p className="mt-3 text-xs text-[#a9adb5]">{tool.status}</p></Link>)}</div></div></main>;
}
