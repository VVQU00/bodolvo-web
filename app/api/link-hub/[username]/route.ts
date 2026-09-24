import { NextResponse } from "next/server";

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      username: string;
    }>;
  }
) {
  try {
    const { username: rawUsername } =
      await context.params;

    const username =
      normalizeUsername(rawUsername);

    if (!username) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid username.",
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
        "Link Hub public route is missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Link Hub is not configured.",
        },
        {
          status: 503,
        }
      );
    }

    const endpoint =
      `${supabaseUrl}/rest/v1/link_hubs` +
      `?username=eq.${encodeURIComponent(username)}` +
      "&select=username,state,published_at,updated_at" +
      "&limit=1";

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const message =
        await response.text();

      console.error(
        "Supabase Link Hub fetch failed:",
        response.status,
        message
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Could not load this Link Hub.",
        },
        {
          status: 500,
        }
      );
    }

    const rows = (await response.json()) as Array<{
      username: string;
      state: unknown;
      published_at: string;
      updated_at: string;
    }>;

    const row = rows[0];

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          error: "Link Hub not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      ok: true,
      username: row.username,
      state: row.state,
      publishedAt: row.published_at,
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error(
      "Link Hub public fetch route failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error: "Could not load this Link Hub.",
      },
      {
        status: 500,
      }
    );
  }
}
