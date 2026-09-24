import Link from "next/link";
import type { ReactNode } from "react";
export function ToolFrame({title, description, note, children}:{title:string;description:string;note:string;children:ReactNode}) {
 return <main className="min-h-screen bg-[#080a10] px-5 py-7 text-white sm:px-10"><div className="mx-auto max-w-5xl">
 <div className="flex flex-wrap items-center justify-between gap-4"><Link href="/tools" className="text-sm text-white/55 hover:text-white">← All tools</Link><Link href="/" className="text-xs font-semibold tracking-[.23em] text-white/60">BODOLVO</Link></div>
 <p className="mt-14 text-xs uppercase tracking-[.3em] text-violet-300">Bodolvo / Utility</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1><p className="mt-4 max-w-2xl text-white/60">{description}</p>
 <div className="mt-9 rounded-2xl border border-white/10 bg-white/[.035] p-5 sm:p-8">{children}</div>
 <p className="mt-5 text-xs leading-relaxed text-white/45">{note}</p></div></main>;
}
