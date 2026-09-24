import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "Media Toolkit | Bodolvo" };
export default function Page() { return <ToolFrame title="Media Toolkit" description="Edit images, trim audio, and capture or trim video in your browser." note="Media stays on your device. Browser support varies by file format; video trim exports WebM where recording is supported."><Tool /></ToolFrame>; }
