import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "PDF Toolkit | Bodolvo" };
export default function Page() { return <ToolFrame title="PDF Toolkit" description="Merge, extract, remove, rotate, split PDF pages and make PDFs from images in your browser." note="Local processing. Password-protected PDFs may not open; compression and electronic signing are not included."><Tool /></ToolFrame>; }
