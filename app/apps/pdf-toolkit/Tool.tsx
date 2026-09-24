"use client";

import { useState } from "react";

type Mode = "merge" | "extract" | "remove" | "rotate" | "split" | "images";
const actions: { id: Mode; label: string }[] = [
  { id: "merge", label: "Merge PDFs" }, { id: "extract", label: "Extract pages" },
  { id: "remove", label: "Remove pages" }, { id: "rotate", label: "Rotate pages" },
  { id: "split", label: "Split into pages" }, { id: "images", label: "Images to PDF" },
];

function download(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function parsePages(raw: string, total: number): number[] {
  const pages = new Set<number>();
  for (const token of raw.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("Enter page numbers like 1, 3-5, 8.");
    const start = Number(match[1]); const end = match[2] ? Number(match[2]) : start;
    if (start < 1 || end > total || end < start) throw new Error(`Choose pages between 1 and ${total}.`);
    for (let page = start; page <= end; page++) pages.add(page - 1);
  }
  if (!pages.size) throw new Error("Enter at least one page.");
  return [...pages];
}
function imageData(file: File): Promise<{ bytes: ArrayBuffer; width: number; height: number; format: "jpg" | "png" }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        if (!img.naturalWidth || !img.naturalHeight) throw new Error("Invalid image dimensions.");
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Image conversion is unavailable in this browser.");
        context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
        canvas.toBlob(async blob => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) { reject(new Error("Could not process image.")); return; }
          resolve({ bytes: await blob.arrayBuffer(), width: canvas.width, height: canvas.height, format: "jpg" });
        }, "image/jpeg", 0.92);
      } catch (error) { URL.revokeObjectURL(objectUrl); reject(error); }
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error(`Couldn't open ${file.name}.`)); };
    img.src = objectUrl;
  });
}
export function Tool() {
  const [mode, setMode] = useState<Mode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState("1");
  const [degrees, setDegrees] = useState<90 | 180 | 270>(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const multi = mode === "merge" || mode === "images";
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(file => mode === "images" ? file.type.startsWith("image/") : file.type === "application/pdf" || /\.pdf$/i.test(file.name));
    setFiles(old => multi ? [...old, ...valid] : valid.slice(0, 1));
    setError(""); setSuccess("");
  };
  const process = async () => {
    if (!files.length) return;
    setBusy(true); setError(""); setSuccess("");
    try {
      const { PDFDocument, degrees: pdfDegrees } = await import("pdf-lib");
      if (mode === "images") {
        const result = await PDFDocument.create();
        for (const file of files) {
          const image = await imageData(file);
          const embedded = await result.embedJpg(image.bytes);
          const width = Math.min(595.28, image.width); const height = width * image.height / image.width;
          const scale = Math.min(1, 841.89 / height);
          const page = result.addPage([width * scale, height * scale]);
          page.drawImage(embedded, { x: 0, y: 0, width: width * scale, height: height * scale });
        }
        download(await result.save(), "bodolvo-images.pdf");
        setSuccess(`Created a ${files.length}-page PDF from your images.`);
      } else if (mode === "merge") {
        const result = await PDFDocument.create();
        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer());
          const pages = await result.copyPages(source, source.getPageIndices());
          pages.forEach(page => result.addPage(page));
        }
        if (!result.getPageCount()) throw new Error("The selected PDFs have no pages.");
        download(await result.save(), "bodolvo-merged.pdf");
        setSuccess(`Merged ${files.length} PDFs into ${result.getPageCount()} pages.`);
      } else {
        const source = await PDFDocument.load(await files[0].arrayBuffer());
        const total = source.getPageCount();
        if (!total) throw new Error("This PDF has no pages.");
        const base = files[0].name.replace(/\.pdf$/i, "");
        if (mode === "split") {
          if (total > 100) throw new Error("Split files of up to 100 pages at a time to avoid overwhelming your browser.");
          for (let i = 0; i < total; i++) {
            const output = await PDFDocument.create();
            const [page] = await output.copyPages(source, [i]); output.addPage(page);
            download(await output.save(), `${base}-page-${i + 1}.pdf`);
          }
          setSuccess(`Started ${total} page downloads. Your browser may ask permission for multiple downloads.`);
        } else if (mode === "rotate") {
          const selected = ranges.trim() ? parsePages(ranges, total) : source.getPageIndices();
          for (const index of selected) {
            const page = source.getPage(index);
            const rotation = page.getRotation().angle;
            page.setRotation(pdfDegrees((rotation + degrees) % 360));
          }
          download(await source.save(), `${base}-rotated.pdf`);
          setSuccess(`Rotated ${selected.length} page${selected.length === 1 ? "" : "s"}.`);
        } else {
          const selected = parsePages(ranges, total);
          const indices = mode === "remove" ? source.getPageIndices().filter(i => !selected.includes(i)) : selected;
          if (!indices.length) throw new Error("You cannot create a PDF with no pages.");
          const result = await PDFDocument.create();
          const copied = await result.copyPages(source, indices); copied.forEach(page => result.addPage(page));
          download(await result.save(), `${base}-${mode === "remove" ? "removed" : "pages"}.pdf`);
          setSuccess(`Saved a PDF with ${indices.length} pages.`);
        }
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't process this file."); }
    finally { setBusy(false); }
  };
  return <div className="space-y-5">
    <div className="flex flex-wrap gap-2" role="group" aria-label="PDF action">
      {actions.map(action => <button key={action.id} type="button" onClick={() => { setMode(action.id); setFiles([]); setRanges(action.id === "rotate" ? "" : "1"); setError(""); setSuccess(""); }} className={`rounded-lg border px-4 py-2 text-sm ${mode === action.id ? "border-violet-300 bg-violet-300 text-black" : "border-white/20 text-white"}`}>{action.label}</button>)}
    </div>
    <label className="block cursor-pointer rounded-xl border border-dashed border-white/30 p-7 text-center hover:border-violet-300">
      {mode === "images" ? "Choose images in the order you want them in the PDF" : multi ? "Choose PDFs to merge" : "Choose a PDF"}
      <input className="sr-only" type="file" accept={mode === "images" ? "image/*" : "application/pdf,.pdf"} multiple={multi} onChange={event => { addFiles(event.target.files); event.target.value = ""; }} />
    </label>
    {!!files.length && <div className="space-y-2" aria-label="Selected files">{files.map((file, index) => <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2 text-sm" key={`${file.name}-${index}`}><span className="min-w-0 break-all">{index + 1}. {file.name} <span className="text-white/45">({(file.size / 1048576).toFixed(2)} MB)</span></span><div className="flex shrink-0 gap-1">{multi && <><button type="button" disabled={!index} onClick={() => setFiles(old => { const next = [...old]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })} aria-label={`Move ${file.name} up`} className="px-2 disabled:opacity-30">↑</button><button type="button" disabled={index === files.length - 1} onClick={() => setFiles(old => { const next = [...old]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return next; })} aria-label={`Move ${file.name} down`} className="px-2 disabled:opacity-30">↓</button></>}<button type="button" onClick={() => setFiles(old => old.filter((_, i) => i !== index))} aria-label={`Remove ${file.name}`} className="px-2 text-red-200">Remove</button></div></div>)}</div>}
    {(["extract", "remove", "rotate"] as Mode[]).includes(mode) && <label className="block text-sm text-white/70">{mode === "rotate" ? "Pages to rotate (leave blank for all pages)" : mode === "remove" ? "Pages to remove" : "Pages to extract"} (for example: 1, 3-5, 8)<input value={ranges} onChange={event => setRanges(event.target.value)} className="mt-2 block w-full rounded-lg border border-white/20 bg-black/30 p-3 text-white" placeholder="1, 3-5" /></label>}
    {mode === "rotate" && <label className="block text-sm text-white/70">Rotation <select className="ml-3 rounded-lg border border-white/20 bg-neutral-900 p-2 text-white" value={degrees} onChange={event => setDegrees(Number(event.target.value) as 90 | 180 | 270)}><option value={90}>90° clockwise</option><option value={180}>180°</option><option value={270}>270° clockwise</option></select></label>}
    <button type="button" onClick={process} disabled={busy || !files.length || (mode === "merge" && files.length < 2)} className="rounded-lg bg-violet-300 px-5 py-3 font-semibold text-black disabled:opacity-40">{busy ? "Processing…" : `${actions.find(action => action.id === mode)?.label} & download`}</button>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}{success && <p role="status" className="text-sm text-green-200">{success}</p>}
    <p className="text-sm text-white/60">All processing stays in your browser. Password-protected PDFs may not open. Splitting may require permission for multiple downloads. Compression, electronic signing, and OCR are not included.</p>
  </div>;
}
