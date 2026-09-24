"use client";

import { useEffect, useRef, useState } from "react";

type ExportFile = { url: string; name: string; size: number };
const mb = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
const stem = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[^\w. -]/g, "_").slice(0, 70) || "media";
const timeLabel = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

function encodeWav(buffer: AudioBuffer, from: number, to: number): Blob {
  const sampleRate = buffer.sampleRate;
  const channels = Math.min(buffer.numberOfChannels, 2);
  const start = Math.max(0, Math.floor(from * sampleRate));
  const end = Math.min(buffer.length, Math.ceil(to * sampleRate));
  const count = end - start;
  if (count <= 0) throw new Error("Choose an end time later than the start time.");
  if (count * channels * 2 > 160 * 1024 * 1024) throw new Error("This clip is too large for browser WAV export. Select a shorter section.");
  const data = new ArrayBuffer(44 + count * channels * 2);
  const view = new DataView(data);
  const putText = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
  putText(0, "RIFF"); view.setUint32(4, data.byteLength - 8, true); putText(8, "WAVE");
  putText(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, channels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channels * 2, true); view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true); putText(36, "data"); view.setUint32(40, count * channels * 2, true);
  const samples = Array.from({ length: channels }, (_, channel) => buffer.getChannelData(channel));
  let position = 44;
  for (let index = start; index < end; index++) for (let channel = 0; channel < channels; channel++) {
    const value = Math.max(-1, Math.min(1, samples[channel][index]));
    view.setInt16(position, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    position += 2;
  }
  return new Blob([data], { type: "audio/wav" });
}

export function Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ExportFile | null>(null);
  const player = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const isAudio = !!file && (file.type.startsWith("audio/") || /\.(mp3|wav|m4a|ogg|aac|flac)$/i.test(file.name));
  const isVideo = !!file && !isAudio;
  useEffect(() => {
    if (!file) { setUrl(""); return; }
    const next = URL.createObjectURL(file); setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);
  function select(next: File | null) {
    if (next && !(next.type.startsWith("audio/") || next.type.startsWith("video/") || /\.(mp3|wav|m4a|ogg|aac|flac|mp4|webm|mov)$/i.test(next.name))) {
      setError("Select an audio or video file your browser can open."); return;
    }
    setFile(next); setDuration(0); setStart(0); setEnd(0); setError(""); setResult(null);
  }
  async function trimAudio() {
    if (!file || !isAudio || busy) return;
    setBusy(true); setError(""); setResult(null);
    let context: AudioContext | null = null;
    try {
      if (file.size > 100 * 1024 * 1024) throw new Error("For browser audio trimming, choose a file smaller than 100 MB.");
      context = new AudioContext();
      const decoded = await context.decodeAudioData(await file.arrayBuffer());
      const blob = encodeWav(decoded, start, Math.min(end, decoded.duration));
      setResult({ url: URL.createObjectURL(blob), name: `${stem(file.name)}-clip.wav`, size: blob.size });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not decode this audio file in your browser."); }
    finally { if (context) await context.close(); setBusy(false); }
  }
  async function saveFrame() {
    if (!file || !video.current || !isVideo) return;
    setError(""); setResult(null);
    try {
      const current = video.current;
      if (!current.videoWidth || !current.videoHeight) throw new Error("Wait for the video to load before saving a frame.");
      const canvas = document.createElement("canvas"); canvas.width = current.videoWidth; canvas.height = current.videoHeight;
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Image export is unavailable in this browser.");
      ctx.drawImage(current, 0, 0);
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not export this video frame.");
      setResult({ url: URL.createObjectURL(blob), name: `${stem(file.name)}-frame-${Math.floor(current.currentTime)}s.png`, size: blob.size });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save this frame."); }
  }
  function previewClip() {
    const current = player.current; if (!current) return;
    current.currentTime = start; void current.play().catch(() => setError("Playback was blocked. Tap Play on the player."));
  }
  return <div className="space-y-6 text-white">
    <label className="block text-sm text-white/70">Choose an audio or video file
      <input type="file" accept="audio/*,video/*,.mp3,.wav,.m4a,.ogg,.aac,.flac,.mp4,.webm,.mov" onChange={event => select(event.target.files?.[0] ?? null)} className="mt-2 block w-full rounded-xl border border-white/15 bg-white/5 p-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-violet-300 file:px-3 file:py-2 file:font-semibold file:text-black" />
    </label>
    {file && <section className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-4">
      <p className="break-all text-sm text-white/65">{file.name} · {mb(file.size)}</p>
      {isAudio ? <audio ref={player as React.RefObject<HTMLAudioElement>} src={url} controls className="w-full" onLoadedMetadata={event => { const value = event.currentTarget.duration; if (Number.isFinite(value)) { setDuration(value); setStart(0); setEnd(value); } }} onTimeUpdate={event => { if (end > start && event.currentTarget.currentTime >= end && event.currentTarget.currentTime < duration - 0.05) event.currentTarget.pause(); }} /> : <video ref={video} src={url} controls playsInline className="max-h-[55vh] w-full rounded-xl bg-black" onLoadedMetadata={event => { const value = event.currentTarget.duration; if (Number.isFinite(value)) { setDuration(value); setStart(0); setEnd(value); } }} />}
      {duration > 0 && <div className="space-y-3">
        <p className="text-sm text-white/65">Duration: {timeLabel(duration)}</p>
        {isAudio ? <><div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">Start: {timeLabel(start)}<input className="mt-2 w-full accent-violet-300" type="range" min="0" max={duration} step="0.1" value={start} onChange={event => setStart(Math.min(Number(event.target.value), end))}/></label>
          <label className="text-sm">End: {timeLabel(end)}<input className="mt-2 w-full accent-violet-300" type="range" min="0" max={duration} step="0.1" value={end} onChange={event => setEnd(Math.max(Number(event.target.value), start))}/></label>
        </div><div className="flex flex-wrap gap-3"><button type="button" onClick={previewClip} className="rounded-xl border border-white/25 px-4 py-2 text-sm">Preview from start</button><button type="button" disabled={busy || end - start < .05} onClick={trimAudio} className="rounded-xl bg-violet-300 px-4 py-2 text-sm font-semibold text-black disabled:opacity-40">{busy ? "Preparing WAV…" : "Export audio clip (WAV)"}</button></div><p className="text-xs text-white/50">Audio is decoded and trimmed locally. WAV is uncompressed, so exports may be larger than the original. Supported input formats depend on your browser.</p></> : <><button type="button" onClick={saveFrame} className="rounded-xl bg-violet-300 px-4 py-2 text-sm font-semibold text-black">Save current video frame (PNG)</button><p className="text-xs text-white/50">Pause or seek to the desired frame first. Video trim, join, compression, and conversion are not available in this pass.</p></>}
      </div>}
    </section>}
    {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {result && <a href={result.url} download={result.name} className="inline-flex rounded-xl bg-emerald-300 px-4 py-3 text-sm font-semibold text-black">Download {result.name} ({mb(result.size)})</a>}
    <p className="text-sm text-white/50">Files are processed on this device; this tool does not send selected media to the Bodolvo server. Keep this tab open while exporting.</p>
  </div>;
}
