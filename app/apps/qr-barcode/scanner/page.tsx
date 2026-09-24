// app/apps/qr-barcode/scanner/page.tsx

"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type PermissionState =
  | "checking"
  | "prompt"
  | "granted"
  | "denied";

type DetectedBarcode = {
  rawValue?: string;
  format?: string;
};

type BarcodeDetectorInstance = {
  detect(
    source: HTMLVideoElement,
  ): Promise<DetectedBarcode[]>;
};

type BarcodeDetectorConstructor = new (options?: {
  formats?: string[];
}) => BarcodeDetectorInstance;

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor;
  }
}

const BARCODE_FORMATS = [
  "qr_code",
  "code_128",
  "code_39",
  "code_93",
  "ean_13",
  "ean_8",
  "upc_a",
  "upc_e",
  "pdf417",
  "aztec",
  "data_matrix",
  "itf",
  "codabar",
];

function normalizeBarcodeType(type?: string) {
  switch (type) {
    case "qr_code":
      return "qr";

    case "code_128":
      return "code128";

    case "code_39":
      return "code39";

    case "code_93":
      return "code93";

    case "ean_13":
      return "ean13";

    case "ean_8":
      return "ean8";

    case "upc_a":
      return "upc_a";

    case "upc_e":
      return "upc_e";

    case "data_matrix":
      return "datamatrix";

    case "itf":
      return "itf14";

    default:
      return type || "unknown";
  }
}

