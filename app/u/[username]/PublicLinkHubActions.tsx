"use client";

import {
  Check,
  Copy,
  Share2,
} from "lucide-react";
import { useState } from "react";

type Props = {
  username: string;
};

export default function PublicLinkHubActions({
  username,
}: Props) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window === "undefined") {
      return `/u/${username}`;
    }

    return window.location.href;
  };

  const copyLink = async () => {
    const url = getUrl();

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      const textarea =
        document.createElement("textarea");

      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";

      document.body.appendChild(textarea);
      textarea.select();

      document.execCommand("copy");

      document.body.removeChild(textarea);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  };

  const sharePage = async () => {
    const url = getUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `@${username}`,
          url,
        });

        return;
      } catch {
        return;
      }
    }

    await copyLink();
  };

  return (
    <div className="fixed right-4 top-4 z-[80] flex items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="flex h-11 items-center gap-2 rounded-full border border-white/30 bg-black/70 px-4 text-xs font-bold text-white shadow-lg backdrop-blur-xl transition hover:bg-black"
        aria-label="Copy Link Hub URL"
      >
        {copied ? (
          <>
            <Check size={15} />
            Copied
          </>
        ) : (
          <>
            <Copy size={15} />
            Copy
          </>
        )}
      </button>

      <button
        type="button"
        onClick={sharePage}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-lg backdrop-blur-xl transition hover:bg-black"
        aria-label="Share Link Hub"
      >
        <Share2 size={16} />
      </button>
    </div>
  );
}
