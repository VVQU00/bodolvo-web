// app/apps/qr-barcode/components/CodeTypeSelector.tsx

"use client";

export type CodeType = "qr" | "barcode";

type CodeTypeSelectorProps = {
  selectedType: CodeType;
  onChange: (type: CodeType) => void;
};

export default function CodeTypeSelector({
  selectedType,
  onChange,
}: CodeTypeSelectorProps) {
  return (
    <div className="container">
      <SelectorButton
        label="QR Code"
        type="qr"
        active={selectedType === "qr"}
        onPress={() => onChange("qr")}
      />

      <SelectorButton
        label="Barcode"
        type="barcode"
        active={selectedType === "barcode"}
        onPress={() => onChange("barcode")}
      />

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          background-color: #0b1220;
          border: 1px solid #1e293b;
          border-radius: 18px;
          padding: 5px;
          margin-bottom: 22px;
        }
      `}</style>
    </div>
  );
}

type SelectorButtonProps = {
  label: string;
  type: CodeType;
  active: boolean;
  onPress: () => void;
};

function SelectorButton({
  label,
  type,
  active,
  onPress,
}: SelectorButtonProps) {
  return (
    <button
      type="button"
      className={`buttonWrapper ${
        active ? "active" : ""
      }`}
      onClick={onPress}
    >
      <span
        className={`button ${
          active ? "activeButton" : ""
        }`}
      >
        <span
          className={
            active ? "webActiveIcon" : "webIcon"
          }
        >
          {type === "qr" ? "⌗" : "▥"}
        </span>

        <span
          className={
            active
              ? "activeButtonText"
              : "buttonText"
          }
        >
          {label}
        </span>
      </span>

      <style jsx>{`
        .buttonWrapper {
          flex: 1;
          display: block;
          margin: 0;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          border-radius: 13px;
          transition:
            opacity 120ms ease,
            transform 120ms ease;
        }

        .buttonWrapper:active {
          opacity: 0.8;
          transform: scale(0.98);
        }

        .button {
          min-height: 48px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 13px;
        }

        .activeButton {
          background: linear-gradient(
            135deg,
            #171717 0%,
            #171717 50%,
            #333333 100%
          );
        }

        .buttonText {
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
        }

        .activeButtonText {
          color: #171717;
          font-size: 14px;
          font-weight: 800;
        }

        .webIcon {
          color: #64748b;
          font-size: 19px;
          font-weight: 900;
          line-height: 1;
        }

        .webActiveIcon {
          color: #171717;
          font-size: 19px;
          font-weight: 900;
          line-height: 1;
        }
      `}</style>
    </button>
  );
}