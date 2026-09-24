"use client";
import { useState } from "react";
import { clearHubSession, hubToken, saveHubSession } from "./hubSession";

export default function HubAccount() {
  const [signedIn, setSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  async function submit(mode: "login" | "signup") {
    if (!url || !anon) { setMessage("Link Hub accounts are not configured."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`${url}/auth/v1/${mode === "login" ? "token?grant_type=password" : "signup"}`, {
        method: "POST", headers: { apikey: anon, "Content-Type": "application/json" },
        body: JSON.stringify({email, password}),
      });
      const result = await response.json() as {access_token?:string; expires_in?:number; refresh_token?:string; msg?:string; error_description?:string};
      if (!response.ok) throw new Error(result.msg || result.error_description || "Could not sign in.");
      if (result.access_token && result.expires_in) {
        saveHubSession(result.access_token, result.expires_in, result.refresh_token);
        setSignedIn(true); setPassword(""); setMessage("Signed in. You can publish and manage your Link Hub.");
      } else setMessage("Check your email to confirm your account, then sign in.");
    } catch(e) { setMessage(e instanceof Error ? e.message : "Could not sign in."); }
    finally { setBusy(false); }
  }
  return <section style={{padding:16,border:"1px solid #ddd",borderRadius:8,margin:"12px 0",background:"white",color:"black"}}>
    <strong>Link Hub account</strong>
    <p style={{margin:"6px 0"}}>Sign in to publish, upload images, or view private analytics.</p>
    {(signedIn || (typeof window !== "undefined" && !!hubToken())) ? <button type="button" onClick={()=>{ clearHubSession();setSignedIn(false);setMessage("Signed out."); }} style={{padding:8,border:"1px solid #888"}}>Sign out</button> : <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      <input type="email" autoComplete="email" placeholder="Email" aria-label="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:8,border:"1px solid #888",color:"black",background:"white"}} />
      <input type="password" autoComplete="current-password" placeholder="Password" aria-label="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:8,border:"1px solid #888",color:"black",background:"white"}} />
      <button type="button" disabled={busy} onClick={()=>submit("login")} style={{padding:8,border:"1px solid #888"}}>Sign in</button>
      <button type="button" disabled={busy} onClick={()=>submit("signup")} style={{padding:8,border:"1px solid #888"}}>Create account</button>
    </div>}
    {message && <p role="status">{message}</p>}
  </section>;
}
