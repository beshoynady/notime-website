"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copies the address and says so (a live region); falls back to the mailto link beside it. */
export function CopyEmail({ email, copy, copied }: { email: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="ct-copy"
      onClick={() =>
        navigator.clipboard?.writeText(email).then(
          () => {
            setDone(true);
            setTimeout(() => setDone(false), 2400);
          },
          () => {},
        )
      }
    >
      {done ? <Check aria-hidden="true" strokeWidth={1.5} className="size-4" /> : <Copy aria-hidden="true" strokeWidth={1.5} className="size-4" />}
      <span aria-live="polite">{done ? copied : copy}</span>
    </button>
  );
}
