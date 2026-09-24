// app/apps/qr-barcode/components/QRPreview.tsx

"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import QRCode from "qrcode";

type QRPreviewProps = {
  value: string;
};

export type QRPreviewHandle = {
  getImage: () => string | null;
};

const QRPreview = forwardRef<
  QRPreviewHandle,
  QRPreviewProps
>(({ value }, ref) => {
  const [qrImage, setQrImage] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const hasValue = value.trim().length > 0;

  useEffect(() => {
    async function generateQR() {
      const text = hasValue ? value.trim() : " ";

      try {
        const dataUrl = await QRCode.toDataURL(text, {
          width: 380,
          margin: 1,
          color: {
            dark: "#07090D",
            light: "#FFFFFF",
          },
        });

        setQrImage(dataUrl);
      } catch (error) {
        console.error("QR generation failed:", error);
        setQrImage("");
      }
    }

    generateQR();
  }, [value, hasValue]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !qrImage) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const image = new Image();

    image.onload = () => {
      const width = 500;
      const height = 570;

      canvas.width = width;
      canvas.height = height;

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, width, height);

      const qrSize = 380;
      const qrX = (width - qrSize) / 2;
      const qrY = 45;

      context.drawImage(
        image,
        qrX,
        qrY,
        qrSize,
        qrSize,
      );

      context.fillStyle = "#64748B";
      context.font =
        '600 13px Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      context.textAlign = "center";

      context.fillText(
        "✓  Generated privately with Bodolvo Scanner",
        width / 2,
        480,
      );
    };

    image.src = qrImage;
  }, [qrImage]);

  useImperativeHandle(
    ref,
    () => ({
      getImage() {
        const canvas = canvasRef.current;

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
            QR Code
          </div>
        </div>

        <div className="statusBadge">
          <span className="statusDot" />

          <span className="statusText">
            Ready
          </span>
        </div>
      </div>

      <div className="previewArea">
        <div className="webPreview">
          <div className="qrBackground">
            <div className="qrFrame">
              {qrImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImage}
                  alt="Generated QR code"
                  className="qrCode"
                />
              ) : null}
            </div>

            <div className="brandRow">
              <span className="webShieldIcon">
                ✓
              </span>

              <span className="brandText">
                Generated privately with Bodolvo Scanner
              </span>
            </div>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="captureCanvas"
          aria-hidden="true"
        />
      </div>

      <p className="description">
        Scan with any standard camera or QR reader.
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
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
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

        .statusDot {
          width: 6px;
          height: 6px;
          background-color: #22c55e;
          border-radius: 999px;
          margin-right: 6px;
        }

        .statusText {
          color: #86efac;
          font-size: 11px;
          font-weight: 700;
        }

        .previewArea {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .webPreview {
          width: 100%;
          background-color: #ffffff;
          border-radius: 20px;
          overflow: hidden;
        }

        .qrBackground {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          padding: 24px 20px;
        }

        .qrFrame {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ffffff;
          padding: 8px;
        }

        .qrCode {
          width: 190px;
          height: 190px;
          display: block;
        }

        .brandRow {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 14px;
        }

        .brandText {
          color: #64748b;
          font-size: 10px;
          font-weight: 600;
          text-align: center;
        }

        .description {
          color: #64748b;
          font-size: 12px;
          line-height: 17px;
          text-align: center;
          margin: 13px 0 0;
        }

        .webShieldIcon {
          color: #64748b;
          font-size: 14px;
          font-weight: 900;
          line-height: 16px;
        }

        .captureCanvas {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
});

QRPreview.displayName = "QRPreview";

export default QRPreview;