// app/apps/qr-barcode/hooks/useSaving.ts

"use client";

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

export function useSaving() {
  const [isSaving, setIsSaving] = useState(false);

  async function save(
    value: string,
    codeType: CodeType,
    codeRef: React.RefObject<CodeImageHandle | null>,
  ) {
    const text = value.trim();

    if (!text) {
      window.alert(
        "Nothing to save\n\nEnter some text, a URL, or a product code first.",
      );

      return false;
    }

    try {
      setIsSaving(true);

      const dataUrl = codeRef.current?.getImage();

      if (!dataUrl) {
        throw new Error(
          `Could not create the ${getCodeName(
            codeType,
          )} image.`,
        );
      }

      const blob = await dataUrlToBlob(dataUrl);

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = getFileName(codeType);
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 2000);

      return true;
    } catch (error) {
      console.error("Save failed:", error);

      window.alert(
        `Save failed\n\nBodolvo Scanner could not save the ${getCodeName(
          codeType,
        )}.`,
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return {
    isSaving,
    save,
  };
}