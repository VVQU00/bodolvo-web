export const apps = [
  { name: "Calculator", description: "Math, finance, science, conversions, and more.", href: "/apps/calculator" },
  { name: "QR & Barcode", description: "Create and scan QR codes and barcodes.", href: "/apps/qr-barcode" },
  { name: "Link Hub", description: "Create a personal links page. Some publishing features may need setup.", href: "/apps/link-hub" },
] as const;

// Only list directly accessible routes here. Desktop-only projects are not linked as web apps.
export const siteLinks = [
  { name: "Apps", description: "Open Bodolvo web applications.", href: "/apps" },
  { name: "Tools", description: "Everyday browser utilities and previews.", href: "/tools" },
  { name: "Products", description: "Learn about other Bodolvo projects.", href: "/products" },
  { name: "Support", description: "Help and contact information.", href: "/support" },
] as const;
