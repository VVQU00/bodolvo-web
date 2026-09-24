import SiteShell from "../_components/SiteShell";
import Directory from "../_components/Directory";
import { appItems, toolItems } from "@/lib/directory";
export const metadata = { title: "Tools | Bodolvo", description: "Find Bodolvo apps and browser-based tools." };
export default function ToolsIndex() { return <SiteShell><section className="site-intro compact"><h1>Tools</h1><p>Choose an app or a browser-based tool. Preview limitations are noted where applicable.</p></section><Directory items={[...appItems, ...toolItems]} searchable /></SiteShell>; }
