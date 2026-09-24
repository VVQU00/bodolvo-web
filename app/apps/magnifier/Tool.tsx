"use client";

import { ChangeEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

type Mode = "idle" | "live" | "frozen";
type TorchCapabilities = MediaTrackCapabilities & { torch?: boolean };

const button = "rounded-xl border border-white/20 bg-white/[.07] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[.14] disabled:cursor-not-allowed disabled:opacity-40";
const primary = "rounded-xl bg-violet-300 px-4 py-3 text-sm font-semibold text-black transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-40";

export function Tool() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef(0);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [mode, setMode] = useState<Mode>("idle");
  const [source, setSource] = useState<"camera" | "photo">("camera");
  const [cameraSide, setCameraSide] = useState<"environment" | "user">("environment");
  const [zoom, setZoom] = useState(2);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [contrast, setContrast] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("Open your camera or choose a photo to get started.");

  function stopCamera() {
    requestRef.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setTorchAvailable(false);
    setTorchOn(false);
  }

  useEffect(() => {
    return () => {
      requestRef.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  async function openCamera(side: "environment" | "user" = cameraSide) {
    setError("");
    stopCamera();
    const request = requestRef.current;
    photoRef.current = null;
    if (!navigator.mediaDevices?.getUserMedia) {
      setMode("idle");
      setError("Camera access is unavailable here. Use HTTPS (or localhost), a supported browser, or upload a photo instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: side }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      if (request !== requestRef.current) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const track = stream.getVideoTracks()[0];
      setTorchAvailable(Boolean((track?.getCapabilities?.() as TorchCapabilities | undefined)?.torch));
      setCameraSide(side);
      setMode("live");
      setSource("camera");
      setPan({ x: 0, y: 0 });
      setMessage("Live view. Zoom in, adjust the image, or freeze a frame to inspect it.");
    } catch {
      if (request !== requestRef.current) return;
      stopCamera();
      setMode("idle");
      setError("Could not open the camera. Check camera permission and whether another app is using it, or upload a photo instead.");
    }
  }

  async function toggleTorch() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setTorchOn(next);
    } catch {
      setTorchAvailable(false);
      setError("This browser or camera does not allow the flashlight to be controlled.");
    }
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video?.videoWidth || !canvas) {
      setError("Wait for the camera image to appear before freezing it.");
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    stopCamera();
    setMode("frozen");
    setSource("camera");
    setPan({ x: 0, y: 0 });
    setMessage("Frame frozen. Drag the image to inspect different parts, or save the magnified view.");
  }

  function loadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      return;
    }
    setError("");
    if (file.size > 20 * 1024 * 1024) { setError("Choose a photo smaller than 20 MB."); return; }
    const blobUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        URL.revokeObjectURL(blobUrl);
        return;
      }
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      photoRef.current = image;
      stopCamera();
      setMode("frozen");
      setSource("photo");
      setPan({ x: 0, y: 0 });
      setMessage("Photo loaded. Zoom, adjust contrast or brightness, and drag to inspect details.");
      URL.revokeObjectURL(blobUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      setError("That photo could not be opened. Try a JPG or PNG.");
    };
    image.src = blobUrl;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (mode !== "frozen") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerRef.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  }
  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!pointerRef.current || mode !== "frozen") return;
    const previous = pointerRef.current;
    const width = event.currentTarget.clientWidth;
    const height = event.currentTarget.clientHeight;
    const limitX = width * (zoom - 1) / 2;
    const limitY = height * (zoom - 1) / 2;
    setPan({
      x: Math.max(-limitX, Math.min(limitX, previous.panX + event.clientX - previous.x)),
      y: Math.max(-limitY, Math.min(limitY, previous.panY + event.clientY - previous.y)),
    });
  }
  function handlePointerUp() { pointerRef.current = null; }

  function saveView() {
    const sourceCanvas = canvasRef.current;
    if (mode !== "frozen" || !sourceCanvas?.width) return;
    const out = document.createElement("canvas");
    out.width = Math.min(sourceCanvas.width, 4096);
    out.height = Math.min(sourceCanvas.height, 4096);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    // The displayed image uses object-contain; calculate its natural fitted dimensions so
    // the saved magnified view follows the same zoom and pan as the on-screen preview.
    const stage = document.getElementById("bodolvo-magnifier-stage");
    const stageWidth = stage?.clientWidth || out.width;
    const stageHeight = stage?.clientHeight || out.height;
    const ratio = Math.min(stageWidth / sourceCanvas.width, stageHeight / sourceCanvas.height);
    const visibleWidth = sourceCanvas.width * ratio;
    const visibleHeight = sourceCanvas.height * ratio;
    const cropWidth = Math.min(sourceCanvas.width, stageWidth / (ratio * zoom));
    const cropHeight = Math.min(sourceCanvas.height, stageHeight / (ratio * zoom));
    const cropCenterX = sourceCanvas.width / 2 - (pan.x / (ratio * zoom));
    const cropCenterY = sourceCanvas.height / 2 - (pan.y / (ratio * zoom));
    const sx = Math.max(0, Math.min(sourceCanvas.width - cropWidth, cropCenterX - cropWidth / 2));
    const sy = Math.max(0, Math.min(sourceCanvas.height - cropHeight, cropCenterY - cropHeight / 2));
    void visibleWidth; void visibleHeight;
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(sourceCanvas, sx, sy, cropWidth, cropHeight, 0, 0, out.width, out.height);
    const link = document.createElement("a");
    link.download = "bodolvo-magnifier.png";
    link.href = out.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-3">
        <button type="button" className={primary} onClick={() => void openCamera()}>Open camera</button>
        <button type="button" className={button} onClick={() => fileRef.current?.click()}>Upload photo</button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={loadPhoto} aria-label="Choose a photo" />
        {mode === "live" && <button type="button" className={button} onClick={capture}>Freeze frame</button>}
        {mode === "frozen" && source === "camera" && <button type="button" className={button} onClick={() => void openCamera()}>Resume camera</button>}
        {mode === "live" && <button type="button" className={button} onClick={() => void openCamera(cameraSide === "environment" ? "user" : "environment")}>Switch camera</button>}
        {mode === "live" && torchAvailable && <button type="button" className={button} onClick={() => void toggleTorch()}>{torchOn ? "Flashlight off" : "Flashlight on"}</button>}
        {mode === "frozen" && <button type="button" className={button} onClick={saveView}>Save view</button>}
      </div>

      <div
        id="bodolvo-magnifier-stage"
        className={`relative aspect-[4/3] max-h-[70vh] w-full overflow-hidden rounded-2xl border border-white/10 bg-black sm:aspect-video ${mode === "frozen" ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="img"
        aria-label={mode === "live" ? "Live magnified camera" : mode === "frozen" ? "Frozen magnified image; drag to pan" : "Magnifier preview"}
      >
        <video ref={videoRef} autoPlay muted playsInline className={`h-full w-full object-contain ${mode === "live" ? "block" : "hidden"}`} style={{ transform: `scale(${zoom})`, filter: `brightness(${brightness}%) contrast(${contrast}%)` }} />
        <canvas ref={canvasRef} className={`h-full w-full object-contain ${mode === "frozen" ? "block" : "hidden"}`} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, filter: `brightness(${brightness}%) contrast(${contrast}%)` }} />
        {mode === "idle" && <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-white/55">Your camera or photo will appear here.</div>}
        {mode !== "idle" && <span className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-black/70 px-3 py-1 text-xs text-white">{mode === "live" ? "LIVE" : "FROZEN"} · {zoom.toFixed(1)}×</span>}
      </div>

      <p className="text-sm text-white/60" role="status">{message}</p>
      {error && <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-200" role="alert">{error}</p>}
      <div className="grid gap-5 sm:grid-cols-3">
        <label className="block text-sm text-white/75">Zoom: {zoom.toFixed(1)}×
          <input className="mt-3 block w-full accent-violet-300" type="range" min="1" max="8" step="0.1" value={zoom} onChange={(event) => { setZoom(Number(event.target.value)); setPan({ x: 0, y: 0 }); }} />
        </label>
        <label className="block text-sm text-white/75">Brightness: {brightness}%
          <input className="mt-3 block w-full accent-violet-300" type="range" min="50" max="200" step="5" value={brightness} onChange={(event) => setBrightness(Number(event.target.value))} />
        </label>
        <label className="block text-sm text-white/75">Contrast: {contrast}%
          <input className="mt-3 block w-full accent-violet-300" type="range" min="50" max="200" step="5" value={contrast} onChange={(event) => setContrast(Number(event.target.value))} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={button} onClick={() => { setZoom(2); setPan({ x: 0, y: 0 }); setBrightness(100); setContrast(100); }}>Reset adjustments</button>
        <button type="button" className={button} onClick={() => { stopCamera(); setMode("idle"); photoRef.current = null; setError(""); setMessage("Camera stopped. Open your camera or upload a photo to continue."); }}>Stop / clear</button>
      </div>
      <p className="text-xs leading-relaxed text-white/45">Camera access requires HTTPS or localhost and your permission. Flashlight control is only shown on compatible devices. Digital zoom enlarges pixels, so fine detail depends on your camera and lighting. Photos stay in your browser.</p>
    </div>
  );
}
