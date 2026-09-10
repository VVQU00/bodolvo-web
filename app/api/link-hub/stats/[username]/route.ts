import { NextResponse } from "next/server";

type LinkHubEventRow = {
  event_type: "page_view" | "block_click";
  block_id: number | null;
  block_type: string | null;
  destination: string | null;
  referrer: string | null;
  created_at: string;
};

function normalizeUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

function clampDays(value: number) {
  if (!Number.isFinite(value)) {
    return 30;
  }

  return Math.min(
    365,
    Math.max(1, Math.trunc(value))
  );
}

function getDayKey(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function getReferrerHost(value: string | null) {
  if (!value) {
    return "Direct";
  }

  try {
    const url = new URL(value);

    return (
      url.hostname.replace(/^www\./, "") ||
      "Direct"
    );
  } catch {
    return "Direct";
  }
}

export async function GET(
  request: Request,
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

    const url = new URL(request.url);

    const days = clampDays(
      Number(
        url.searchParams.get("days") ||
          "30"
      )
    );

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error(
        "Link Hub stats route is missing Supabase environment variables."
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Analytics is not configured yet.",
        },
        {
          status: 503,
        }
      );
    }

    const startDate = new Date();

    startDate.setUTCDate(
      startDate.getUTCDate() -
        (days - 1)
    );

    startDate.setUTCHours(
      0,
      0,
      0,
      0
    );

    const endpoint =
      `${supabaseUrl}/rest/v1/link_hub_events` +
      `?hub_username=eq.${encodeURIComponent(
        username
      )}` +
      `&created_at=gte.${encodeURIComponent(
        startDate.toISOString()
      )}` +
      "&select=event_type,block_id,block_type,destination,referrer,created_at" +
      "&order=created_at.asc";

    const response = await fetch(
      endpoint,
      {
        method: "GET",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const message =
        await response.text();

      console.error(
        "Supabase Link Hub stats fetch failed:",
        response.status,
        message
      );

      return NextResponse.json(
        {
          ok: false,
          error:
            "Could not load Link Hub analytics.",
        },
        {
          status: 500,
        }
      );
    }

    const events =
      (await response.json()) as LinkHubEventRow[];

    const dailyMap = new Map<
      string,
      {
        views: number;
        clicks: number;
      }
    >();

    for (
      let offset = 0;
      offset < days;
      offset += 1
    ) {
      const day = new Date(
        startDate
      );

      day.setUTCDate(
        startDate.getUTCDate() +
          offset
      );

      dailyMap.set(
        day.toISOString().slice(
          0,
          10
        ),
        {
          views: 0,
          clicks: 0,
        }
      );
    }

    const blockMap = new Map<
      string,
      {
        blockId: number | null;
        blockType: string;
        destination: string | null;
        clicks: number;
      }
    >();

    const referrerMap =
      new Map<string, number>();

    let views = 0;
    let clicks = 0;

    events.forEach((event) => {
      const dayKey =
        getDayKey(
          event.created_at
        );

      const daily =
        dailyMap.get(dayKey);

      if (
        event.event_type ===
        "page_view"
      ) {
        views += 1;

        if (daily) {
          daily.views += 1;
        }

        const referrer =
          getReferrerHost(
            event.referrer
          );

        referrerMap.set(
          referrer,
          (referrerMap.get(
            referrer
          ) || 0) + 1
        );

        return;
      }

      if (
        event.event_type ===
        "block_click"
      ) {
        clicks += 1;

        if (daily) {
          daily.clicks += 1;
        }

        const blockKey =
          `${event.block_id ?? "none"}:${event.block_type ?? "unknown"}:${event.destination ?? ""}`;

        const current =
          blockMap.get(blockKey);

        if (current) {
          current.clicks += 1;
        } else {
          blockMap.set(
            blockKey,
            {
              blockId:
                event.block_id,
              blockType:
                event.block_type ||
                "unknown",
              destination:
                event.destination,
              clicks: 1,
            }
          );
        }
      }
    });

    const daily = Array.from(
      dailyMap.entries()
    ).map(
      ([
        date,
        counts,
      ]) => ({
        date,
        ...counts,
      })
    );

    const topBlocks =
      Array.from(
        blockMap.values()
      )
        .sort(
          (a, b) =>
            b.clicks -
            a.clicks
        )
        .slice(0, 10);

    const topReferrers =
      Array.from(
        referrerMap.entries()
      )
        .map(
          ([
            referrer,
            count,
          ]) => ({
            referrer,
            views: count,
          })
        )
        .sort(
          (a, b) =>
            b.views -
            a.views
        )
        .slice(0, 10);

    const clickThroughRate =
      views > 0
        ? Number(
            (
              (clicks / views) *
              100
            ).toFixed(1)
          )
        : 0;

    return NextResponse.json({
      ok: true,
      username,
      days,
      totals: {
        views,
        clicks,
        clickThroughRate,
      },
      daily,
      topBlocks,
      topReferrers,
    });
  } catch (error) {
    console.error(
      "Link Hub stats route failed:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not process Link Hub analytics.",
      },
      {
        status: 500,
      }
    );
  }
}
