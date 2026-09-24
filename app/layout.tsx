import type { Metadata } from "next";
import "./globals.css";

// Avoid blocking the first paint on optional web-font resources.
// System fonts also remove a font preload/download from the initial request chain.
export const metadata: Metadata = {
  title: "Bodolvo",
  description: "Bodolvo apps and tools",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
