import { NextResponse } from "next/server";

export const unauthorized = () => NextResponse.json({ ok: false, error: "Sign in to manage your Link Hub." }, { status: 401 });

export function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && secret && anon ? { url, secret, anon } : null;
}

export async function authenticatedUser(request: Request): Promise<string | null> {
  const settings = config();
  const token = /^Bearer (.+)$/i.exec(request.headers.get("authorization") ?? "")?.[1];
  if (!settings || !token) return null;
  try {
    const response = await fetch(`${settings.url}/auth/v1/user`, {
      headers: { apikey: settings.anon, Authorization: `Bearer ${token}` }, cache: "no-store",
    });
    if (!response.ok) return null;
    const user = await response.json() as { id?: unknown };
    return typeof user.id === "string" && /^[0-9a-f-]{36}$/i.test(user.id) ? user.id : null;
  } catch { return null; }
}

export function adminHeaders(secret: string) {
  return { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };
}

// Legacy profiles have no owner_id. They are intentionally NOT claimable by username.
export async function ownedProfile(username: string, userId: string): Promise<boolean> {
  const settings = config();
  if (!settings) return false;
  const response = await fetch(`${settings.url}/rest/v1/link_hubs?username=eq.${encodeURIComponent(username)}&select=owner_id&limit=1`, {
    headers: adminHeaders(settings.secret), cache: "no-store",
  });
  if (!response.ok) return false;
  const rows = await response.json() as Array<{owner_id?: string | null}>;
  return rows.length > 0 && rows[0].owner_id === userId;
}
