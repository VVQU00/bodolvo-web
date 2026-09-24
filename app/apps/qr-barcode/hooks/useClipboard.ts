// app/apps/qr-barcode/hooks/useClipboard.ts

"use client";

import { useState } from "react";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  async function copy(value: string) {
    const text = value.trim();

    if (!text) {
      window.alert(
        "Nothing to copy\n\nEnter some text, a URL, or a product code first.",
      );

      return false;
    }

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);

      return true;
    } catch (error) {
      console.error("Copy failed:", error);

      window.alert(
        "Copy failed\n\nThe content could not be copied.",
      );

      return false;
    }
  }

  return {
    copied,
    copy,
  };
}