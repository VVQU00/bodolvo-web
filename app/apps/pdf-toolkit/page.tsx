import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "PDF Toolkit | Bodolvo" };
export default function Page() { return <ToolFrame title="PDF Toolkit" description="Merge PDFs and extract selected pages without uploading documents." note="Merge and extract are available. Compression and signing are coming later."><Tool /></ToolFrame>; }
