// app/apps/qr-barcode/utils/qrImage.ts

import type { RefObject } from "react";

type CodeImageHandle = {
  getImage: () => string | null;
};

export async function createCodeImage(
  codeRef: RefObject<CodeImageHandle | null>,
): Promise<string> {
  if (!codeRef.current) {
    throw new Error("Code preview is not ready.");
  }

  const image = codeRef.current.getImage();

  if (!image) {
    throw new Error("Code preview is not ready.");
  }

  return image;
}