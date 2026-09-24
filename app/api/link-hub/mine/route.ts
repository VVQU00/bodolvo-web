import { NextResponse } from "next/server";
import { authenticatedUser, unauthorized, adminHeaders, config } from "@/lib/linkHubAuth";

// Only return profiles belonging to the verified signed-in account.
export async function GET(request: Request) {
  const userId = await authenticatedUser(request);
  if (!userId) return unauthorized();
  const settings = config();
  if (!settings) return NextResponse.json({ ok: false, error: "Link Hub is not configured." }, { status: 503 });
  try {
    const query = new URLSearchParams({
      owner_id: `eq.${userId}`,
      select: "username,state,updated_at",
      order: "updated_at.desc",
      limit: "100",
    });
    const response = await fetch(`${settings.url}/rest/v1/link_hubs?${query}`, {
      headers: adminHeaders(settings.secret), cache: "no-store",
    });
    if (!response.ok) {
      console.error("Link Hub owned-profile lookup failed", response.status);
      return NextResponse.json({ ok: false, error: "Could not load your profiles." }, { status: 502 });
    }
    const profiles = await response.json() as unknown;
    if (!Array.isArray(profiles)) throw new Error("Unexpected profile response");
    return NextResponse.json({ ok: true, profiles }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not load your profiles." }, { status: 500 });
  }
}
