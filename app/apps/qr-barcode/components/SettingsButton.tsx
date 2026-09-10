// app/apps/qr-barcode/components/SettingsButton.tsx

"use client";

import { useRouter } from "next/navigation";

export default function SettingsButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      className="button"
      onClick={() =>
        router.push("/apps/qr-barcode/settings")
      }
    >
      <span className="webIcon">⚙</span>

      <span className="text">Settings</span>

      <style jsx>{`
        .button {
          width: 100%;
          min-height: 50px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #0b1220;
          border: 1px solid #1e293b;
          border-radius: 16px;
          margin-bottom: 22px;
          cursor: pointer;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .button:active {
          opacity: 0.72;
          transform: scale(0.98);
        }

        .text {
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
        }

        .webIcon {
          color: #ffffff;
          font-size: 20px;
          font-weight: 800;
          line-height: 1;
        }
      `}</style>
    </button>
  );
}