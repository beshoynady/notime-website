import type { z } from "zod";

type Node = { _zod: { def: { type: string; innerType?: Node; in?: Node; shape?: Record<string, Node> } }; maxLength?: number | null };

/**
 * A field's character limit, read from the form's own schema (owner rule 7: the tooLong message
 * names it), so the number on screen can never drift from the one the server enforces. Unwraps
 * `.optional()`, `.default()` and pipes down to the string. Undefined when the field has none.
 */
export function fieldMax(schema: z.ZodType, name: string): number | undefined {
  let t: Node | undefined = (schema as unknown as Node)._zod.def.shape?.[name];
  while (t) {
    const d: Node["_zod"]["def"] = t._zod.def;
    if (d.innerType) t = d.innerType;
    else if (d.type === "pipe") t = d.in;
    else break;
  }
  return t?.maxLength ?? undefined;
}
