import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "Media Toolkit | Bodolvo" };
export default function Page() { return <ToolFrame title="Media Toolkit" description="Trim audio and save still frames from video, right in your browser." note="Audio exports as WAV. Video editing and conversion are planned for a later pass."><Tool /></ToolFrame>; }
