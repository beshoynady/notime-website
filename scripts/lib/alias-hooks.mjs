// Node module hooks: resolve the "@/..." alias (tsconfig paths) to src/, for scripts that import
// the content files directly (node strips the TypeScript types itself).
import { pathToFileURL } from "node:url";
import path from "node:path";
import { existsSync } from "node:fs";

const SRC = path.resolve(import.meta.dirname, "../../src");
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    const base = path.join(SRC, specifier.slice(2));
    for (const ext of ["", ".ts", ".tsx", "/index.ts"]) {
      if (existsSync(base + ext) && !base.endsWith("/") && (ext || /\.\w+$/.test(base))) return next(pathToFileURL(base + ext).href, context);
    }
  }
  if (specifier.startsWith(".") && !/\.\w+$/.test(specifier) && context.parentURL?.includes("/src/")) {
    const base = new URL(specifier, context.parentURL);
    for (const ext of [".ts", ".tsx", "/index.ts"]) if (existsSync(new URL(base.href + ext))) return next(base.href + ext, context);
  }
  return next(specifier, context);
}
