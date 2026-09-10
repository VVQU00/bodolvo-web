import { NextResponse } from "next/server";

type AnalyticsBody = {
  username?: unknown;
  eventType?: unknown;
  blockId?: unknown;
  blockType?: unknown;
  destination?: unknown;
  referrer?: unknown;
};

const ALLOWED_EVENT_TYPES = new Set([
  "page_view",
  "block_click",
]);

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

function cleanOptionalText(
  value: unknown,
  maxLength: number
) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();

  if (!cleaned) {
    return null;
  }

  return cleaned.slice(0, maxLength);
}

function normalizeBlockId(value: unknown) {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.trunc(value);
  }

  if (
    typeof value === "string" &&
    /^\d+$/.test(value)
  ) {
    return Number(value);
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as AnalyticsBody;

    const username =
      typeof body.username === "string"
        ? normalizeUsername(body.username)
        : "";

    const eventType =
      typeof body.eventType === "string"
        ? body.eventType.trim()
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

    if (
      !ALLOWED_EVENT_TYPES.has(eventType)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid analytics event type.",
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
        "Link Hub analytics route is missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          ok: false,
          error: "Analytics is not configured yet.",
        },
        {
          status: 503,
        }
      );
    }

    const blockId =
      normalizeBlockId(body.blockId);

    const blockType =
      cleanOptionalText(
        body.blockType,
        80
      );

    const destination =
      cleanOptionalText(
        body.destination,
        2048
      );

    const referrer =
      cleanOptionalText(
        body.referrer,
        2048
      );

    const response = await fetch(
      `${supabaseUrl}/rest/v1/link_hub_events`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          hub_username: username,
          event_type: eventType,
          block_id: blockId,
          block_type: blockType,
          destination,
          referrer,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const message =
        await response.text();

      console.error(
        "Supabase Link Hub analytics insert failed:",
        response.status,
        message
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not record analytics event.",
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
      "Link Hub analytics route failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not process analytics event.",
      },
      {
        status: 500,
      }
    );
  }
}
