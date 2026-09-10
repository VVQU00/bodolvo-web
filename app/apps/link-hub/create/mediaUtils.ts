export type VideoEmbed =
  | {
      kind: "youtube";
      src: string;
    }
  | {
      kind: "vimeo";
      src: string;
    }
  | {
      kind: "direct";
      src: string;
    }
  | {
      kind: "link";
      src: string;
    };

export type MusicEmbed =
  | {
      kind: "spotify";
      src: string;
      height: number;
    }
  | {
      kind: "soundcloud";
      src: string;
      height: number;
    }
  | {
      kind: "direct";
      src: string;
    }
  | {
      kind: "link";
      src: string;
    };

function safeUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

export function getVideoEmbed(
  value: string
): VideoEmbed | null {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "#") {
    return null;
  }

  const url = safeUrl(trimmed);

  if (!url) {
    return {
      kind: "link",
      src: trimmed,
    };
  }

  const host = url.hostname
    .replace(/^www\./, "")
    .toLowerCase();

  if (
    host === "youtube.com" ||
    host === "m.youtube.com"
  ) {
    let id = "";

    if (url.pathname === "/watch") {
      id = url.searchParams.get("v") || "";
    } else if (
      url.pathname.startsWith("/shorts/")
    ) {
      id =
        url.pathname.split("/")[2] || "";
    } else if (
      url.pathname.startsWith("/embed/")
    ) {
      id =
        url.pathname.split("/")[2] || "";
    }

    if (id) {
      return {
        kind: "youtube",
        src: `https://www.youtube.com/embed/${id}`,
      };
    }
  }

  if (host === "youtu.be") {
    const id =
      url.pathname
        .replace(/^\/+/, "")
        .split("/")[0] || "";

    if (id) {
      return {
        kind: "youtube",
        src: `https://www.youtube.com/embed/${id}`,
      };
    }
  }

  if (
    host === "vimeo.com" ||
    host === "player.vimeo.com"
  ) {
    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    const id =
      host === "player.vimeo.com"
        ? parts.find(
            (part, index) =>
              parts[index - 1] === "video"
          ) || ""
        : parts.find((part) =>
            /^\d+$/.test(part)
          ) || "";

    if (id) {
      return {
        kind: "vimeo",
        src: `https://player.vimeo.com/video/${id}`,
      };
    }
  }

  if (
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(
      trimmed
    )
  ) {
    return {
      kind: "direct",
      src: trimmed,
    };
  }

  return {
    kind: "link",
    src: trimmed,
  };
}

export function getMusicEmbed(
  value: string
): MusicEmbed | null {
  const trimmed = value.trim();

  if (!trimmed || trimmed === "#") {
    return null;
  }

  const url = safeUrl(trimmed);

  if (!url) {
    return {
      kind: "link",
      src: trimmed,
    };
  }

  const host = url.hostname
    .replace(/^www\./, "")
    .toLowerCase();

  if (
    host === "open.spotify.com"
  ) {
    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    const type = parts[0];
    const id = parts[1];

    if (
      id &&
      [
        "track",
        "album",
        "playlist",
        "episode",
        "show",
      ].includes(type)
    ) {
      const height =
        type === "track" ||
        type === "episode"
          ? 152
          : 352;

      return {
        kind: "spotify",
        src: `https://open.spotify.com/embed/${type}/${id}`,
        height,
      };
    }
  }

  if (
    host === "soundcloud.com" ||
    host === "m.soundcloud.com"
  ) {
    return {
      kind: "soundcloud",
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(
        trimmed
      )}&color=%236657ff&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false`,
      height: 166,
    };
  }

  if (
    /\.(mp3|wav|ogg|m4a|aac)(\?.*)?$/i.test(
      trimmed
    )
  ) {
    return {
      kind: "direct",
      src: trimmed,
    };
  }

  return {
    kind: "link",
    src: trimmed,
  };
}
