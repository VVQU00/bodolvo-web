import { NextResponse } from "next/server";

type SubscribeBody = {
  username?: unknown;
  email?: unknown;
};

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubscribeBody;

    const username =
      typeof body.username === "string"
        ? normalizeUsername(body.username)
        : "";

    const email =
      typeof body.email === "string"
        ? normalizeEmail(body.email)
        : "";

    if (!username) {
      return NextResponse.json(
        {
          ok: false,
          error: "A Link Hub username is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Enter a valid email address.",
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
        "Link Hub subscribe route is missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Email signup is not configured yet.",
        },
        {
          status: 503,
        }
      );
    }

    const endpoint =
      `${supabaseUrl}/rest/v1/link_hub_subscribers` +
      "?on_conflict=hub_username,email";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: secretKey,
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        Prefer:
          "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({
        hub_username: username,
        email,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text();

      console.error(
        "Supabase Link Hub subscriber insert failed:",
        response.status,
        message
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not save your email right now.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "Link Hub subscribe route failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not process that signup.",
      },
      {
        status: 500,
      }
    );
  }
}
