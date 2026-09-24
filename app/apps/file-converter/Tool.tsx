"use client";

import { useEffect, useState } from "react";

type Format = "image/png" | "image/jpeg" | "image/webp";
type Output = { name: string; url: string; original: number; converted: number };
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const EXT: Record<Format, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

function readable(bytes: number) {
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function safeName(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^\w. -]/g, "_").slice(0, 85) || "image";
}
async function convertOne(file: File, format: Format, maxEdge: number, quality: number): Promise<Output> {
  const sourceUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) throw new Error("The image has no readable dimensions.");
    const scale = maxEdge ? Math.min(1, maxEdge / Math.max(width, height)) : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser cannot create an image canvas.");
    if (format === "image/jpeg") {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, format, quality / 100));
    if (!blob || blob.type !== format) throw new Error("Your browser does not support this output format.");
    return { name: `${safeName(file.name)}.${EXT[format]}`, url: URL.createObjectURL(blob), original: file.size, converted: blob.size };
  } finally {
    URL.revokeObjectURL(sourceUrl);
  }
}

export function Tool() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<Format>("image/webp");
  const [maxEdge, setMaxEdge] = useState(0);
  const [quality, setQuality] = useState(85);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Output[]>([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  useEffect(() => () => { results.forEach(result => URL.revokeObjectURL(result.url)); }, [results]);
  const clearResults = () => { setResults([]); setProgress(""); };
  const choose = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const valid = incoming.filter(file => ACCEPTED.includes(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name));
    setFiles(valid.slice(0, 20));
    clearResults();
    setError(valid.length !== incoming.length ? "Unsupported files were skipped. Choose PNG, JPG, or WebP images." : incoming.length > 20 ? "Only the first 20 images were selected." : "");
  };
  const run = async () => {
    if (!files.length || busy) return;
    setBusy(true);
    setError("");
    clearResults();
    const completed: Output[] = [];
    const failures: string[] = [];
    for (const [index, file] of files.entries()) {
      setProgress(`Converting ${index + 1} of ${files.length}: ${file.name}`);
      try { completed.push(await convertOne(file, format, maxEdge, quality)); }
      catch { failures.push(file.name); }
    }
    setResults(completed);
    setProgress(`${completed.length} of ${files.length} image${files.length === 1 ? "" : "s"} converted.`);
    if (failures.length) setError(`Could not convert: ${failures.join(", ")}. Check that these images can be opened in your browser.`);
    setBusy(false);
  };
  const download = (result: Output) => {
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return <div className="space-y-6">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block text-sm text-white/70 sm:col-span-2">Choose up to 20 images (PNG, JPG, or WebP)
        <input type="file" multiple accept="image/png,image/jpeg,image/webp,.jpg,.jpeg,.png,.webp" onChange={event => choose(event.target.files)} className="mt-2 block w-full rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-violet-300 file:px-3 file:py-2 file:font-semibold file:text-black" />
      </label>
      <label className="block text-sm text-white/70">Output format
        <select value={format} onChange={event => { setFormat(event.target.value as Format); clearResults(); }} className="mt-2 w-full rounded-xl border border-white/20 bg-[#151622] p-3 text-white"><option value="image/webp">WebP</option><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select>
      </label>
      <label className="block text-sm text-white/70">Resize (preserves aspect ratio)
        <select value={maxEdge} onChange={event => { setMaxEdge(Number(event.target.value)); clearResults(); }} className="mt-2 w-full rounded-xl border border-white/20 bg-[#151622] p-3 text-white"><option value={0}>Original dimensions</option><option value={3840}>Max side: 3840 px</option><option value={1920}>Max side: 1920 px</option><option value={1280}>Max side: 1280 px</option><option value={800}>Max side: 800 px</option></select>
      </label>
      {format !== "image/png" && <label className="block text-sm text-white/70 sm:col-span-2">Output quality: {quality}%
        <input type="range" min={40} max={100} step={5} value={quality} onChange={event => { setQuality(Number(event.target.value)); clearResults(); }} className="mt-3 w-full accent-violet-300" />
      </label>}
    </div>
    {files.length > 0 && <p className="text-sm text-white/55">{files.length} image{files.length === 1 ? "" : "s"} selected · {readable(files.reduce((total, file) => total + file.size, 0))} total</p>}
    <button type="button" disabled={!files.length || busy} onClick={run} className="rounded-xl bg-violet-300 px-5 py-3 font-semibold text-black transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Converting…" : `Convert ${files.length || ""} image${files.length === 1 ? "" : "s"}`}</button>
    {progress && <p role="status" className="text-sm text-white/65">{progress}</p>}
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    {results.length > 0 && <div className="space-y-3"><h2 className="text-lg font-semibold">Ready to download</h2>{results.map((result, index) => <div key={`${result.name}-${index}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3"><div className="min-w-0"><p className="break-all text-sm font-medium">{result.name}</p><p className="text-xs text-white/50">{readable(result.original)} → {readable(result.converted)}</p></div><button type="button" onClick={() => download(result)} className="rounded-lg border border-violet-300/45 px-4 py-2 text-sm text-violet-200 hover:bg-white/10">Download</button></div>)}</div>}
    <p className="text-xs leading-relaxed text-white/45">Conversion happens on your device; images are not sent to Bodolvo servers. Transparent areas become white in JPG. Output size may be larger than the original; this is not a guaranteed compressor. Large images may exceed your device&apos;s available memory. Document, video, and audio conversion are not supported in this tool yet.</p>
  </div>;
}
