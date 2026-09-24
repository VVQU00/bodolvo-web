"use client";
import { useEffect, useRef, useState } from "react";
type IOSOrientation = DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };
type IOSPermission = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
const normalize = (degree: number) => ((degree % 360) + 360) % 360;
const cardinal = (degree: number) => ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(normalize(degree) / 45) % 8];
const button = "rounded-xl border border-white/20 bg-white/[.075] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40";
export function Tool() {
  const [heading, setHeading] = useState<number | null>(null);
  const [headingType, setHeadingType] = useState<"compass" | "orientation" | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [message, setMessage] = useState("Enable the sensor to check which direction your device is facing.");
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [locationMessage, setLocationMessage] = useState("Location is off until you request it.");
  const [copied, setCopied] = useState(false);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => {
    if (!enabled) return;
    let received = false;
    const onOrientation = (event: DeviceOrientationEvent) => {
      const ios = event as IOSOrientation;
      if (typeof ios.webkitCompassHeading === "number" && Number.isFinite(ios.webkitCompassHeading)) {
        received = true;
        setHeading(normalize(ios.webkitCompassHeading)); setHeadingType("compass");
        setAccuracy(typeof ios.webkitCompassAccuracy === "number" && Number.isFinite(ios.webkitCompassAccuracy) ? ios.webkitCompassAccuracy : null);
        setMessage("Magnetic heading available. Move your phone in a figure eight if it needs calibration.");
      } else if (typeof event.alpha === "number" && Number.isFinite(event.alpha)) {
        received = true;
        setHeading(normalize(360 - event.alpha)); setHeadingType("orientation"); setAccuracy(null);
        setMessage("Relative device orientation only. This is NOT a north-calibrated compass reading.");
      }
    };
    window.addEventListener("deviceorientation", onOrientation);
    const timeout = window.setTimeout(() => { if (!received && active.current) setMessage("No orientation data received. Your browser or device may not expose a compass sensor."); }, 5000);
    return () => { window.removeEventListener("deviceorientation", onOrientation); window.clearTimeout(timeout); };
  }, [enabled]);
  async function enableCompass() {
    if (!("DeviceOrientationEvent" in window)) { setMessage("This browser does not offer device orientation data."); return; }
    try {
      const sensor = DeviceOrientationEvent as IOSPermission;
      if (typeof sensor.requestPermission === "function") {
        const permission = await sensor.requestPermission();
        if (permission !== "granted") { setMessage("Compass sensor permission was not granted."); return; }
      }
      setEnabled(true);
      setMessage("Waiting for orientation data. Hold the phone flat and gently rotate it.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not access device orientation."); }
  }
  function getLocation() {
    if (!navigator.geolocation) { setLocationMessage("This browser does not support location."); return; }
    setLocationMessage("Requesting location permission…");
    navigator.geolocation.getCurrentPosition(
      (result) => { setPosition(result.coords); setLocationMessage("Current position retrieved from your device."); },
      (error) => { setLocationMessage(error.code === 1 ? "Location permission was denied. You can change it in browser settings." : "Location could not be determined. Try again outdoors with location enabled."); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }
  async function copyCoordinates() {
    if (!position) return;
    try { await navigator.clipboard.writeText(`${position.latitude.toFixed(6)}, ${position.longitude.toFixed(6)}`); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { setLocationMessage("Copying is unavailable here. Select and copy the coordinates below."); }
  }
  const marker = heading === null ? 0 : heading;
  return <div className="space-y-7">
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
      <div className="relative mx-auto aspect-square w-full max-w-[320px] rounded-full border border-white/20 bg-[radial-gradient(circle_at_50%_45%,rgba(167,139,250,.14),rgba(8,10,16,.25)_65%)] p-5 shadow-[0_0_65px_rgba(167,139,250,.07)]">
        <div className="absolute inset-[9%] rounded-full border border-dashed border-white/15" />
        {(["N", "E", "S", "W"] as const).map((direction, index) => <span key={direction} className={`absolute text-sm font-bold tracking-[.2em] ${direction === "N" ? "text-violet-300" : "text-white/55"}`} style={{ top: index === 0 ? "4%" : index === 2 ? "auto" : "50%", bottom: index === 2 ? "4%" : "auto", left: index === 3 ? "5%" : index === 1 ? "auto" : "50%", right: index === 1 ? "4%" : "auto", transform: index % 2 === 0 ? "translateX(-50%)" : "translateY(-50%)" }}>{direction}</span>)}
        <div className="absolute inset-[16%] transition-transform duration-200 ease-out" style={{ transform: `rotate(${-marker}deg)` }}>
          <div className="absolute left-1/2 top-[9%] h-[41%] w-0.5 -translate-x-1/2 bg-gradient-to-b from-violet-300 to-transparent" />
          <div className="absolute bottom-[9%] left-1/2 h-[41%] w-0.5 -translate-x-1/2 bg-gradient-to-t from-white/50 to-transparent" />
          <span className="absolute left-1/2 top-[2%] -translate-x-1/2 text-2xl text-violet-300">▲</span>
          <span className="absolute bottom-[2%] left-1/2 -translate-x-1/2 rotate-180 text-xl text-white/60">▲</span>
        </div>
        <div className="absolute inset-[31%] grid place-content-center rounded-full border border-white/15 bg-[#0b0e16] text-center shadow-lg">
          <div className="text-3xl font-semibold tabular-nums sm:text-4xl">{heading === null ? "—" : `${Math.round(heading)}°`}</div>
          <div className="mt-1 text-xs tracking-[.2em] text-violet-200">{heading === null ? "NO DATA" : cardinal(heading)}</div>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-violet-300">Direction sensor</p>
        <h2 className="text-2xl font-semibold">{headingType === "compass" ? "Compass heading" : headingType === "orientation" ? "Relative orientation" : "Find your heading"}</h2>
        <p className="min-h-14 text-sm leading-relaxed text-white/65" role="status">{message}</p>
        {headingType === "compass" && accuracy !== null && <p className="text-xs text-white/50">Reported sensor accuracy: ±{Math.round(accuracy)}°</p>}
        {headingType === "orientation" && <p className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-relaxed text-amber-100">Your device sent rotation data, not a verified magnetic heading. The dial cannot reliably tell you where north is.</p>}
        <button className={button} onClick={enableCompass}>{enabled ? "Retry compass" : "Enable compass"}</button>
      </div>
    </div>
    <div className="border-t border-white/10 pt-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">My coordinates</h2><p className="mt-1 text-sm text-white/55">Find your current latitude and longitude when you choose.</p></div><button className={button} onClick={getLocation}>Get my location</button></div>
      <p className="mt-4 text-sm text-white/60" role="status">{locationMessage}</p>
      {position && <div className="mt-4 rounded-xl border border-white/10 bg-white/[.045] p-4"><p className="break-all font-mono text-lg tabular-nums">{position.latitude.toFixed(6)}, {position.longitude.toFixed(6)}</p><p className="mt-2 text-xs text-white/55">Reported location accuracy: ±{Math.round(position.accuracy)} m{position.altitude !== null ? ` · Altitude: ${Math.round(position.altitude)} m (device estimate)` : ""}</p><div className="mt-4 flex flex-wrap gap-2"><button className={button} onClick={copyCoordinates}>{copied ? "Copied!" : "Copy coordinates"}</button><a className={button} href={`https://www.openstreetmap.org/?mlat=${encodeURIComponent(position.latitude)}&mlon=${encodeURIComponent(position.longitude)}#map=16/${encodeURIComponent(position.latitude)}/${encodeURIComponent(position.longitude)}`} target="_blank" rel="noopener noreferrer">View on map ↗</a></div></div>}
    </div>
    <p className="text-xs leading-relaxed text-white/45">Requires HTTPS (or localhost), browser support, and device permissions. Many desktop browsers and some mobile browsers do not expose a true compass heading. Sensor readings and GPS can be inaccurate; do not use this tool for safety-critical navigation.</p>
  </div>;
}
