import { defineConfig } from '@playwright/test';

// Same specs run against both apps:
//   baseline  -> original Angular 4 app (git worktree of the pre-upgrade commit) on :4000
//   upgraded  -> this checkout on :4200
// Each app proxies /api to its own mock API instance (see proxy.*.json), so data never collides.
export default defineConfig({
  testDir: './specs',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'report/results.json' }]],
  use: {
    viewport: { width: 1280, height: 900 },
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'baseline', use: { baseURL: process.env.BASELINE_URL || 'http://localhost:4000' } },
    { name: 'upgraded', use: { baseURL: process.env.UPGRADED_URL || 'http://localhost:4200' } },
  ],
});
