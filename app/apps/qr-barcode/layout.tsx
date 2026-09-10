// app/apps/qr-barcode/layout.tsx

import type { ReactNode } from "react";

import AppLockGate from "./components/AppLockGate";

export default function QRBarcodeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppLockGate>
      <div className="qrBarcodeApp">
        {children}

        <style>{`
          .qrBarcodeApp {
            min-height: 100dvh;
            background: #07090d;
          }
        `}</style>
      </div>
    </AppLockGate>
  );
}