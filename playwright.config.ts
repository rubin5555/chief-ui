import { defineConfig, devices } from '@playwright/test';

// Dedicated e2e port, deliberately not the dev server's default (3000): running
// `pnpm test` while you have a dev server open should not fight it for a port.
// Override with E2E_PORT if 3277 is taken.
const PORT = Number(process.env.E2E_PORT ?? 3277);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    locale: 'he-IL',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Without this block the suite tested whatever happened to be listening on the
  // configured port — including a dev server started from a different git
  // worktree, which silently produced a run against another branch's code.
  //
  // `reuseExistingServer: false` is the point of the fix and is not an
  // optimisation to undo: reusing means trusting that a process someone else
  // started is serving this checkout, which is exactly the assumption that
  // failed. If the port is busy, Playwright fails loudly here — much better than
  // a green run against the wrong source.
  webServer: {
    command: 'pnpm dev',
    // E2E drops the router devtools from the page. Its floating toggle is pinned
    // to a viewport corner, so it silently intercepts clicks on anything a
    // popover puts there — which is a test failing on a widget that isn't part
    // of the app under test.
    env: { PORT: String(PORT), E2E: '1' },
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
