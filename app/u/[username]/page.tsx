"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Link2,
} from "lucide-react";

import LinkHubRenderer from "../../apps/link-hub/create/LinkHubRenderer";
import PublicLinkHubActions from "./PublicLinkHubActions";

import type {
  Block,
} from "../../apps/link-hub/create/types";

import type {
  LinkHubEditorState,
} from "../../apps/link-hub/create/editorState";

type PublishedLinkHubResponse = {
  ok?: boolean;
  username?: string;
  state?: LinkHubEditorState;
  publishedAt?: string;
  updatedAt?: string;
  error?: string;
};

export default function PublicLinkHubPage() {
  const params = useParams<{
    username: string;
  }>();

  const username =
    typeof params?.username === "string"
      ? params.username
      : "";

  const [published, setPublished] =
    useState<PublishedLinkHubResponse | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const recordedViewRef =
    useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPublishedLinkHub =
      async () => {
        setLoading(true);

        try {
          const response =
            await fetch(
              `/api/link-hub/${encodeURIComponent(
                username
              )}`,
              {
                method: "GET",
                cache: "no-store",
              }
            );

          const result =
            (await response.json()) as PublishedLinkHubResponse;

          if (cancelled) {
            return;
          }

          if (
            !response.ok ||
            !result.ok ||
            !result.state
          ) {
            setPublished(null);
            setLoading(false);
            return;
          }

          setPublished(result);
          setLoading(false);
        } catch (error) {
          console.error(
            "Could not load published Link Hub:",
            error
          );

          if (!cancelled) {
            setPublished(null);
            setLoading(false);
          }
        }
      };

    if (username) {
      loadPublishedLinkHub();
    } else {
      setPublished(null);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    if (
      !published?.state?.profile?.username
    ) {
      return;
    }

    const publishedUsername =
      published.state.profile.username;

    if (
      recordedViewRef.current ===
      publishedUsername
    ) {
      return;
    }

    recordedViewRef.current =
      publishedUsername;

    void fetch(
      "/api/link-hub/analytics",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          username:
            publishedUsername,
          eventType:
            "page_view",
          referrer:
            document.referrer ||
            null,
        }),
        keepalive: true,
      }
    ).catch((error) => {
      console.error(
        "Could not record Link Hub page view:",
        error
      );
    });
  }, [published]);

  const recordBlockClick = (
    block: Block,
    destination?: string | null
  ) => {
    const publishedUsername =
      published?.state?.profile?.username;

    if (!publishedUsername) {
      return;
    }

    void fetch(
      "/api/link-hub/analytics",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          username:
            publishedUsername,
          eventType:
            "block_click",
          blockId:
            block.id,
          blockType:
            block.type,
          destination:
            destination ||
            null,
          referrer:
            document.referrer ||
            null,
        }),
        keepalive: true,
      }
    ).catch((error) => {
      console.error(
        "Could not record Link Hub block click:",
        error
      );
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F0E8] text-[#131313]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-[#6657FF]" />

          <div className="mt-4 text-sm font-bold">
            Loading Link Hub...
          </div>
        </div>
      </main>
    );
  }

  if (
    !published ||
    !published.state
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F0E8] px-6 text-[#131313]">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#6657FF] text-white shadow-[0_18px_45px_rgba(102,87,255,.24)]">
            <Link2 size={24} />
          </div>

          <div className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#6657FF]">
            Bodolvo Link Hub
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em]">
            This page isn&apos;t published.
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-black/45">
            We couldn&apos;t find a published Link Hub for{" "}
            <span className="font-bold text-black">
              @{username || "username"}
            </span>
            .
          </p>

          <Link
            href="/apps/link-hub"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Back to Link Hub
          </Link>
        </div>
      </main>
    );
  }

  const {
    profile,
    socials,
    design,
    blocks,
  } = published.state;

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor:
          design.pageBackground,
      }}
    >
      <PublicLinkHubActions
        username={profile.username}
      />

      <div className="min-h-screen">
        <LinkHubRenderer
          profile={profile}
          socials={socials}
          design={design}
          blocks={blocks}
          previewMode="mobile"
          editable={false}
          onBlockClick={
            recordBlockClick
          }
        />
      </div>
    </main>
  );
}
