// app/apps/qr-barcode/components/ScanButton.tsx

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import jsQR from "jsqr";

export default function ScanButton() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isScanningImage, setIsScanningImage] =
    useState(false);

  function showMessage(title: string, message: string) {
    window.alert(`${title}\n\n${message}`);
  }

  async function scanQrOnWeb(file: File) {
    const imageUrl = URL.createObjectURL(file);

    try {
      const image = new Image();

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();

        image.onerror = () =>
          reject(
            new Error(
              "Could not load the selected image.",
            ),
          );

        image.src = imageUrl;
      });

      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "Could not prepare image for scanning.",
        );
      }

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const imageData = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const result = jsQR(
        imageData.data,
        imageData.width,
        imageData.height,
        {
          inversionAttempts: "attemptBoth",
        },
      );

      if (!result) {
        return null;
      }

      return {
        data: result.data,
        type: "qr",
      };
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  async function handleSelectedImage(file: File) {
    if (isScanningImage) {
      return;
    }

    try {
      setIsScanningImage(true);

      const detected = await scanQrOnWeb(file);

      if (!detected) {
        showMessage(
          "No code found",
          "Bodolvo Scanner could not detect a QR code in this image. Web image scanning currently supports QR codes.",
        );

        return;
      }

      const params = new URLSearchParams({
        value: detected.data,
        type: detected.type,
      });

      router.push(
        `/apps/qr-barcode/scan-result?${params.toString()}`,
      );
    } catch (error) {
      console.error("Image scan failed:", error);

      showMessage(
        "Scan failed",
        error instanceof Error
          ? error.message
          : "Bodolvo Scanner could not scan this image.",
      );
    } finally {
      setIsScanningImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <div className="container">
      <button
        type="button"
        className="primaryButton"
        onClick={() =>
          router.push("/apps/qr-barcode/scanner")
        }
      >
        <span className="primaryIcon">
          <span className="webPrimaryIcon">⌗</span>
        </span>

        <span className="textContainer">
          <span className="primaryTitle">
            Scan with camera
          </span>

          <span className="primarySubtitle">
            Point your camera at a QR code or barcode
          </span>
        </span>

        <span className="webChevron">›</span>
      </button>

      <button
        type="button"
        className={`secondaryButton ${
          isScanningImage ? "disabledButton" : ""
        }`}
        onClick={() => {
          if (!isScanningImage) {
            fileInputRef.current?.click();
          }
        }}
        disabled={isScanningImage}
      >
        <span className="secondaryIcon">
          <span className="webSecondaryIcon">
            {isScanningImage ? "⌛" : "▧"}
          </span>
        </span>

        <span className="textContainer">
          <span className="secondaryTitle">
            {isScanningImage
              ? "Scanning image..."
              : "Scan from image"}
          </span>

          <span className="secondarySubtitle">
            {isScanningImage
              ? "Looking for a QR code"
              : "Choose a screenshot or photo from your device"}
          </span>
        </span>

        {!isScanningImage && (
          <span className="webChevron">›</span>
        )}
      </button>

      <input
        ref={fileInputRef}
        className="fileInput"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            handleSelectedImage(file);
          }
        }}
      />

      <style jsx>{`
        .container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 22px;
        }

        .primaryButton,
        .secondaryButton {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .primaryButton {
          min-height: 72px;
          background-color: #ffffff;
          border: 1px solid #2f6fed;
          border-radius: 18px;
          padding: 12px 14px;
        }

        .secondaryButton {
          min-height: 68px;
          background-color: #0c1017;
          border: 1px solid #d9d9d9;
          border-radius: 18px;
          padding: 11px 14px;
        }

        .primaryButton:active,
        .secondaryButton:active:not(:disabled) {
          opacity: 0.72;
          transform: scale(0.98);
        }

        .disabledButton {
          opacity: 0.65;
          cursor: default;
        }

        .primaryIcon {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #171717;
          border-radius: 14px;
          margin-right: 12px;
        }

        .secondaryIcon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #101c31;
          border-radius: 13px;
          margin-right: 12px;
        }

        .textContainer {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .primaryTitle {
          color: #171717;
          font-size: 15px;
          font-weight: 900;
        }

        .primarySubtitle {
          color: #555555;
          font-size: 11px;
          line-height: 16px;
          margin-top: 3px;
        }

        .secondaryTitle {
          color: #f8fafc;
          font-size: 14px;
          font-weight: 800;
        }

        .secondarySubtitle {
          color: #6f798a;
          font-size: 11px;
          line-height: 16px;
          margin-top: 3px;
        }

        .webPrimaryIcon {
          color: #171717;
          font-size: 24px;
          font-weight: 900;
        }

        .webSecondaryIcon {
          color: #171717;
          font-size: 21px;
          font-weight: 800;
        }

        .webChevron {
          color: #94a3b8;
          font-size: 28px;
          line-height: 28px;
          margin-left: 10px;
        }

        .fileInput {
          display: none;
        }
      `}</style>
    </div>
  );
}