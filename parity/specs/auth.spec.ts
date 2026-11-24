import { test, expect } from '@playwright/test';
import { resetData, blockExternal, signIn, waitForGrid, snap, pinTitles, SEED_USER } from './helpers';

test.beforeEach(async ({ page, request, baseURL }) => {
  await resetData(request, baseURL!);
  await blockExternal(page);
});

// The real Google OAuth flow needs a live Google account, so we only assert the sign-in popup opens.
test('signed out: "add a pin" starts sign-in in a popup window', async ({ page }) => {
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await expect(page.locator('a[href="/pins/new"]')).toHaveCount(0);
  const popupPromise = page.waitForEvent('popup');
  await page.locator('pin-header a.new-Pin-btn').click();
  const popup = await popupPromise;
  expect(popup).toBeTruthy();
  await expect(page).toHaveURL(/\/pins$/);
});

test('signed in: header shows avatar and the new-pin link; logout returns to signed-out header', async ({ page }, testInfo) => {
  await signIn(page);
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await expect(page.locator('a[href="/pins/new"]')).toBeVisible();
  await expect(page.locator('pin-header img.avatar')).toHaveAttribute('src', new RegExp(`${SEED_USER.avatar.replace(/\./g, '\\.')}$`));
  await expect(page.getByText('Login', { exact: true })).toBeHidden();
  await snap(page, testInfo, '06-signed-in');
  await page.evaluate(() => sessionStorage.setItem('parity-signed-out', '1'));
  await page.locator('pin-header img.avatar').hover();
  await page.getByText('Logout', { exact: true }).click();
  await expect(page.getByText('Login', { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/pins/new"]')).toHaveCount(0);
  await page.reload();
  await expect(pinTitles(page).first()).toBeVisible();
  await expect(page.getByText('Login', { exact: true })).toBeVisible();
  await expect(page.locator('a[href="/pins/new"]')).toHaveCount(0);
});
