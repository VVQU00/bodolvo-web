// app/apps/qr-barcode/components/BarcodePreview.tsx

"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import bwipjs from "bwip-js";

type BarcodePreviewProps = {
  value: string;
};

export type BarcodePreviewHandle = {
  getImage: () => string | null;
};

const BarcodePreview = forwardRef<
  BarcodePreviewHandle,
  BarcodePreviewProps
>(({ value }, ref) => {
  const [barcodeImage, setBarcodeImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const barcodeValue = value.trim() || "123456789";
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    setBarcodeImage("");
    setError("");
    setLoading(true);

    try {
      bwipjs.toCanvas(canvas, {
        bcid: "code128",
        text: barcodeValue,
        scale: window.devicePixelRatio || 1,
        height: 14,
        includetext: true,
        textxalign: "center",
        backgroundcolor: "FFFFFF",
      });

      const dataUrl = canvas.toDataURL("image/png");

      setBarcodeImage(dataUrl);
      setLoading(false);
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        "This content cannot be displayed as a barcode.",
      );

      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    const captureCanvas = captureCanvasRef.current;

    if (!captureCanvas || !barcodeImage) {
      return;
    }

    const context = captureCanvas.getContext("2d");

    if (!context) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      const width = 700;
      const height = 300;

      captureCanvas.width = width;
      captureCanvas.height = height;

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, width, height);

      const maxWidth = 620;
      const maxHeight = 150;

      let drawWidth = image.width;
      let drawHeight = image.height;

      const widthRatio = maxWidth / drawWidth;
      const heightRatio = maxHeight / drawHeight;
      const ratio = Math.min(
        widthRatio,
        heightRatio,
        1,
      );

      drawWidth *= ratio;
      drawHeight *= ratio;

      const x = (width - drawWidth) / 2;
      const y = 45;

      context.drawImage(
        image,
        x,
        y,
        drawWidth,
        drawHeight,
      );

      context.fillStyle = "#64748B";
      context.font =
        '600 13px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      context.textAlign = "center";

      context.fillText(
        "✓  Generated privately with Bodolvo Scanner",
        width / 2,
        245,
      );
    };

    image.src = barcodeImage;
  }, [barcodeImage]);

  useImperativeHandle(
    ref,
    () => ({
      getImage() {
        const canvas = captureCanvasRef.current;

        if (!canvas) {
          return null;
        }

        try {
          return canvas.toDataURL("image/png");
        } catch {
          return null;
        }
      },
    }),
    [],
  );

  return (
    <div className="outerCard">
      <div className="topRow">
        <div>
          <div className="previewLabel">
            LIVE PREVIEW
          </div>

          <div className="previewTitle">
            Code 128 Barcode
          </div>
        </div>

        <div
          className={`statusBadge ${
            error ? "errorStatusBadge" : ""
          }`}
        >
          <span
            className={`statusDot ${
              error ? "errorStatusDot" : ""
            }`}
          />

          <span
            className={`statusText ${
              error ? "errorStatusText" : ""
            }`}
          >
            {error ? "Error" : "Ready"}
          </span>
        </div>
      </div>

      <div className="webPreview">
        <div className="barcodeCard">
          {error ? (
            <div className="errorContainer">
              <span className="webErrorIcon">!</span>

              <div className="errorTitle">
                Invalid barcode value
              </div>

              <div className="errorText">
                {error}
              </div>
            </div>
          ) : barcodeImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="bodolvo-barcode-image"
                src={barcodeImage}
                alt="Generated Code 128 barcode"
                className="barcodeImage"
              />

              <div className="brandRow">
                <span className="webShieldIcon">
                  ✓
                </span>

                <span className="brandText">
                  Generated privately with Bodolvo Scanner
                </span>
              </div>
            </>
          ) : loading ? (
            <div className="loadingContainer">
              <span className="spinner" />

              <span className="loadingText">
                Creating barcode...
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="generatorCanvas"
        aria-hidden="true"
      />

      <canvas
        ref={captureCanvasRef}
        className="captureCanvas"
        aria-hidden="true"
      />

      <p className="description">
        Code 128 supports letters, numbers, and common symbols.
      </p>

      <style jsx>{`
        .outerCard {
          width: 100%;
          background-color: #10141c;
          border: 1px solid #28303d;
          border-radius: 24px;
          padding: 16px;
          margin-top: 18px;
          margin-bottom: 18px;
        }

        .topRow {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 15px;
        }

        .previewLabel {
          color: #3b82f6;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .previewTitle {
          color: #f8fafc;
          font-size: 18px;
          font-weight: 800;
          margin-top: 3px;
        }

        .statusBadge {
          display: flex;
          flex-direction: row;
          align-items: center;
          background-color: #052e16;
          border: 1px solid #14532d;
          border-radius: 999px;
          padding: 6px 10px;
        }

        .errorStatusBadge {
          background-color: #450a0a;
          border-color: #7f1d1d;
        }

        .statusDot {
          width: 6px;
          height: 6px;
          background-color: #22c55e;
          border-radius: 999px;
          margin-right: 6px;
        }

        .errorStatusDot {
          background-color: #ef4444;
        }

        .statusText {
          color: #86efac;
          font-size: 11px;
          font-weight: 700;
        }

        .errorStatusText {
          color: #fca5a5;
        }

        .webPreview {
          width: 100%;
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
        }

        .barcodeCard {
          min-height: 245px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          padding: 24px 18px;
        }

        .barcodeImage {
          width: 100%;
          max-height: 150px;
          object-fit: contain;
          display: block;
        }

        .brandRow {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 5px;
          margin-top: 15px;
        }

        .brandText {
          color: #64748b;
          font-size: 10px;
          font-weight: 600;
        }

        .loadingContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .spinner {
          width: 34px;
          height: 34px;
          border: 4px solid #dbeafe;
          border-top-color: #2563eb;
          border-radius: 999px;
          animation: spin 800ms linear infinite;
        }

        .loadingText {
          color: #64748b;
          font-size: 13px;
          margin-top: 12px;
        }

        .errorContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
        }

        .errorTitle {
          color: #991b1b;
          font-size: 16px;
          font-weight: 800;
          margin-top: 10px;
        }

        .errorText {
          color: #64748b;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          margin-top: 5px;
        }

        .description {
          color: #64748b;
          font-size: 12px;
          line-height: 17px;
          text-align: center;
          margin: 13px 0 0;
        }

        .webErrorIcon {
          color: #ef4444;
          font-size: 30px;
          font-weight: 900;
          line-height: 32px;
        }

        .webShieldIcon {
          color: #64748b;
          font-size: 14px;
          font-weight: 900;
          line-height: 16px;
        }

        .generatorCanvas,
        .captureCanvas {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
});

BarcodePreview.displayName = "BarcodePreview";

export default BarcodePreview;