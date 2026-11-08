import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // A hang guard, not a speed budget: the unit tests are fast (the suite takes about 4 s), but
    // this shared machine can run 30x slower while other apps saturate it (2026-11-08: 114 s, with
    // only timeouts failing). The default 5 s turned that load into red runs (D62).
    testTimeout: 30_000,
    server: { deps: { inline: [/next-intl/] } },
  },
});
