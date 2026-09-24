"use client";

import { useState } from "react";

type Mode = "merge" | "extract" | "remove" | "rotate" | "split" | "images" | "reorder" | "pdf-images" | "compress" | "sign" | "watermark";
const actions: { id: Mode; label: string }[] = [
  { id: "merge", label: "Merge PDFs" }, { id: "extract", label: "Extract pages" },
  { id: "remove", label: "Remove pages" }, { id: "rotate", label: "Rotate pages" },
  { id: "split", label: "Split into pages" }, { id: "images", label: "Images to PDF" },
  { id: "reorder", label: "Reorder pages" }, { id: "pdf-images", label: "PDF to images" },
  { id: "compress", label: "Optimize PDF" },
  { id: "sign", label: "Add signature" }, { id: "watermark", label: "Add watermark" },
];

function download(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function parseOrder(raw: string, total: number): number[] {
  const entries = raw.split(",").map(part => part.trim());
  if (entries.length !== total || entries.some(entry => !/^\d+$/.test(entry))) {
    throw new Error(`Enter all ${total} page numbers once, separated by commas.`);
  }
  const indices = entries.map(entry => Number(entry) - 1);
  if (indices.some(index => index < 0 || index >= total) || new Set(indices).size !== total) {
    throw new Error(`Use each page number from 1 to ${total} exactly once.`);
  }
  return indices;
}
function parsePages(raw: string, total: number): number[] {
  const pages = new Set<number>();
  for (const token of raw.split(",")) {
    const match = token.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error("Enter page numbers like 1, 3-5, 8.");
    const start = Number(match[1]); const end = match[2] ? Number(match[2]) : start;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 1 || start > total || end > total || end < start) throw new Error(`Choose pages between 1 and ${total}.`);
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
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePage, setSignaturePage] = useState("1");
  const [signatureWidth, setSignatureWidth] = useState("160");
  const [signatureX, setSignatureX] = useState("20");
  const [signatureY, setSignatureY] = useState("20");
  const [watermarkText, setWatermarkText] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageFormat, setImageFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(0.78);
  const [compression, setCompression] = useState<"lossless" | "raster">("lossless");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const multi = mode === "merge" || mode === "images";
  const addFiles = (incoming: FileList | null) => {
    if (!incoming || busy) return;
    const all = Array.from(incoming);
    const valid = all.filter(file => file.size > 0 && (mode === "images"
      ? /^(image\/(png|jpeg|webp))$/.test(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name)
      : file.type === "application/pdf" || /\.pdf$/i.test(file.name)));
    if (!valid.length) {
      setError(mode === "images" ? "Choose a nonempty PNG, JPG, or WebP image." : "Choose a nonempty PDF file.");
      return;
    }
    setFiles(old => multi ? [...old, ...valid] : valid.slice(0, 1));
    setPageCount(null);
    setSignatureFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (!multi && valid[0]) {
      const chosen = valid[0];
      setPreviewUrl(URL.createObjectURL(chosen));
      void (async () => {
        try {
          const { PDFDocument } = await import("pdf-lib");
          const pdf = await PDFDocument.load(await chosen.arrayBuffer());
          setPageCount(pdf.getPageCount());
          setSignaturePage("1");
          setRanges(mode === "reorder" ? pdf.getPageIndices().map(i => i + 1).join(", ") : mode === "rotate" ? "" : "1");
        } catch { setPageCount(null); }
      })();
    }
    setError(all.length !== valid.length ? `${all.length - valid.length} unsupported or empty file(s) were skipped.` : "");
    setSuccess("");
  };
  const process = async () => {
    if (busy || !files.length) return;
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
        if (mode === "sign") {
          if (!signatureFile) throw new Error("Choose a signature image (PNG or JPG).");
          const pageNumber = Number(signaturePage);
          if (!Number.isSafeInteger(pageNumber) || pageNumber < 1 || pageNumber > total) throw new Error(`Choose a page between 1 and ${total}.`);
          if (!/\.(png|jpe?g)$/i.test(signatureFile.name) && !["image/png", "image/jpeg"].includes(signatureFile.type)) throw new Error("Choose a PNG or JPG signature image.");
          const data = await signatureFile.arrayBuffer();
          const image = (signatureFile.type === "image/png" || /\.png$/i.test(signatureFile.name)) ? await source.embedPng(data) : await source.embedJpg(data);
          const width = Number(signatureWidth), x = Number(signatureX), y = Number(signatureY);
          if (![width, x, y].every(Number.isFinite) || width <= 0 || x < 0 || y < 0) throw new Error("Enter valid positive signature dimensions and nonnegative coordinates.");
          const page = source.getPage(pageNumber - 1);
          const height = width * image.height / image.width;
          if (x + width > page.getWidth() || y + height > page.getHeight()) throw new Error(`Signature is outside the page. Page size: ${Math.round(page.getWidth())} × ${Math.round(page.getHeight())} points.`);
          page.drawImage(image, { x, y, width, height });
          download(await source.save(), `${base}-signed.pdf`);
          setSuccess("Added the visual signature and downloaded your PDF. This is not a certificate-backed digital signature.");
        } else if (mode === "watermark") {
          const label = watermarkText.trim();
          if (!label || label.length > 100) throw new Error("Enter watermark text (1–100 characters).");
          const { StandardFonts, rgb } = await import("pdf-lib");
          const font = await source.embedFont(StandardFonts.Helvetica);
          for (const page of source.getPages()) {
            const size = Math.max(12, Math.min(48, page.getWidth() / Math.max(10, label.length * 0.6)));
            page.drawText(label, { x: 20, y: Math.max(8, page.getHeight() / 2), size, font, color: rgb(0.45, 0.45, 0.45), opacity: 0.3 });
          }
          download(await source.save(), `${base}-watermarked.pdf`);
          setSuccess(`Added a text watermark to ${total} page${total === 1 ? "" : "s"}.`);
        } else if (mode === "pdf-images") {
          const pdfjs = await import("pdfjs-dist");
          pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
          const task = pdfjs.getDocument({ data: new Uint8Array(await files[0].arrayBuffer()) });
          const pdf = await task.promise;
          const archive = new (await import("jszip")).default();
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.6 });
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
            const context = canvas.getContext("2d");
            if (!context) throw new Error("Canvas is not supported in this browser.");
            context.fillStyle = "white"; context.fillRect(0, 0, canvas.width, canvas.height);
            await page.render({ canvas, canvasContext: context, viewport }).promise;
            const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Could not render page.")), `image/${imageFormat}`, imageFormat === "jpeg" ? 0.9 : undefined));
            archive.file(`${base}-page-${String(pageNum).padStart(3, "0")}.${imageFormat === "jpeg" ? "jpg" : "png"}`, blob);
            page.cleanup();
          }
          await task.destroy();
          downloadBlob(await archive.generateAsync({ type: "blob", compression: "DEFLATE" }), `${base}-images.zip`);
          setSuccess(`Exported ${pdf.numPages} page images in one ZIP.`);
        } else if (mode === "compress") {
          if (compression === "lossless") {
            const before = files[0].size;
            const output = await source.save({ useObjectStreams: true, addDefaultPage: false });
            if (output.length >= before) {
              throw new Error("This PDF cannot be made smaller with lossless optimization. No modified file was downloaded.");
            }
            download(output, `${base}-optimized.pdf`);
            setSuccess(`Reduced size from ${(before / 1048576).toFixed(2)} MB to ${(output.length / 1048576).toFixed(2)} MB without rasterizing pages.`);
          } else {
            const pdfjs = await import("pdfjs-dist");
            pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
            const task = pdfjs.getDocument({ data: new Uint8Array(await files[0].arrayBuffer()) });
            const pdf = await task.promise;
            const result = await PDFDocument.create();
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page = await pdf.getPage(pageNum);
              const original = page.getViewport({ scale: 1 });
              const viewport = page.getViewport({ scale: 1.25 });
              const canvas = document.createElement("canvas");
              canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
              const context = canvas.getContext("2d");
              if (!context) throw new Error("Canvas is not supported in this browser.");
              context.fillStyle = "white"; context.fillRect(0, 0, canvas.width, canvas.height);
              await page.render({ canvas, canvasContext: context, viewport }).promise;
              const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("Unable to compress page.")), "image/jpeg", quality));
              const embedded = await result.embedJpg(await blob.arrayBuffer());
              const dest = result.addPage([original.width, original.height]);
              dest.drawImage(embedded, { x: 0, y: 0, width: original.width, height: original.height });
              page.cleanup();
            }
            await task.destroy();
            const output = await result.save();
            download(output, `${base}-flattened.pdf`);
            setSuccess(`Exported a flattened PDF (${(output.length / 1048576).toFixed(2)} MB). Text selection, links, forms, and accessibility may be lost.`);
          }
        } else if (mode === "reorder") {
          const indices = parseOrder(ranges, total);
          const result = await PDFDocument.create();
          const copied = await result.copyPages(source, indices);
          copied.forEach(page => result.addPage(page));
          download(await result.save(), `${base}-reordered.pdf`);
          setSuccess(`Saved all ${total} pages in your selected order.`);
        } else if (mode === "split") {
          if (total > 300) throw new Error("Split files of up to 300 pages at a time.");
          const archive = new (await import("jszip")).default();
          for (let i = 0; i < total; i++) {
            const output = await PDFDocument.create();
            const [page] = await output.copyPages(source, [i]); output.addPage(page);
            archive.file(`${base}-page-${String(i + 1).padStart(3, "0")}.pdf`, await output.save());
          }
          downloadBlob(await archive.generateAsync({ type: "blob", compression: "DEFLATE" }), `${base}-pages.zip`);
          setSuccess(`Downloaded ${total} single-page PDFs as one ZIP.`);
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not process this file.";
      setError(/encrypted|password/i.test(message)
        ? "This PDF may be password-protected. Unlock it first and try again."
        : /Failed to parse|Invalid PDF/i.test(message)
          ? "This file could not be read as a PDF. Check that it is a valid PDF."
          : message);
    }
    finally { setBusy(false); }
  };
  return <div className="space-y-5 text-neutral-900">
    <div className="flex flex-wrap gap-2" role="group" aria-label="PDF action">
      {actions.map(action => <button key={action.id} type="button" disabled={busy} aria-pressed={mode === action.id}
        onClick={() => { setMode(action.id); setFiles([]); setRanges(action.id === "rotate" ? "" : "1"); setPageCount(null); setSignatureFile(null); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(""); setError(""); setSuccess(""); }}
        className={`rounded-md border px-3 py-2 text-sm disabled:opacity-50 ${mode === action.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100"}`}>{action.label}</button>)}
    </div>
    <label className="block cursor-pointer rounded-md border border-dashed border-neutral-400 bg-white p-6 text-center text-sm hover:bg-neutral-50">
      {mode === "images" ? "Choose PNG, JPG, or WebP images in the order you want" : multi ? "Choose PDF files to merge" : "Choose a PDF file"}
      <input disabled={busy} className="mt-3 block w-full text-sm text-neutral-800 file:mr-3 file:rounded-md file:border file:border-neutral-300 file:bg-white file:px-3 file:py-2 file:text-neutral-900" type="file"
        accept={mode === "images" ? "image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" : "application/pdf,.pdf"} multiple={multi}
        onChange={event => { addFiles(event.target.files); event.target.value = ""; }} />
    </label>
    {!!files.length && <div className="space-y-2" aria-label="Selected files">{files.map((file, index) =>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 py-2 text-sm" key={`${file.name}-${index}`}>
        <span className="min-w-0 break-all">{index + 1}. {file.name} <span className="text-neutral-500">({(file.size / 1048576).toFixed(2)} MB)</span></span>
        <div className="flex shrink-0 gap-1">{multi && <>
          <button type="button" disabled={busy || !index} onClick={() => setFiles(old => { const next = [...old]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })} aria-label={`Move ${file.name} up`} className="rounded border border-neutral-300 px-2 disabled:opacity-30">↑</button>
          <button type="button" disabled={busy || index === files.length - 1} onClick={() => setFiles(old => { const next = [...old]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; return next; })} aria-label={`Move ${file.name} down`} className="rounded border border-neutral-300 px-2 disabled:opacity-30">↓</button>
        </>}
          <button type="button" disabled={busy} onClick={() => setFiles(old => old.filter((_, i) => i !== index))} aria-label={`Remove ${file.name}`} className="rounded border border-neutral-300 px-2 text-neutral-900 disabled:opacity-30">Remove</button>
        </div>
      </div>)}</div>}
    {previewUrl && files.length === 1 && mode !== "images" && <section className="space-y-2">
      <p className="text-sm text-neutral-700">{pageCount === null ? "Preview" : `${pageCount} page${pageCount === 1 ? "" : "s"} · Preview`}</p>
      <iframe title="PDF preview" src={previewUrl} className="h-80 w-full rounded border border-neutral-300 bg-white" />
      <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">Open PDF preview in a new tab</a>
    </section>}
    {(["extract", "remove", "rotate", "reorder"] as Mode[]).includes(mode) &&
      <label className="block text-sm text-neutral-800">{mode === "reorder" ? "New page order (include every page once)" : mode === "rotate" ? "Pages to rotate (leave blank for all pages)" : mode === "remove" ? "Pages to remove" : "Pages to extract"} {mode === "reorder" ? "(for example: 3, 1, 2)" : "(for example: 1, 3-5, 8)"}
        <input disabled={busy} value={ranges} onChange={event => setRanges(event.target.value)} className="mt-2 block w-full rounded-md border border-neutral-300 bg-white p-3 text-neutral-900" placeholder="1, 3-5" />
      </label>}
    {mode === "rotate" && <label className="block text-sm text-neutral-800">Rotation <select disabled={busy} className="ml-3 rounded-md border border-neutral-300 bg-white p-2 text-neutral-900" value={degrees} onChange={event => setDegrees(Number(event.target.value) as 90 | 180 | 270)}><option value={90}>90° clockwise</option><option value={180}>180°</option><option value={270}>270° clockwise</option></select></label>}
    {mode === "sign" && <section className="space-y-3 rounded-md border border-neutral-200 p-3 text-sm">
      <p>Add a picture of your handwritten signature to one page. PNG with transparent background works best. This is a visual mark, not a cryptographic digital signature.</p>
      <label className="block">Signature image (PNG or JPG)<input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" disabled={busy} onChange={event => setSignatureFile(event.target.files?.[0] ?? null)} className="mt-1 block w-full" /></label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {([ ["Page number", signaturePage, setSignaturePage], ["Width (points)", signatureWidth, setSignatureWidth], ["Left (points)", signatureX, setSignatureX], ["Bottom (points)", signatureY, setSignatureY] ] as const).map(([label, value, change]) => <label key={label}>{label}<input type="number" min={label === "Page number" || label === "Width (points)" ? 1 : 0} max={label === "Page number" ? pageCount ?? undefined : undefined} value={value} onChange={e => change(e.target.value)} disabled={busy} className="mt-1 w-full rounded border border-neutral-300 bg-white p-2 text-neutral-900" /></label>)}
      </div><p className="text-neutral-600">Coordinates start from the bottom-left corner. 72 points = 1 inch. Use the PDF preview above to estimate placement.</p>
    </section>}
    {mode === "watermark" && <label className="block text-sm">Watermark text (all pages)<input type="text" maxLength={100} disabled={busy} value={watermarkText} onChange={e => setWatermarkText(e.target.value)} placeholder="DRAFT" className="mt-2 block w-full rounded border border-neutral-300 bg-white p-3 text-neutral-900" /></label>}
    {mode === "pdf-images" && <label className="block text-sm">Image format <select value={imageFormat} onChange={e => setImageFormat(e.target.value as "png" | "jpeg")} disabled={busy} className="ml-2 rounded border border-neutral-300 bg-white p-2 text-neutral-900"><option value="png">PNG</option><option value="jpeg">JPG</option></select></label>}
    {mode === "compress" && <div className="space-y-3 text-sm"><label className="block">Optimization method <select disabled={busy} value={compression} onChange={e => setCompression(e.target.value as "lossless" | "raster")} className="ml-2 rounded border border-neutral-300 bg-white p-2 text-neutral-900"><option value="lossless">Lossless (preserve text and links)</option><option value="raster">Flatten as images (may reduce size)</option></select></label>{compression === "raster" && <><p className="text-amber-800">Flattening turns pages into pictures: selectable text, hyperlinks, forms, and accessibility may be lost. The output is not guaranteed to be smaller.</p><label className="block">Image quality: {Math.round(quality * 100)}% <input type="range" min="0.35" max="0.95" step="0.05" disabled={busy} value={quality} onChange={e => setQuality(Number(e.target.value))} className="ml-2 align-middle" /></label></>}</div>}
    <button type="button" onClick={process} disabled={busy || !files.length || (mode === "merge" && files.length < 2)} className="rounded-md border border-neutral-900 bg-neutral-900 px-5 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Processing…" : `${actions.find(action => action.id === mode)?.label} & download`}</button>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    {success && <p role="status" className="text-sm text-green-800">{success}</p>}
    <p className="text-sm text-neutral-600">Processing happens in your browser. Password-protected PDFs may not open. Splitting and PDF-to-images create a single ZIP download. Optimization cannot guarantee a smaller file. Password protection, password removal, certificate-backed digital signing, and OCR are not supported. Visual signatures do not verify signer identity.</p>
  </div>;
}
