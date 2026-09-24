"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type DirectoryItem = { title: string; description: string; href?: string; category: string; note?: string };

export default function Directory({ items, searchable = false }: { items: DirectoryItem[]; searchable?: boolean }) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => items.filter((item) =>
    `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [items, query]);
  return <>
    {searchable && <div className="search-row"><label htmlFor="directory-search">Find a tool or product</label>
      <input id="directory-search" type="search" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Bodolvo…" />
    </div>}
    <div className="directory-grid">
      {visible.map((item) => <article className="directory-item" key={`${item.category}:${item.title}`}>
        <p className="directory-category">{item.category}</p>
        <h3>{item.title}</h3><p>{item.description}</p>
        {item.note && <p className="directory-note">{item.note}</p>}
        {item.href ? <Link className="simple-button" href={item.href}>Open {item.title}<span aria-hidden="true"> →</span></Link>
          : <span className="unavailable">Not available on this website yet</span>}
      </article>)}
    </div>
    {visible.length === 0 && <p role="status">No matches. Try a different search.</p>}
  </>;
}
