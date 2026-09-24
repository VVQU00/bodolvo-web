"use client";

import { useState } from "react";

type Mode = "merge" | "extract";

function download(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function parsePages(raw: string, total: number): number[] {
  const pages = new Set<number>();
  for (const token of raw.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("Enter page numbers like 1, 3-5, 8.");
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : start;
    if (start < 1 || end > total || end < start || end - start > total) {
      throw new Error(`Choose pages between 1 and ${total}, in ascending ranges.`);
    }
    for (let page = start; page <= end; page++) pages.add(page - 1);
  }
  if (!pages.size) throw new Error("Enter at least one page.");
  return [...pages];
}

export function Tool() {
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState("1");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    setFiles(old => [...old, ...Array.from(incoming).filter(file => file.type === "application/pdf" || /\.pdf$/i.test(file.name))]);
    setError("");
    setSuccess("");
  };

  const process = async () => {
    if (!files.length) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      // Loaded on demand so the PDF engine is not shipped with the directory page.
      const { PDFDocument } = await import("pdf-lib");
      if (mode === "merge") {
        const result = await PDFDocument.create();
        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer());
          const pages = await result.copyPages(source, source.getPageIndices());
          pages.forEach(page => result.addPage(page));
        }
        if (!result.getPageCount()) throw new Error("The selected PDFs have no pages.");
        download(await result.save(), "bodolvo-merged.pdf");
        setSuccess(`Merged ${files.length} PDF${files.length === 1 ? "" : "s"} into ${result.getPageCount()} pages.`);
      } else {
        const source = await PDFDocument.load(await files[0].arrayBuffer());
        const pages = parsePages(ranges, source.getPageCount());
        const result = await PDFDocument.create();
        const copied = await result.copyPages(source, pages);
        copied.forEach(page => result.addPage(page));
        download(await result.save(), `${files[0].name.replace(/\.pdf$/i, "")}-pages.pdf`);
        setSuccess(`Saved ${pages.length} selected page${pages.length === 1 ? "" : "s"}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't process this PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="PDF action">
        {(["merge", "extract"] as const).map(action => (
          <button key={action} type="button" onClick={() => { setMode(action); setFiles([]); setError(""); setSuccess(""); }}
            className={`rounded-lg border px-4 py-2 text-sm ${mode === action ? "border-violet-300 bg-violet-300 text-black" : "border-white/20 text-white"}`}>
            {action === "merge" ? "Merge PDFs" : "Extract pages"}
          </button>
        ))}
      </div>
      <label className="block cursor-pointer rounded-xl border border-dashed border-white/30 p-7 text-center hover:border-violet-300">
        {mode === "merge" ? "Choose PDFs to merge" : "Choose a PDF"}
        <input className="sr-only" type="file" accept="application/pdf,.pdf" multiple={mode === "merge"} onChange={event => { addFiles(event.target.files); event.target.value = ""; }} />
      </label>
      {files.length > 0 && <div className="space-y-2" aria-label="Selected PDF files">
        {files.map((file, index) => <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2 text-sm" key={`${file.name}-${index}`}>
          <span className="min-w-0 break-all">{index + 1}. {file.name} <span className="text-white/45">({(file.size / 1048576).toFixed(2)} MB)</span></span>
          <div className="flex shrink-0 gap-1">
            {mode === "merge" && <><button disabled={index === 0} onClick={() => setFiles(old => { const next = [...old]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })} aria-label={`Move ${file.name} up`} className="px-2 disabled:opacity-30">↑</button><button disabled={index === files.length - 1} onClick={() => setFiles(old => { const next = [...old]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return next; })} aria-label={`Move ${file.name} down`} className="px-2 disabled:opacity-30">↓</button></>}
            <button onClick={() => setFiles(old => old.filter((_, i) => i !== index))} aria-label={`Remove ${file.name}`} className="px-2 text-red-200">Remove</button>
          </div>
        </div>)}
      </div>}
      {mode === "extract" && <label className="block text-sm text-white/70">Pages to extract (for example: 1, 3-5, 8)<input value={ranges} onChange={event => setRanges(event.target.value)} className="mt-2 block w-full rounded-lg border border-white/20 bg-black/30 p-3 text-white" placeholder="1, 3-5" /></label>}
      <button onClick={process} disabled={busy || (mode === "extract" ? files.length !== 1 : files.length < 2)} className="rounded-lg bg-violet-300 px-5 py-3 font-semibold text-black disabled:opacity-40">{busy ? "Processing…" : mode === "merge" ? "Merge & download" : "Extract & download"}</button>
      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
      {success && <p role="status" className="text-sm text-green-200">{success}</p>}
      <p className="text-sm text-white/60">PDF processing stays in your browser. Password-protected or damaged PDFs may not open. Large documents may take longer on mobile. Compression and signing are planned for a later pass.</p>
    </div>
  );
}
