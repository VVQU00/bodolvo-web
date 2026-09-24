import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "Remote Control | Bodolvo" };
export default function Page() { return <ToolFrame title="Remote Control" description="Use your phone to control a video playing in Bodolvo on another screen." note="Web-to-web media playback only. This does not control a TV operating system, console, or computer desktop."><Tool /></ToolFrame>; }
