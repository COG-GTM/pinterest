import { test, expect } from '@playwright/test';
import { resetData, blockExternal, signIn, waitForGrid, snap, openPin } from './helpers';

test.beforeEach(async ({ page, request, baseURL }) => {
  await resetData(request, baseURL!);
  await blockExternal(page);
  await signIn(page);
});

test('comments: signed-in user adds a comment with Enter and deletes it', async ({ page }, testInfo) => {
  const message = `Parity comment ${Date.now()}`;
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await openPin(page, 'Seed pin 30');
  const detail = page.locator('.reveal.pinModal-p30');
  await expect(detail).toBeVisible();
  const box = detail.getByPlaceholder('Add Comment');
  await expect(box).toBeVisible();
  await expect(detail.locator('button[type=submit]')).toHaveCount(0); // hidden while invalid
  await box.fill(message);
  await expect(detail.locator('button[type=submit]')).toBeVisible();
  await box.press('Enter');
  await expect(detail.locator('.comment-text')).toHaveText([message]);
  await expect(detail.locator('pin-pin-comment')).toContainText('Ada Lovelace');
  await expect(box).toHaveValue(/^\s*$/);
  await snap(page, testInfo, '10-comment-added');
  await detail.locator('pin-pin-comment').hover(); // delete button only shows on hover
  await detail.locator('.delete-comment').click();
  await expect(detail.locator('.comment-text')).toHaveCount(0);
});

test('comments: other users\' comments have no delete button', async ({ page }) => {
  await page.goto('/pins/p1');
  const detail = page.locator('.reveal.pinModal-p1');
  await expect(detail.locator('.comment-text')).toHaveText(['Lovely pin!', 'Bookmarked for later.'], { timeout: 15_000 });
  await expect(detail.locator('.delete-comment')).toHaveCount(0);
});
