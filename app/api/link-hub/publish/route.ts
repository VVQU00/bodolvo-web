import { authenticatedUser, unauthorized, adminHeaders } from "@/lib/linkHubAuth";
import { NextResponse } from "next/server";

type PublishBody = {
  state?: unknown;
};

type LinkHubProfile = {
  username?: unknown;
};

type LinkHubState = {
  profile?: LinkHubProfile;
};

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  const userId = await authenticatedUser(request);
  if (!userId) return unauthorized();
  try {
    const body = (await request.json()) as PublishBody;

    if (
      !body.state ||
      typeof body.state !== "object" ||
      Array.isArray(body.state)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Link Hub state is required.",
        },
        {
          status: 400,
        }
      );
    }

    const state = body.state as LinkHubState;

    const rawUsername =
      typeof state.profile?.username === "string"
        ? state.profile.username
        : "";

    const username =
      normalizeUsername(rawUsername);

    if (!username) {
      return NextResponse.json(
        {
          ok: false,
          error: "Choose a username before publishing.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error(
        "Link Hub publish route is missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Publishing is not configured yet.",
        },
        {
          status: 503,
        }
      );
    }

    const normalizedState = {
      ...(body.state as Record<string, unknown>),
      profile: {
        ...((state.profile ?? {}) as Record<string, unknown>),
        username,
      },
    };

    const publishedAt = new Date().toISOString();
    // A username may be created by its first owner, never adopted or overwritten.
    // On an existing username, a conditional update permits its owner only.
    const existingResponse = await fetch(
      `${supabaseUrl}/rest/v1/link_hubs?username=eq.${encodeURIComponent(username)}&select=owner_id&limit=1`,
      { headers: adminHeaders(secretKey), cache: "no-store" }
    );
    if (!existingResponse.ok) return NextResponse.json({ok:false,error:"Could not verify profile ownership. Run the Link Hub database migration."},{status:503});
    const existing = await existingResponse.json() as Array<{owner_id?: string | null}>;
    if (existing.length && existing[0].owner_id !== userId) {
      return NextResponse.json({ok:false,error:"This username is unavailable or belongs to another account."},{status:409});
    }
    const response = await fetch(
      existing.length
        ? `${supabaseUrl}/rest/v1/link_hubs?username=eq.${encodeURIComponent(username)}&owner_id=eq.${encodeURIComponent(userId)}`
        : `${supabaseUrl}/rest/v1/link_hubs`,
      {
        method: existing.length ? "PATCH" : "POST",
        headers: { ...adminHeaders(secretKey), Prefer: "return=representation" },
        body: JSON.stringify({
          ...(existing.length ? {} : { username, owner_id: userId }),
          state: normalizedState, published_at: publishedAt, updated_at: publishedAt,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const message =
        await response.text();

      console.error(
        "Supabase Link Hub publish failed:",
        response.status,
        message
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Could not publish this Link Hub.",
        },
        {
          status: response.status === 409 ? 409 : 500,
        }
      );
    }

    const rows = (await response.json()) as Array<{
      username?: string;
      published_at?: string;
    }>;

    const published =
      rows[0] ?? {};

    return NextResponse.json({
      ok: true,
      username:
        published.username ??
        username,
      publishedAt:
        published.published_at ??
        publishedAt,
      state: normalizedState,
    });
  } catch (error) {
    console.error(
      "Link Hub publish route failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Could not process this publish request.",
      },
      {
        status: 500,
      }
    );
  }
}
