"use client";

import type { LinkHubEditorState } from "./editorState";

export type PublishedLinkHub = {
  username: string;
  publishedAt: string;
  state: LinkHubEditorState;
};

const PUBLISHED_INDEX_KEY = "bodolvo-link-hub-published-index-v1";

export function normalizeLinkHubUsername(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/^-+|-+$/g, "");
}

export function getPublishedLinkHubStorageKey(username: string) {
  const normalized = normalizeLinkHubUsername(username);

  return `bodolvo-link-hub-published-${normalized}-v1`;
}

function readPublishedIndex(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(PUBLISHED_INDEX_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is string => typeof item === "string"
    );
  } catch {
    return [];
  }
}

function writePublishedIndex(usernames: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PUBLISHED_INDEX_KEY,
    JSON.stringify(Array.from(new Set(usernames)))
  );
}

export function publishLinkHub(
  state: LinkHubEditorState
): PublishedLinkHub {
  if (typeof window === "undefined") {
    throw new Error("Publishing is only available in the browser.");
  }

  const username = normalizeLinkHubUsername(
    state.profile.username
  );

  if (!username) {
    throw new Error("Choose a username before publishing.");
  }

  const published: PublishedLinkHub = {
    username,
    publishedAt: new Date().toISOString(),

    state: {
      ...state,

      profile: {
        ...state.profile,
        username,
      },
    },
  };

  const key = getPublishedLinkHubStorageKey(username);

  window.localStorage.setItem(
    key,
    JSON.stringify(published)
  );

  const index = readPublishedIndex();

  if (!index.includes(username)) {
    writePublishedIndex([
      ...index,
      username,
    ]);
  }

  return published;
}

export function getPublishedLinkHub(
  username: string
): PublishedLinkHub | null {
  if (typeof window === "undefined") {
    return null;
  }

  const normalized = normalizeLinkHubUsername(username);

  if (!normalized) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(
      getPublishedLinkHubStorageKey(normalized)
    );

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as PublishedLinkHub;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.state ||
      parsed.username !== normalized
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function unpublishLinkHub(username: string) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeLinkHubUsername(username);

  if (!normalized) {
    return;
  }

  window.localStorage.removeItem(
    getPublishedLinkHubStorageKey(normalized)
  );

  writePublishedIndex(
    readPublishedIndex().filter(
      (item) => item !== normalized
    )
  );
}

export function getPublishedLinkHubUsernames() {
  return readPublishedIndex();
}
