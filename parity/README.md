# Parity suite

Same Playwright specs against two apps; each app proxies `/api` and `/socket` to its own mock API.

| project  | app                                             | URL                   | mock API |
|----------|-------------------------------------------------|-----------------------|----------|
| baseline | Angular 4 app from a worktree of the pre-upgrade commit | http://localhost:4000 | :4101 |
| upgraded | this checkout                                   | http://localhost:4200 | :4201    |

```sh
# mock APIs (from the repo root, any Node >= 14)
(cd mock-api && npm install)
PORT=4101 node mock-api/server.js &
PORT=4201 node mock-api/server.js &

# baseline app (Node 6, Angular CLI 1.x)
git worktree add ../pinterest-baseline 6639d2f
(cd ../pinterest-baseline && npm install && \
  ./node_modules/.bin/ng serve --port 4000 --proxy-config ../pinterest/parity/proxy.baseline.json) &

# upgraded app (Node >= 22.22)
npx ng serve --port 4200 --proxy-config parity/proxy.upgraded.json

# suite + side-by-side report (parity/report/README.md)
cd parity && npm install && npx playwright install chromium
npx playwright test && node compose-report.js
```

Google sign-in cannot run headless, so specs sign in by seeding AngularFire's persisted auth user and
stubbing the Firebase account lookup; the real OAuth popup is only checked to open.
