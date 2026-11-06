"use client";

import { DirectionProvider as BaseDirectionProvider } from "@base-ui/react/direction-provider";
import type { ReactNode } from "react";

/** Gives Base UI / shadcn components the page's reading direction (OPEN_QUESTIONS #7). */
export function DirectionProvider({ direction, children }: { direction: "ltr" | "rtl"; children: ReactNode }) {
  return <BaseDirectionProvider direction={direction}>{children}</BaseDirectionProvider>;
}
