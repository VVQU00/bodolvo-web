"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Command = { kind: "play" | "pause" | "mute" | "seek" | "volume" | "skip"; value?: number };
type Status = "idle" | "offering" | "answering" | "waiting" | "connected";
type Playback = { playing: boolean; muted: boolean; volume: number; current: number; duration: number; title: string };
const initial: Playback = { playing: false, muted: false, volume: 1, current: 0, duration: 0, title: "No video selected" };
const inputClass = "w-full rounded-xl border border-white/20 bg-black/30 p-3 text-sm text-white placeholder:text-white/35 focus:border-violet-300 focus:outline-none";
const buttonClass = "rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40";
const waitForIce = async (pc: RTCPeerConnection) => {
 if (pc.iceGatheringState === "complete") return;
 await new Promise<void>((resolve, reject) => {
  const timeout = window.setTimeout(() => { clean(); reject(new Error("Connection setup timed out. Please try again.")); }, 18000);
  const check = () => { if (pc.iceGatheringState === "complete") { clean(); resolve(); } };
  const clean = () => { window.clearTimeout(timeout); pc.removeEventListener("icegatheringstatechange", check); };
  pc.addEventListener("icegatheringstatechange", check);
  check();
 });
};
const encode = (description: RTCSessionDescription | null) => {
 if (!description) throw new Error("No pairing information available.");
 return JSON.stringify({ type: description.type, sdp: description.sdp });
};
const decode = (value: string, expected: "offer" | "answer"): RTCSessionDescriptionInit => {
 const parsed: unknown = JSON.parse(value);
 if (!parsed || typeof parsed !== "object" || !("type" in parsed) || !("sdp" in parsed) || parsed.type !== expected || typeof parsed.sdp !== "string" || parsed.sdp.length > 100000) throw new Error(`Paste a valid ${expected} pairing message.`);
 return { type: expected, sdp: parsed.sdp };
};
const formatTime = (value: number) => Number.isFinite(value) ? `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}` : "0:00";

