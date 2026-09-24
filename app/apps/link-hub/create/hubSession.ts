"use client";

const KEY = "bodolvo-linkhub-session";
type Session = { access_token: string; refresh_token?: string; expires_at: number };
let refreshPending: Promise<string> | null = null;
function readSession(): Session | null {
  try {
    const stored = sessionStorage.getItem(KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as Session;
    return typeof session.access_token === "string" && Number.isFinite(session.expires_at) ? session : null;
  } catch { return null; }
}
export function hubToken() {
  const session = readSession();
  return session && Date.now() < session.expires_at - 30000 ? session.access_token : "";
}
export function saveHubSession(token: string, expiresIn: number, refreshToken?: string) {
  sessionStorage.setItem(KEY, JSON.stringify({
    access_token: token,
    refresh_token: refreshToken,
    expires_at: Date.now() + expiresIn * 1000,
  } satisfies Session));
}
export function clearHubSession() { sessionStorage.removeItem(KEY); }

async function refreshSession(): Promise<string> {
  const current = readSession();
  if (!current?.refresh_token) { clearHubSession(); return ""; }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return "";
  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { apikey: anon, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: current.refresh_token }),
      cache: "no-store",
    });
    if (!response.ok) { clearHubSession(); return ""; }
    const result = await response.json() as { access_token?: string; refresh_token?: string; expires_in?: number };
    // Do not restore a session after sign-out while a refresh request was pending.
    if (readSession()?.refresh_token !== current.refresh_token) return "";
    if (!result.access_token || !result.expires_in) { clearHubSession(); return ""; }
    saveHubSession(result.access_token, result.expires_in, result.refresh_token ?? current.refresh_token);
    return result.access_token;
  } catch { return ""; }
}
export async function hubHeaders(): Promise<Record<string, string>> {
  let token = hubToken();
  if (!token && readSession()?.refresh_token) {
    if (!refreshPending) refreshPending = refreshSession().finally(() => { refreshPending = null; });
    token = await refreshPending;
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
}
