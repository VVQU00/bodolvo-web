"use client";

const KEY = "bodolvo-linkhub-session";
export function hubToken() {
  try {
    const item = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as { access_token?: string; expires_at?: number } | null;
    if (!item?.access_token || !item.expires_at || Date.now() > item.expires_at - 30000) return "";
    return item.access_token;
  } catch { return ""; }
}
export function saveHubSession(token: string, expiresIn: number) {
  sessionStorage.setItem(KEY, JSON.stringify({ access_token: token, expires_at: Date.now() + expiresIn * 1000 }));
}
export function clearHubSession() { sessionStorage.removeItem(KEY); }
export function hubHeaders(): Record<string,string> { const token = hubToken(); return token ? { Authorization: `Bearer ${token}` } : {}; }
