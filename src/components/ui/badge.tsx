import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "soon" | "illustrative" | "preview";

/**
 * Small square-cornered label (2px radius, never a pill).
 * - soon: champagne fill with a pulsing dot ("Coming soon" on products);
 * - illustrative: required on any AI image that stands in for a real project (CLAUDE.md);
 * - preview: concept screens of products still in development.
 * Outline tones take the current text colour, so they read on light and dark grounds.
 */
export function Badge({ tone, size = "md", children, className }: { tone: Tone; size?: "sm" | "md"; children: ReactNode; className?: string }) {
  return <span className={cn("badge", `badge-${tone}`, size === "md" && "badge-md", className)}>{children}</span>;
}