export function Tool() {
 const [mode, setMode] = useState<"receiver" | "remote">("receiver");
 const [status, setStatus] = useState<Status>("idle");
 const [message, setMessage] = useState("");
 const [outgoing, setOutgoing] = useState("");
 const [incoming, setIncoming] = useState("");
 const [playback, setPlayback] = useState<Playback>(initial);
 const [videoUrl, setVideoUrl] = useState("");
 const pcRef = useRef<RTCPeerConnection | null>(null);
 const channelRef = useRef<RTCDataChannel | null>(null);
 const playerRef = useRef<HTMLVideoElement | null>(null);
 const modeRef = useRef(mode);
 modeRef.current = mode;
 const makeConnection = useCallback(() => {
  if (typeof RTCPeerConnection === "undefined") throw new Error("This browser does not support direct browser-to-browser connections.");
  // No account or signaling server. Pairing messages must be exchanged directly by the user.
  const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  pcRef.current = pc;
  pc.onconnectionstatechange = () => {
   if (pc.connectionState === "connected") { setStatus("connected"); setMessage("Paired. Only controls for the video on this page are available."); }
   else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") { setStatus("waiting"); setMessage("Connection lost. Try pairing again if it does not reconnect."); }
  };
  return pc;
 }, []);
 const sendPlayback = useCallback(() => {
  const video = playerRef.current;
  if (!video || channelRef.current?.readyState !== "open") return;
  const state: Playback = { playing: !video.paused, muted: video.muted, volume: video.volume, current: video.currentTime, duration: Number.isFinite(video.duration) ? video.duration : 0, title: video.dataset.name || "Selected video" };
  channelRef.current.send(JSON.stringify({ kind: "state", state }));
 }, []);
 const connectChannel = useCallback((channel: RTCDataChannel) => {
  channelRef.current = channel;
  channel.onopen = () => { setStatus("connected"); setMessage("Connected! The viewer must select a video and press Play once if their browser blocks automatic playback."); sendPlayback(); };
  channel.onclose = () => { setStatus("waiting"); setMessage("Remote connection closed."); };
  channel.onmessage = event => {
   try {
    const data: unknown = JSON.parse(String(event.data));
    if (!data || typeof data !== "object" || !("kind" in data)) return;
    if (modeRef.current === "remote" && data.kind === "state" && "state" in data && data.state && typeof data.state === "object") {
     const s = data.state as Playback;
     if (typeof s.title === "string" && s.title.length <= 120 && typeof s.current === "number" && Number.isFinite(s.current) && s.current >= 0 && typeof s.duration === "number" && Number.isFinite(s.duration) && s.duration >= 0 && typeof s.volume === "number" && Number.isFinite(s.volume) && s.volume >= 0 && s.volume <= 1 && typeof s.playing === "boolean" && typeof s.muted === "boolean") setPlayback(s);
     return;
    }
    if (modeRef.current !== "receiver") return;
    const cmd = data as Command;
    const video = playerRef.current;
    if (!video) return;
    const value = Number(cmd.value);
    if (cmd.kind === "play") void video.play().catch(() => setMessage("Playback was blocked on this device. Press Play once on the viewer, then try again."));
    if (cmd.kind === "pause") video.pause();
    if (cmd.kind === "mute") video.muted = !video.muted;
    if (cmd.kind === "volume" && Number.isFinite(value)) video.volume = Math.max(0, Math.min(1, value));
    if (cmd.kind === "skip" && Number.isFinite(value) && Number.isFinite(video.duration)) video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + Math.max(-600, Math.min(600, value))));
    if (cmd.kind === "seek" && Number.isFinite(value) && Number.isFinite(video.duration)) video.currentTime = Math.max(0, Math.min(video.duration, value));
    sendPlayback();
   } catch { setMessage("Could not read a remote command."); }
  };
 }, [sendPlayback]);
 const reset = useCallback(() => {
  channelRef.current?.close(); channelRef.current = null;
  pcRef.current?.close(); pcRef.current = null;
  setStatus("idle"); setOutgoing(""); setIncoming(""); setMessage(""); setPlayback(initial);
 }, []);
 useEffect(() => () => { channelRef.current?.close(); pcRef.current?.close(); }, []);
 useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);
 useEffect(() => {
  if (mode !== "receiver" || status !== "connected") return;
  const interval = window.setInterval(sendPlayback, 1000);
  sendPlayback();
  return () => window.clearInterval(interval);
 }, [mode, status, sendPlayback]);
 const startRemote = async () => {
  reset(); setMessage(""); setStatus("offering");
  try {
   const pc = makeConnection();
   const channel = pc.createDataChannel("bodolvo-media-remote", { ordered: true });
   connectChannel(channel);
   await pc.setLocalDescription(await pc.createOffer());
   await waitForIce(pc);
   setOutgoing(encode(pc.localDescription)); setStatus("waiting");
  } catch (error) { setMessage(error instanceof Error ? error.message : "Could not start pairing."); resetConnection(); }
 };
 const resetConnection = () => { channelRef.current?.close(); pcRef.current?.close(); channelRef.current = null; pcRef.current = null; setStatus("idle"); };
 const acceptOffer = async () => {
  setMessage(""); setStatus("answering");
  try {
   const offer = decode(incoming, "offer");
   resetConnection();
   const pc = makeConnection();
   pc.ondatachannel = event => connectChannel(event.channel);
   await pc.setRemoteDescription(offer);
   await pc.setLocalDescription(await pc.createAnswer());
   await waitForIce(pc);
   setOutgoing(encode(pc.localDescription)); setStatus("waiting");
  } catch (error) { resetConnection(); setMessage(error instanceof Error ? error.message : "Could not accept pairing request."); }
 };
 const finishPairing = async () => {
  setMessage("");
  try {
   if (!pcRef.current || pcRef.current.signalingState !== "have-local-offer") throw new Error("Start a new remote pairing session first.");
   await pcRef.current.setRemoteDescription(decode(incoming, "answer"));
   setIncoming(""); setStatus("waiting"); setMessage("Answer accepted. Connecting…");
  } catch (error) { setMessage(error instanceof Error ? error.message : "Could not complete pairing."); }
 };
 const send = (command: Command) => {
  if (channelRef.current?.readyState !== "open") return;
  channelRef.current.send(JSON.stringify(command));
 };
 const copy = async () => { try { await navigator.clipboard.writeText(outgoing); setMessage("Pairing message copied."); } catch { setMessage("Select the pairing message and copy it manually."); } };
 return <div className="space-y-6 text-white">
  <div className="rounded-xl border border-violet-300/20 bg-violet-300/5 p-4 text-sm leading-relaxed text-white/75">
   <strong className="text-white">What works now:</strong> Use a phone or tablet as a remote for a video playing on another device <em>inside this Bodolvo page</em>. The viewer chooses the file. Pairing requires both people/devices to exchange a one-time offer and answer. No app download, account, or uploaded video required.
   <p className="mt-2 text-white/55">This is <strong>not</strong> a remote for your TV operating system, streaming apps, game consoles, or your PC desktop. Browser permissions do not allow those controls. Direct pairing may fail on restrictive networks.</p>
  </div>
  <div className="grid gap-3 sm:grid-cols-2">
   <button type="button" aria-pressed={mode === "receiver"} onClick={() => { reset(); setMode("receiver"); }} className={`${buttonClass} text-left ${mode === "receiver" ? "border-violet-300 bg-violet-300/15" : ""}`}><strong className="block text-base">Viewer / screen</strong><span className="mt-1 block text-xs text-white/60">Open on your PC or TV browser; select a video.</span></button>
   <button type="button" aria-pressed={mode === "remote"} onClick={() => { reset(); setMode("remote"); }} className={`${buttonClass} text-left ${mode === "remote" ? "border-violet-300 bg-violet-300/15" : ""}`}><strong className="block text-base">Remote / phone</strong><span className="mt-1 block text-xs text-white/60">Open this page on your phone to control playback.</span></button>
  </div>
  {mode === "receiver" && <section className="space-y-4 rounded-xl border border-white/10 bg-white/[.035] p-4">
   <label className="block text-sm text-white/75">1. Select a video on this device
    <input className={`${inputClass} mt-2`} type="file" accept="video/*,.mp4,.webm,.mov" onChange={event => {
     const file = event.currentTarget.files?.[0]; if (!file) return;
     setVideoUrl(URL.createObjectURL(file)); setPlayback(initial);
     window.setTimeout(() => { if (playerRef.current) playerRef.current.dataset.name = file.name.slice(0, 120); sendPlayback(); }, 0);
    }} />
   </label>
   {videoUrl ? <video key={videoUrl} ref={playerRef} controls playsInline src={videoUrl} className="max-h-[55vh] w-full rounded-xl bg-black" onPlay={sendPlayback} onPause={sendPlayback} onLoadedMetadata={sendPlayback} onVolumeChange={sendPlayback} onSeeked={sendPlayback} /> : <p className="text-xs text-white/50">Your video stays on this device; it is not sent to the remote phone or uploaded to Bodolvo.</p>}
   <p className="text-xs text-white/55">2. Wait for the phone to generate a pairing offer. Paste it below and press Accept. Only accept a pairing request from a device you trust.</p>
  </section>}
  {mode === "remote" && <p className="text-sm text-white/65">1. Open this same page on the viewer device, switch it to Viewer, and choose a video. Then generate an offer here.</p>}
  <section className="space-y-4 rounded-xl border border-white/10 bg-white/[.035] p-4">
   <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Device pairing</h2><span className="text-xs text-violet-200">{status === "connected" ? "● Connected" : status === "idle" ? "Not paired" : status === "waiting" ? "Waiting for connection" : "Preparing…"}</span></div>
   {mode === "remote" && <button type="button" className={buttonClass} onClick={startRemote} disabled={status === "offering" || status === "answering"}>Generate pairing offer</button>}
   {outgoing && <div className="space-y-2"><label className="block text-xs text-white/65">{mode === "remote" ? "2. Copy this OFFER to the viewer device" : "3. Copy this ANSWER back to the phone"}<textarea readOnly aria-label="Your pairing message" className={`${inputClass} mt-2 h-24 font-mono text-xs`} value={outgoing} onFocus={event => event.currentTarget.select()} /></label><button type="button" className={buttonClass} onClick={copy}>Copy pairing message</button></div>}
   {(mode === "receiver" || (mode === "remote" && !!outgoing && status !== "connected")) && <label className="block text-xs text-white/65">{mode === "receiver" ? "2. Paste the phone's OFFER here" : "4. Paste the viewer's ANSWER here"}<textarea aria-label="Other device pairing message" className={`${inputClass} mt-2 h-24 font-mono text-xs`} value={incoming} onChange={event => setIncoming(event.target.value)} placeholder="Paste pairing message…" /></label>}
   {mode === "receiver" && <button type="button" className={buttonClass} disabled={!incoming.trim() || status === "answering"} onClick={acceptOffer}>Accept pairing offer & generate answer</button>}
   {mode === "remote" && !!outgoing && status !== "connected" && <button type="button" className={buttonClass} disabled={!incoming.trim()} onClick={finishPairing}>Complete pairing</button>}
   {(status !== "idle" || outgoing || incoming) && <button type="button" className={`${buttonClass} ml-2`} onClick={reset}>Disconnect / reset</button>}
   {message && <p role="status" className="text-sm text-white/75">{message}</p>}
  </section>
  {mode === "remote" && <section className="space-y-4 rounded-xl border border-white/10 bg-white/[.035] p-4">
   <div className="text-sm"><p className="font-medium">{playback.title}</p><p className="mt-1 text-white/60">{formatTime(playback.current)} / {formatTime(playback.duration)}</p></div>
   <input type="range" aria-label="Seek video" min={0} max={playback.duration || 1} step={0.5} value={Math.min(playback.current, playback.duration || 1)} disabled={status !== "connected" || !playback.duration} className="w-full accent-violet-300" onChange={event => { const value = Number(event.target.value); setPlayback(prev => ({ ...prev, current: value })); send({ kind: "seek", value }); }} />
   <div className="flex flex-wrap justify-center gap-3"><button type="button" className={buttonClass} disabled={status !== "connected"} onClick={() => send({ kind: "skip", value: -10 })}>−10 sec</button><button type="button" className={buttonClass} disabled={status !== "connected"} onClick={() => send({ kind: playback.playing ? "pause" : "play" })}>{playback.playing ? "Pause" : "Play"}</button><button type="button" className={buttonClass} disabled={status !== "connected"} onClick={() => send({ kind: "skip", value: 10 })}>+10 sec</button></div>
   <div className="flex flex-wrap items-center gap-3"><button type="button" className={buttonClass} disabled={status !== "connected"} onClick={() => send({ kind: "mute" })}>{playback.muted ? "Unmute" : "Mute"}</button><label className="flex flex-1 items-center gap-3 text-sm">Volume <input type="range" aria-label="Volume" className="w-full accent-violet-300" min={0} max={1} step={0.05} value={playback.volume} disabled={status !== "connected"} onChange={event => { const value = Number(event.target.value); setPlayback(prev => ({ ...prev, volume: value })); send({ kind: "volume", value }); }} /></label></div>
  </section>}
  <p className="text-xs leading-relaxed text-white/50">Pairing messages contain network connection details: exchange only with devices you trust. A public STUN service is contacted during connection setup. Remote commands go directly between paired browsers over an encrypted WebRTC data channel. Do not use this as a secure remote-desktop solution.</p>
 </div>;
}
