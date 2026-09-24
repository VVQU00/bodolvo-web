import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "File Converter | Bodolvo" };
export default function Page() { return <ToolFrame title="File Converter" description="Batch-convert PNG, JPG, and WebP images. Resize and download without an upload." note="Image conversion runs in your browser. Other file formats will be added in future passes."><Tool /></ToolFrame>; }
