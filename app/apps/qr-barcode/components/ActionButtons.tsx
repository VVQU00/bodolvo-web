// app/apps/qr-barcode/components/ActionButtons.tsx

"use client";

type ActionButtonsProps = {
  isSaving: boolean;
  isSharing: boolean;
  copied: boolean;
  onSave: () => void;
  onShare: () => void;
  onCopy: () => void;
};

export default function ActionButtons({
  isSaving,
  isSharing,
  copied,
  onSave,
  onShare,
  onCopy,
}: ActionButtonsProps) {
  return (
    <div className="container">
      <button
        type="button"
        className="primaryWrapper"
        onClick={onSave}
        disabled={isSaving}
      >
        <span className="primaryButton">
          {isSaving ? (
            <span className="spinner" />
          ) : (
            <>
              <span className="webIcon">↓</span>

              <span className="primaryText">
                Save Code
              </span>
            </>
          )}
        </span>
      </button>

      <div className="secondaryRow">
        <button
          type="button"
          className="secondaryButton"
          onClick={onShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <span className="spinner" />
          ) : (
            <>
              <span className="webIcon">↗</span>

              <span className="secondaryText">
                Share
              </span>
            </>
          )}
        </button>

        <button
          type="button"
          className={`secondaryButton ${
            copied ? "copiedButton" : ""
          }`}
          onClick={onCopy}
        >
          <span
            className={`webIcon ${
              copied ? "webCopiedIcon" : ""
            }`}
          >
            {copied ? "✓" : "⧉"}
          </span>

          <span
            className={`secondaryText ${
              copied ? "copiedText" : ""
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>

      <style jsx>{`
        .container {
          margin-top: 22px;
        }

        .primaryWrapper {
          width: 100%;
          display: block;
          border: 0;
          padding: 0;
          border-radius: 17px;
          background: transparent;
          box-shadow: 0 7px 14px rgba(37, 99, 235, 0.35);
          cursor: pointer;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .primaryWrapper:active {
          opacity: 0.78;
          transform: scale(0.98);
        }

        .primaryWrapper:disabled {
          cursor: default;
          opacity: 0.75;
        }

        .primaryButton {
          min-height: 56px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border-radius: 17px;
          background: linear-gradient(
            135deg,
            #171717 0%,
            #171717 50%,
            #333333 100%
          );
        }

        .primaryText {
          color: #171717;
          font-size: 16px;
          font-weight: 800;
        }

        .secondaryRow {
          display: flex;
          flex-direction: row;
          gap: 12px;
          margin-top: 12px;
        }

        .secondaryButton {
          flex: 1;
          min-height: 52px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #0b1220;
          border: 1px solid #1e293b;
          border-radius: 16px;
          cursor: pointer;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .secondaryButton:active {
          opacity: 0.78;
          transform: scale(0.98);
        }

        .secondaryButton:disabled {
          cursor: default;
          opacity: 0.75;
        }

        .secondaryText {
          color: #171717;
          font-size: 15px;
          font-weight: 700;
        }

        .copiedButton {
          border-color: #14532d;
          background-color: #052e16;
        }

        .copiedText {
          color: #22c55e;
        }

        .webIcon {
          color: #171717;
          font-size: 20px;
          font-weight: 900;
          line-height: 1;
        }

        .webCopiedIcon {
          color: #22c55e;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 999px;
          animation: spin 700ms linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}