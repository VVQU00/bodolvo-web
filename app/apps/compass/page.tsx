import { ToolFrame } from "../_components/ToolFrame";
import { Tool } from "./Tool";
export const metadata = { title: "Enhanced Compass | Bodolvo" };
export default function Page() { return <ToolFrame title="Enhanced Compass" description="A direction dial and on-demand location coordinates, straight from your device." note="Compass and location features depend on browser hardware access and permission. Relative orientation is not a substitute for a calibrated heading."><Tool /></ToolFrame>; }
