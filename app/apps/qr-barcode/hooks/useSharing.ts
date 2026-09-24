// app/apps/qr-barcode/hooks/useSharing.ts

"use client";

import type { RefObject } from "react";
import { useState } from "react";

type CodeType = "qr" | "barcode";

type CodeImageHandle = {
  getImage: () => string | null;
};

function getCodeName(codeType: CodeType) {
  return codeType === "qr" ? "QR code" : "barcode";
}

function getFileName(codeType: CodeType) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  return `bodolvo-${codeType}-${timestamp}.png`;
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new Error("Could not create code image.");
  }

  return await response.blob();
}

export function useSharing() {
  const [isSharing, setIsSharing] = useState(false);

  async function share(
    value: string,
    codeType: CodeType,
    codeRef: RefObject<CodeImageHandle | null>,
  ) {
    const text = value.trim();

    if (!text) {
      window.alert(
        "Nothing to share\n\nEnter some text, a URL, or a product code first.",
      );

      return false;
    }

    try {
      setIsSharing(true);

      const dataUrl = codeRef.current?.getImage();

      if (!dataUrl) {
        throw new Error(
          `Could not create the ${getCodeName(
            codeType,
          )} image.`,
        );
      }

      const blob = await dataUrlToBlob(dataUrl);

      const file = new File(
        [blob],
        getFileName(codeType),
        {
          type: "image/png",
        },
      );

      if (
        typeof navigator !== "undefined" &&
        navigator.share
      ) {
        const canShareFile =
          !navigator.canShare ||
          navigator.canShare({
            files: [file],
          });

        if (canShareFile) {
          await navigator.share({
            title:
              codeType === "qr"
                ? "Bodolvo QR Code"
                : "Bodolvo Barcode",
            text,
            files: [file],
          });

          return true;
        }

        await navigator.share({
          title:
            codeType === "qr"
              ? "Bodolvo QR Code"
              : "Bodolvo Barcode",
          text,
        });

        return true;
      }

      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(text);

        window.alert(
          "Your browser cannot open the share sheet, so the code content was copied instead.",
        );

        return true;
      }

      return false;
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return false;
      }

      console.error("Share failed:", error);

      window.alert(
        `Share failed\n\nBodolvo Scanner could not share the ${getCodeName(
          codeType,
        )}.`,
      );

      return false;
    } finally {
      setIsSharing(false);
    }
  }

  return {
    isSharing,
    share,
  };
}