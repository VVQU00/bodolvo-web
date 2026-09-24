"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Phase = "reference" | "target";
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const styles = {
  action: "rounded-lg bg-violet-300 px-4 py-2.5 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40",
  secondary: "rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-40",
};

export function Tool() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [phase, setPhase] = useState<Phase>("reference");
  const [reference, setReference] = useState<Point[]>([]);
  const [target, setTarget] = useState<Point[]>([]);
  const [referenceLength, setReferenceLength] = useState("10");
  const [unit, setUnit] = useState("cm");
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    if (videoRef.current) videoRef.current.srcObject = null;
  }
  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  async function startCamera() {
    setError("");
    setBusy(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera not supported in this browser. Upload a photo instead.");
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (cause) {
      stopCamera();
      setError(cause instanceof Error ? cause.message : "Camera unavailable. Allow camera permission or upload a photo.");
    } finally {
      setBusy(false);
    }
  }

  function resetPoints() {
    setReference([]);
    setTarget([]);
    setPhase("reference");
  }

  function capture() {
    const video = videoRef.current;
    if (!video?.videoWidth || !video.videoHeight) {
      setError("Wait for the camera preview to load, then try again.");
      return;
    }
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 2048 / Math.max(video.videoWidth, video.videoHeight));
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL("image/jpeg", 0.9));
    setSize({ width: canvas.width, height: canvas.height });
    resetPoints();
    stopCamera();
    setError("");
  }

  function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Choose an image smaller than 20 MB.");
      return;
    }
    const objectURL = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 2048 / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
      setPhoto(canvas.toDataURL("image/jpeg", 0.9));
      setSize({ width: canvas.width, height: canvas.height });
      resetPoints();
      stopCamera();
      setError("");
      URL.revokeObjectURL(objectURL);
    };
    image.onerror = () => {
      setError("Could not open this image. Try JPG, PNG, or WebP.");
      URL.revokeObjectURL(objectURL);
    };
    image.src = objectURL;
    event.target.value = "";
  }

  function selectPoint(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const point = {
      x: Math.min(size.width, Math.max(0, ((event.clientX - rect.left) / rect.width) * size.width)),
      y: Math.min(size.height, Math.max(0, ((event.clientY - rect.top) / rect.height) * size.height)),
    };
    if (phase === "reference") {
      setReference((old) => [...(old.length === 2 ? [] : old), point]);
    } else {
      setTarget((old) => [...(old.length === 2 ? [] : old), point]);
    }
  }

  const refPx = reference.length === 2 ? distance(reference[0], reference[1]) : 0;
  const targetPx = target.length === 2 ? distance(target[0], target[1]) : 0;
  const length = Number(referenceLength);
  const result = refPx > 0 && targetPx > 0 && length > 0 && Number.isFinite(length) ? (length * targetPx) / refPx : null;

  function line(points: Point[], color: string, label: string) {
    return <g key={label}>
      {points.length === 2 && <line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke={color} strokeWidth={Math.max(size.width, size.height) / 250} />}
      {points.map((point, index) => <g key={`${label}-${index}`}>
        <circle cx={point.x} cy={point.y} r={Math.max(size.width, size.height) / 95} fill={color} stroke="#111" strokeWidth={Math.max(size.width, size.height) / 500} />
        <text x={point.x + 12} y={point.y - 12} fill={color} fontSize={Math.max(size.width, size.height) / 35} fontWeight="bold">{label}{index + 1}</text>
      </g>)}
    </g>;
  }

  return <div className="space-y-5">
    <p className="text-sm text-white/70">Measure an object against something of known length in the <strong>same photo and at the same distance from the camera</strong>. Results are estimates; perspective, lens distortion, and point placement affect accuracy. Not a true AR ruler.</p>
    <div className="flex flex-wrap gap-2">
      <button className={styles.action} onClick={startCamera} disabled={busy}>{busy ? "Starting…" : cameraOn ? "Restart camera" : "Open camera"}</button>
      <button className={styles.secondary} onClick={() => fileRef.current?.click()}>Upload photo</button>
      {cameraOn && <button className={styles.action} onClick={capture}>Freeze frame</button>}
      {cameraOn && <button className={styles.secondary} onClick={stopCamera}>Stop camera</button>}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={upload} aria-label="Upload a photo to measure" />
    </div>
    {error && <p role="alert" className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-100">{error}</p>}
    <video ref={videoRef} autoPlay muted playsInline className={`w-full rounded-xl bg-black object-contain ${cameraOn ? "block" : "hidden"}`} />
    {photo ? <div className="space-y-3">
      <p className="text-sm text-white/80">Tap two endpoints of the <strong>{phase === "reference" ? "known-length reference" : "object you want to measure"}</strong> on the photo. Tap again to redo the active line.</p>
      <svg viewBox={`0 0 ${size.width} ${size.height}`} onClick={selectPoint} role="img" aria-label="Measurement photo: tap two endpoints for the selected line" className="block h-auto w-full cursor-crosshair touch-manipulation rounded-xl border border-white/25 bg-black" style={{ aspectRatio: `${size.width} / ${size.height}`, backgroundImage: `url(${photo})`, backgroundSize: "100% 100%" }}>
        {line(reference, "#e9d5ff", "R")}{line(target, "#86efac", "T")}
      </svg>
      <div className="flex flex-wrap gap-2">
        <button className={phase === "reference" ? styles.action : styles.secondary} onClick={() => setPhase("reference")}>1. Reference {reference.length}/2</button>
        <button className={phase === "target" ? styles.action : styles.secondary} onClick={() => setPhase("target")} disabled={reference.length !== 2}>2. Target {target.length}/2</button>
        <button className={styles.secondary} onClick={resetPoints}>Clear points</button>
        <button className={styles.secondary} onClick={() => { setPhoto(null); resetPoints(); }}>New photo</button>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-sm text-white/80">Actual reference length
          <input type="number" min="0.001" step="any" value={referenceLength} onChange={(event) => setReferenceLength(event.target.value)} className="mt-1 block w-40 rounded-lg border border-white/30 bg-black/40 p-2 text-white" />
        </label>
        <label className="text-sm text-white/80">Unit
          <select value={unit} onChange={(event) => setUnit(event.target.value)} className="mt-1 block rounded-lg border border-white/30 bg-zinc-900 p-2 text-white">
            <option value="mm">mm</option><option value="cm">cm</option><option value="in">inches</option><option value="ft">feet</option>
          </select>
        </label>
      </div>
      <p aria-live="polite" className="rounded-xl border border-white/20 bg-white/5 p-4 text-lg font-semibold">{result === null ? "Mark both lines and enter a reference length to calculate the estimate." : `Estimated target length: ${result.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${unit}`}</p>
      <p className="text-xs text-white/60">Tip: Put a ruler or another known-size object beside the target. Both must lie in the same plane. This cannot accurately measure depth or objects at different distances.</p>
    </div> : !cameraOn && <div className="rounded-xl border border-dashed border-white/25 p-8 text-center text-sm text-white/65">Open your camera and freeze a frame, or upload a photo to begin.</div>}
  </div>;
}
