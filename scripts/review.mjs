#!/usr/bin/env node
/**
 * Rand's review build (v1 plan, Task A1): NEXT_PUBLIC_REVIEW_MODE=1, built into .next-review so
 * the production build in .next stays untouched.
 *
 *   npm run review:build          next build with the flag
 *   npm run review:start [port]   next start on that build (default 3200)
 *
 * The review build shows the banner, the section numbers and the badged example blocks, sends
 * `X-Robots-Tag: noindex, nofollow` and disallows crawling in robots.txt.
 */
import { spawnSync } from "node:child_process";

const [cmd, port = "3200"] = process.argv.slice(2);
if (cmd !== "build" && cmd !== "start") throw new Error("usage: node scripts/review.mjs build|start [port]");
const env = { ...process.env, NEXT_PUBLIC_REVIEW_MODE: "1", NEXT_DIST_DIR: ".next-review" };
const args = cmd === "build" ? ["next", "build"] : ["next", "start", "-p", port];
const r = spawnSync("npx", args, { env, stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
