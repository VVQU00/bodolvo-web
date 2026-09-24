// app/apps/qr-barcode/components/AppHeader.tsx

"use client";

export default function AppHeader() {
  return (
    <header className="header">
      <div className="logoRow">
        <div className="logoIcon">
          <span className="webIcon">⌗</span>
        </div>

        <div>
          <div className="brand">BODOLVO</div>
          <div className="productName">Scanner</div>
        </div>
      </div>

      <p className="subtitle">
        Scan, create, save, and share QR codes and barcodes.
      </p>

      <div className="badge">
        <span className="dot" />

        <span className="badgeText">
          Private • Offline • Fast
        </span>
      </div>

      <style jsx>{`
        .header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 26px;
        }

        .logoRow {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
        }

        .logoIcon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #2563eb;
          border-radius: 16px;
          box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
        }

        .webIcon {
          color: #ffffff;
          font-size: 28px;
          font-weight: 900;
          line-height: 30px;
        }

        .brand {
          color: #ffffff;
          font-size: 27px;
          font-weight: 900;
          letter-spacing: 2.2px;
          line-height: 30px;
        }

        .productName {
          color: #7c8aa0;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-top: 1px;
        }

        .subtitle {
          color: #8b95a7;
          font-size: 14px;
          line-height: 21px;
          margin: 14px 0 0;
          text-align: center;
          max-width: 320px;
        }

        .badge {
          display: flex;
          flex-direction: row;
          align-items: center;
          background-color: #10141c;
          border: 1px solid #28303d;
          padding: 7px 12px;
          border-radius: 999px;
          margin-top: 14px;
        }

        .dot {
          width: 7px;
          height: 7px;
          background-color: #22c55e;
          border-radius: 999px;
          margin-right: 7px;
        }

        .badgeText {
          color: #c4cbd6;
          font-size: 12px;
          font-weight: 700;
        }
      `}</style>
    </header>
  );
}