import { toolCatalog } from "./toolCatalog";
import type { DirectoryItem } from "@/app/_components/Directory";

// Only publish routes that exist in this website. Unfinished previews are not presented as complete tools.
export const appItems: DirectoryItem[] = [
  { title: "Calculator", description: "Everyday, financial, scientific, and conversion calculators.", href: "/apps/calculator", category: "Apps" },
  { title: "QR & Barcode", description: "Create and scan QR codes and barcodes.", href: "/apps/qr-barcode", category: "Apps" },
];
export const toolItems: DirectoryItem[] = toolCatalog
  .filter((tool) => tool.slug !== "remote-control")
  .map((tool) => ({
    title: tool.name, description: tool.description, href: `/apps/${tool.slug}`, category: "Tools", note: tool.status,
  }));
export const productItems: DirectoryItem[] = [
  { title: "Bodolvo Live", description: "Live social and creator platform.", category: "Products", note: "In development. Public app not available here yet." },
  { title: "Bodolvo Notes", description: "Writing and organizing ideas.", category: "Products", note: "Separate app; no verified public URL in this project." },
  { title: "Bodolvo Whiteboard", description: "Drawing and collaboration.", category: "Products", note: "Separate desktop app; no download bundled here." },
  { title: "Bodolvo System Center", description: "Computer monitoring and diagnostics.", category: "Products", note: "Separate desktop app; no download bundled here." },
  { title: "Bodolvo Recall", description: "Capture and revisit information.", category: "Products", note: "In development." },
  { title: "Bodolvo Link Hub", description: "A personalized link page.", category: "Products", note: "Preview only; publishing depends on a separately configured service." },
];
