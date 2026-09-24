import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "Magnifier | Bodolvo" };
export default function Page() {
  return <ToolFrame title="Magnifier" description="Zoom in on small print and details with a live camera or a photo." note="Camera access requires permission and HTTPS or localhost. Photo zoom and captured frames run locally in your browser."><Tool /></ToolFrame>;
}
