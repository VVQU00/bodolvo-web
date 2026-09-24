import Link from "next/link";
import type { ReactNode } from "react";
export function ToolFrame({title, description, note, children}:{title:string;description:string;note:string;children:ReactNode}) {
 return <main className="tool-page site-width">
   <nav className="tool-breadcrumb" aria-label="Tool navigation"><Link href="/tools">← All tools</Link></nav>
   <h1>{title}</h1><p className="tool-description">{description}</p>
   <section className="tool-workspace">{children}</section>
   <p className="tool-note">{note}</p>
 </main>;
}