export default function ScannerScreen() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(
    null,
  );

  const streamRef = useRef<MediaStream | null>(null);

  const detectorRef =
    useRef<BarcodeDetectorInstance | null>(null);

  const scanningRef = useRef(false);

  const [permission, setPermission] =
    useState<PermissionState>("checking");

  const [scanned, setScanned] = useState(false);

  const [torchEnabled, setTorchEnabled] =
    useState(false);

  const [cameraError, setCameraError] = useState<
    string | null
  >(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    scanningRef.current = false;
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);

      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setPermission("denied");

        setCameraError(
          "Camera access is not supported by this browser.",
        );

        return false;
      }

      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();
      }

      setPermission("granted");

      return true;
    } catch (error) {
      console.error(
        "Camera permission failed:",
        error,
      );

      setPermission("denied");

      setCameraError(
        "Open your browser settings and allow camera access for Bodolvo Scanner.",
      );

      return false;
    }
  }, [stopCamera]);

  useEffect(() => {
    let cancelled = false;

    async function initializePermission() {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        if (!cancelled) {
          setPermission("denied");

          setCameraError(
            "Camera access is not supported by this browser.",
          );
        }

        return;
      }

      try {
        if (navigator.permissions?.query) {
          const status =
            await navigator.permissions.query({
              name: "camera" as PermissionName,
            });

          if (cancelled) {
            return;
          }

          if (status.state === "granted") {
            await startCamera();

            return;
          }

          if (status.state === "denied") {
            setPermission("denied");

            return;
          }

          setPermission("prompt");

          return;
        }
      } catch {
        // Some browsers do not expose camera
        // permission through navigator.permissions.
      }

      if (!cancelled) {
        setPermission("prompt");
      }
    }

    initializePermission();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (
      permission !== "granted" ||
      scanned ||
      typeof window === "undefined"
    ) {
      return;
    }

    if (!window.BarcodeDetector) {
      setCameraError(
        "Live barcode scanning is not supported by this browser.",
      );

      return;
    }

    try {
      detectorRef.current = new window.BarcodeDetector({
        formats: BARCODE_FORMATS,
      });
    } catch {
      detectorRef.current =
        new window.BarcodeDetector();
    }

    let animationFrame = 0;
    let active = true;

    async function scanFrame() {
      if (!active || scanned) {
        return;
      }

      const video = videoRef.current;
      const detector = detectorRef.current;

      if (
        video &&
        detector &&
        video.readyState >= 2 &&
        !scanningRef.current
      ) {
        scanningRef.current = true;

        try {
          const results =
            await detector.detect(video);

          const result = results[0];

          if (
            result?.rawValue &&
            !scanned
          ) {
            setScanned(true);

            stopCamera();

            const params = new URLSearchParams({
              value: result.rawValue,
              type: normalizeBarcodeType(
                result.format,
              ),
            });

            router.replace(
              `/apps/qr-barcode/scan-result?${params.toString()}`,
            );

            return;
          }
        } catch (error) {
          console.error(
            "Barcode scan failed:",
            error,
          );
        } finally {
          scanningRef.current = false;
        }
      }

      animationFrame =
        window.requestAnimationFrame(scanFrame);
    }

    animationFrame =
      window.requestAnimationFrame(scanFrame);

    return () => {
      active = false;

      window.cancelAnimationFrame(
        animationFrame,
      );
    };
  }, [
    permission,
    router,
    scanned,
    stopCamera,
  ]);

  async function handleTorch() {
    const stream = streamRef.current;

    if (!stream) {
      return;
    }

    const track = stream.getVideoTracks()[0];

    if (!track) {
      return;
    }

    const nextValue = !torchEnabled;

    try {
      await track.applyConstraints({
        advanced: [
          {
            torch: nextValue,
          } as MediaTrackConstraintSet,
        ],
      });

      setTorchEnabled(nextValue);
    } catch (error) {
      console.error(
        "Torch unavailable:",
        error,
      );
    }
  }

  function handleClose() {
    stopCamera();
    router.back();
  }

  if (permission === "checking") {
    return (
      <>
        <main className="permissionScreen">
          <p className="permissionText">
            Checking camera permission...
          </p>
        </main>

        <style jsx>{`
          .permissionScreen {
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #07090d;
            padding: 0 22px;
          }

          .permissionText {
            color: #8b95a7;
            font-size: 14px;
            line-height: 21px;
            text-align: center;
            margin: 9px 0 0;
          }
        `}</style>
      </>
    );
  }

  if (
    permission === "prompt" ||
    permission === "denied"
  ) {
    return (
      <>
        <main className="permissionScreen">
          <section className="permissionCard">
            <div className="permissionIcon">
              <span className="webScannerIcon">
                ⌗
              </span>
            </div>

            <h1 className="permissionTitle">
              Camera access needed
            </h1>

            <p className="permissionText">
              Bodolvo Scanner needs camera access to
              scan QR codes and barcodes.
            </p>

            {cameraError && (
              <p className="errorText">
                {cameraError}
              </p>
            )}

            <button
              className="permissionButton"
              type="button"
              onClick={startCamera}
            >
              Allow Camera
            </button>

            <button
              className="cancelButton"
              type="button"
              onClick={handleClose}
            >
              Cancel
            </button>
          </section>
        </main>

        <style jsx>{`
          * {
            box-sizing: border-box;
          }

          .permissionScreen {
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #07090d;
            padding: 0 22px;
          }

          .permissionCard {
            width: 100%;
            max-width: 460px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: #10141c;
            border: 1px solid #28303d;
            border-radius: 24px;
            padding: 25px;
          }

          .permissionIcon {
            width: 68px;
            height: 68px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #101c31;
            border-radius: 22px;
          }

          .webScannerIcon {
            color: #60a5fa;
            font-size: 32px;
            font-weight: 900;
          }

          .permissionTitle {
            color: #ffffff;
            font-size: 22px;
            font-weight: 900;
            margin: 18px 0 0;
          }

          .permissionText {
            color: #8b95a7;
            font-size: 14px;
            line-height: 21px;
            text-align: center;
            margin: 9px 0 0;
          }

          .errorText {
            color: #fca5a5;
            font-size: 12px;
            line-height: 18px;
            text-align: center;
            margin: 10px 0 0;
          }

          .permissionButton {
            width: 100%;
            min-height: 54px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #2563eb;
            border: 0;
            border-radius: 16px;
            margin-top: 24px;
            color: #ffffff;
            font-size: 16px;
            font-weight: 800;
            cursor: pointer;
          }

          .permissionButton:active {
            opacity: 0.72;
            transform: scale(0.97);
          }

          .cancelButton {
            padding: 13px 20px;
            margin-top: 8px;
            background: transparent;
            border: 0;
            color: #8b95a7;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }

          .cancelButton:active {
            opacity: 0.72;
            transform: scale(0.97);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <main className="container">
        <video
          ref={videoRef}
          className="camera"
          autoPlay
          muted
          playsInline
        />

        <div className="overlay">
          <div className="topBar">
            <button
              type="button"
              className="circleButton"
              onClick={handleClose}
              aria-label="Close scanner"
            >
              <span className="closeIcon">
                ×
              </span>
            </button>

            <div className="titleContainer">
              <span className="brandLabel">
                BODOLVO
              </span>

              <span className="title">
                Scan Code
              </span>

              <span className="subtitle">
                QR codes and barcodes
              </span>
            </div>

            <button
              type="button"
              className={`circleButton ${
                torchEnabled
                  ? "activeTorchButton"
                  : ""
              }`}
              onClick={handleTorch}
              aria-label="Toggle flashlight"
            >
              <span
                className={`flashIcon ${
                  torchEnabled
                    ? "flashIconActive"
                    : ""
                }`}
              >
                ⚡
              </span>
            </button>
          </div>

          <div className="scannerArea">
            <div className="scanFrame">
              <div className="corner topLeft" />

              <div className="corner topRight" />

              <div className="corner bottomLeft" />

              <div className="corner bottomRight" />

              <div className="centerTarget">
                <div className="centerDot" />
              </div>
            </div>

            <div className="instructionCard">
              <span className="webInstructionIcon">
                ⌗
              </span>

              <div className="instructionTextWrapper">
                <p className="instructions">
                  Position a code inside the frame
                </p>

                <p className="helper">
                  Bodolvo Scanner will detect it
                  automatically
                </p>
              </div>
            </div>

            {cameraError && (
              <p className="scannerError">
                {cameraError}
              </p>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .container {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background: #07090d;
        }

        .camera {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #07090d;
        }

        .overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: rgba(7, 9, 13, 0.34);
        }

        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: calc(
              env(safe-area-inset-top) + 12px
            )
            18px 0;
        }

        .circleButton {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(16, 20, 28, 0.88);
          border: 1px solid
            rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          cursor: pointer;
          appearance: none;
        }

        .circleButton:active {
          opacity: 0.72;
          transform: scale(0.97);
        }

        .activeTorchButton {
          background: rgba(113, 63, 18, 0.88);
          border-color: #eab308;
        }

        .closeIcon {
          color: #ffffff;
          font-size: 34px;
          font-weight: 400;
          line-height: 36px;
          margin-top: -2px;
        }

        .flashIcon {
          font-size: 21px;
          line-height: 24px;
        }

        .flashIconActive {
          color: #fde047;
        }

        .titleContainer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .brandLabel {
          color: #60a5fa;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 2px;
        }

        .title {
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
        }

        .subtitle {
          color: #cbd5e1;
          font-size: 11px;
          margin-top: 2px;
        }

        .scannerArea {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 24px 60px;
        }

        .scanFrame {
          width: 275px;
          height: 275px;
          position: relative;
        }

        .corner {
          width: 58px;
          height: 58px;
          position: absolute;
          border-color: #3b82f6;
        }

        .topLeft {
          top: 0;
          left: 0;
          border-top: 5px solid #3b82f6;
          border-left: 5px solid #3b82f6;
          border-top-left-radius: 22px;
        }

        .topRight {
          top: 0;
          right: 0;
          border-top: 5px solid #3b82f6;
          border-right: 5px solid #3b82f6;
          border-top-right-radius: 22px;
        }

        .bottomLeft {
          bottom: 0;
          left: 0;
          border-bottom: 5px solid #3b82f6;
          border-left: 5px solid #3b82f6;
          border-bottom-left-radius: 22px;
        }

        .bottomRight {
          right: 0;
          bottom: 0;
          border-right: 5px solid #3b82f6;
          border-bottom: 5px solid #3b82f6;
          border-bottom-right-radius: 22px;
        }

        .centerTarget {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 26px;
          height: 26px;
          margin-left: -13px;
          margin-top: -13px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid
            rgba(96, 165, 250, 0.45);
          border-radius: 13px;
        }

        .centerDot {
          width: 6px;
          height: 6px;
          background: #60a5fa;
          border-radius: 999px;
        }

        .instructionCard {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 100%;
          max-width: 340px;
          background: rgba(16, 20, 28, 0.9);
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: 13px 16px;
          margin-top: 30px;
          gap: 11px;
        }

        .instructionTextWrapper {
          min-width: 0;
          flex-shrink: 1;
        }

        .instructions {
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          margin: 0;
        }

        .helper {
          color: #9ca6b5;
          font-size: 12px;
          margin: 3px 0 0;
        }

        .webInstructionIcon {
          color: #60a5fa;
          font-size: 21px;
          font-weight: 900;
        }

        .scannerError {
          max-width: 340px;
          margin: 14px 0 0;
          color: #fca5a5;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
        }

        @media (max-width: 380px) {
          .scanFrame {
            width: 240px;
            height: 240px;
          }
        }
      `}</style>
    </>
  );
}