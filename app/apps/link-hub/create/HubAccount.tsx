"use client";
import { useEffect, useState } from "react";
import type { LinkHubEditorState } from "./editorState";
import { clearHubSession, hubHeaders, hubToken, saveHubSession } from "./hubSession";

type OwnedHub = { username: string; state: LinkHubEditorState; updated_at?: string };
function validHub(value: unknown): value is OwnedHub {
  if (!value || typeof value !== "object") return false;
  const hub = value as Partial<OwnedHub>;
  return typeof hub.username === "string" && !!hub.state && typeof hub.state === "object" &&
    !!hub.state.profile && Array.isArray(hub.state.socials) && Array.isArray(hub.state.blocks) && !!hub.state.design;
}
export default function HubAccount({ onLoad }: { onLoad: (state: LinkHubEditorState) => void }) {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [profiles, setProfiles] = useState<OwnedHub[]>([]);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  useEffect(() => { setSignedIn(!!hubToken()); }, []);
  async function loadProfiles() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/link-hub/mine", { headers: await hubHeaders(), cache: "no-store" });
      const result = await response.json() as { ok?: boolean; profiles?: unknown; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Could not load profiles.");
      const owned = Array.isArray(result.profiles) ? result.profiles.filter(validHub) : [];
      setProfiles(owned);
      setMessage(owned.length ? "Select a profile to edit." : "No published profiles belong to this account yet.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not load profiles."); }
    finally { setBusy(false); }
  }
  async function submit(mode: "login" | "signup") {
    if (!url || !anon) { setMessage("Link Hub accounts are not configured."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`${url}/auth/v1/${mode === "login" ? "token?grant_type=password" : "signup"}`, {
        method: "POST", headers: { apikey: anon, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { access_token?: string; expires_in?: number; refresh_token?: string; msg?: string; error_description?: string };
      if (!response.ok) throw new Error(result.msg || result.error_description || "Could not sign in.");
      if (result.access_token && result.expires_in) {
        saveHubSession(result.access_token, result.expires_in, result.refresh_token);
        setSignedIn(true); setProfiles([]); setPassword("");
        setMessage("Signed in. Open your published profile below, or create a new one.");
      } else setMessage("Check your email to confirm your account, then sign in.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not sign in."); }
    finally { setBusy(false); }
  }
  return <section style={{ padding:16, border:"1px solid #ddd", borderRadius:8, margin:"12px 0", background:"white", color:"black" }}>
    <strong>Link Hub account</strong>
    <p style={{ margin:"6px 0" }}>Sign in to publish, manage your profile, or view private analytics.</p>
    {signedIn ? <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
      <button type="button" disabled={busy} onClick={loadProfiles} style={{ padding:8, border:"1px solid #888", color:"black", background:"white" }}>My published profiles</button>
      <button type="button" onClick={() => { clearHubSession(); setSignedIn(false); setProfiles([]); setMessage("Signed out."); }} style={{ padding:8, border:"1px solid #888", color:"black", background:"white" }}>Sign out</button>
    </div> : <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:8 }}>
      <input type="email" autoComplete="email" placeholder="Email" aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding:8, border:"1px solid #888", color:"black", background:"white" }} />
      <input type="password" autoComplete="current-password" placeholder="Password" aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding:8, border:"1px solid #888", color:"black", background:"white" }} />
      <button type="button" disabled={busy} onClick={() => submit("login")} style={{ padding:8, border:"1px solid #888", color:"black", background:"white" }}>Sign in</button>
      <button type="button" disabled={busy} onClick={() => submit("signup")} style={{ padding:8, border:"1px solid #888", color:"black", background:"white" }}>Create account</button>
    </div>}
    {profiles.length > 0 && <div style={{ marginTop:12 }}><strong>Your published profiles</strong><div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:6 }}>
      {profiles.map(hub => <button key={hub.username} type="button" style={{ padding:8, border:"1px solid #888", background:"white", color:"black" }} onClick={() => {
        if (!window.confirm(`Load @${hub.username}? Your current unsaved editor changes will be replaced.`)) return;
        onLoad(hub.state); setMessage(`Loaded @${hub.username}. Publish to save any changes.`);
      }}>@{hub.username}</button>)}
    </div></div>}
    {message && <p role="status" style={{ marginTop:8 }}>{message}</p>}
  </section>;
}
