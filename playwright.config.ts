import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
/** Point at an already running server (e.g. `PW_BASE_URL=http://localhost:3200`) to skip the production build. */
const external = process.env.PW_BASE_URL;

// Uses the locally installed Chrome (channel: "chrome"); no Playwright browser downloads.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // One worker: the suite has timing-sensitive checks (CLS, intro failsafe, menu timing),
  // and parallel browsers starved this dev machine into timeouts. Measured: all green in
  // ~60 s with 1 worker vs 6 timeouts with the default. Override with --workers.
  workers: 1,
  reporter: "list",
  use: {
    baseURL: external ?? `http://localhost:${PORT}`,
    channel: "chrome",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 }, channel: "chrome" },
    },
  ],
  webServer: external
    ? undefined
    : {
        command: `npm run build && npm run start -- -p ${PORT}`,
        url: `http://localhost:${PORT}/en`,
        reuseExistingServer: true,
        timeout: 300_000,
      },
});
