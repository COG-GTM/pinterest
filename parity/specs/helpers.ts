import { Page, TestInfo, expect, APIRequestContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const FIREBASE_API_KEY = 'AIzaSyA4tjVj427twh-n3lOAAniS-x9knzdw7vM';

export const SEED_USER = {
  id: 'u1',
  uid: 'uid-ada',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  avatar: '/api/img/avatar/u1.svg',
};

/** Restores the mock API to its seed data so every test starts from the same state. */
export async function resetData(request: APIRequestContext, baseURL: string) {
  const res = await request.post(`${baseURL}/api/__reset`);
  expect(res.ok()).toBeTruthy();
}

/**
 * Google sign-in goes through a Firebase popup that cannot run headless, so instead we
 * pre-seed the persisted Firebase user and answer Firebase's account lookup ourselves.
 * Everything after Firebase (token exchange with the API, user loading, UI) is real app code.
 */
export async function signIn(page: Page) {
  const firebaseUser = {
    uid: SEED_USER.uid,
    displayName: SEED_USER.name,
    photoURL: SEED_USER.avatar,
    email: SEED_USER.email,
    emailVerified: true,
    isAnonymous: false,
    providerData: [{ uid: 'google-ada', displayName: SEED_USER.name, photoURL: SEED_USER.avatar, email: SEED_USER.email, providerId: 'google.com' }],
    apiKey: FIREBASE_API_KEY,
    appName: '[DEFAULT]',
    authDomain: 'pinterest-da3ba.firebaseapp.com',
    stsTokenManager: { apiKey: FIREBASE_API_KEY, refreshToken: 'parity-refresh', accessToken: 'parity.access.token', expirationTime: Date.now() + 24 * 3600e3 },
    createdAt: '1490000000000',
    lastLoginAt: '1490000000000',
    redirectEventId: null,
  };
  await page.addInitScript(([key, value]) => {
    if (!sessionStorage.getItem('parity-signed-out')) { localStorage.setItem(key, value); }
  }, [`firebase:authUser:${FIREBASE_API_KEY}:[DEFAULT]`, JSON.stringify(firebaseUser)]);
  const accountInfo = {
    kind: 'identitytoolkit#GetAccountInfoResponse',
    users: [{
      localId: SEED_USER.uid, email: SEED_USER.email, emailVerified: true, displayName: SEED_USER.name, photoUrl: SEED_USER.avatar,
      providerUserInfo: [{ providerId: 'google.com', displayName: SEED_USER.name, photoUrl: SEED_USER.avatar, federatedId: 'google-ada', email: SEED_USER.email, rawId: 'google-ada' }],
      validSince: '1490000000', lastLoginAt: '1490000000000', createdAt: '1490000000000',
    }],
  };
  await page.route(/googleapis\.com\/identitytoolkit\/v3\/relyingparty\/getAccountInfo|identitytoolkit\.googleapis\.com\/v1\/accounts:lookup/, route =>
    route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(accountInfo) }));
}

/** Blocks every other Firebase/Google network call so tests never depend on the internet. */
export async function blockExternal(page: Page) {
  await page.context().route(/(firebaseapp\.com|firebaseio\.com|securetoken\.googleapis\.com|apis\.google\.com)/, route => route.abort());
}

export const pinCards = (page: Page) => page.locator('pin-pin-item .callout');
export const pinTitles = (page: Page) => page.locator('pin-pin-item h6');

export async function waitForGrid(page: Page, count: number) {
  await expect(pinCards(page)).toHaveCount(count);
  // let masonry/images settle before clicking or taking screenshots
  await page.waitForLoadState('networkidle');
  let last = '';
  await expect.poll(async () => {
    const boxes = JSON.stringify(await pinCards(page).evaluateAll(els => els.map(e => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.height]; })));
    const stable = boxes === last;
    last = boxes;
    return stable;
  }, { intervals: [400], timeout: 15_000 }).toBe(true);
}

/** Opens a pin's detail modal by clicking its card in the grid. */
export async function openPin(page: Page, name: string) {
  await pinCards(page).filter({ has: page.locator('h6', { hasText: new RegExp(`^\\s*${name}\\s*$`) }) }).click();
}

/** Full-page screenshot saved per project for the side-by-side report. */
export async function snap(page: Page, testInfo: TestInfo, name: string) {
  const dir = path.join(__dirname, '..', 'report', 'shots', testInfo.project.name);
  fs.mkdirSync(dir, { recursive: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(dir, `${name}.png`), fullPage: true, animations: 'disabled' });
}

export const modal = (page: Page) => page.locator('.reveal:visible');
