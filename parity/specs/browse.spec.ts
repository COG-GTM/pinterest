import { test, expect } from '@playwright/test';
import { resetData, blockExternal, pinCards, pinTitles, waitForGrid, snap, openPin } from './helpers';

test.beforeEach(async ({ page, request, baseURL }) => {
  await resetData(request, baseURL!);
  await blockExternal(page);
});

test('home: redirects to /pins and shows header, first page of pins and footer', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/pins$/);
  await expect(page.locator('pin-header .menu-text')).toHaveText('PinWork');
  await expect(page.getByPlaceholder('Search')).toBeVisible();
  await expect(page.getByText('Login', { exact: true })).toBeVisible();
  await waitForGrid(page, 20);
  await expect(pinTitles(page).first()).toHaveText('Seed pin 30');
  await expect(pinTitles(page).last()).toHaveText('Seed pin 11');
  await expect(pinCards(page).first()).toContainText('Description for seed pin 30 about angular');
  await expect(pinCards(page).first()).toContainText('ADA LOVELACE');
  await expect(pinCards(page).first().locator('a.pin-url')).toHaveAttribute('href', 'https://example.com/blog/30');
  await expect(page.locator('pin-footer')).toContainText('Built with love');
  await expect(page.locator('pin-footer')).toContainText('Follow Me');
  await snap(page, testInfo, '01-home');
});

test('infinite scroll: scrolling to the bottom loads the next page', async ({ page }, testInfo) => {
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await page.mouse.wheel(0, 20000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await waitForGrid(page, 30);
  await expect(pinTitles(page).last()).toHaveText('Seed pin 1');
  await snap(page, testInfo, '02-infinite-scroll');
});

test('search: filtering by tag shows only matching pins, removing the tag restores the list', async ({ page }, testInfo) => {
  await page.goto('/pins');
  await waitForGrid(page, 20);
  const search = page.getByPlaceholder('Search');
  await search.click();
  await search.pressSequentially('food');
  await page.keyboard.press('Enter');
  await expect(page.locator('pin-header tag-input')).toContainText('food');
  await waitForGrid(page, 5);
  await expect(pinTitles(page)).toHaveText(['Seed pin 27', 'Seed pin 21', 'Seed pin 15', 'Seed pin 9', 'Seed pin 3']);
  await snap(page, testInfo, '03-search-food');
  await page.keyboard.press('Backspace'); // first press selects the tag
  await page.waitForTimeout(300);
  await page.keyboard.press('Backspace'); // second press removes it
  await waitForGrid(page, 20);
  await expect(pinTitles(page).first()).toHaveText('Seed pin 30');
});

test('pin detail: clicking a pin opens the detail modal; closing returns to the grid', async ({ page }, testInfo) => {
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await openPin(page, 'Seed pin 28');
  await expect(page).toHaveURL(/\/pins\/p28$/);
  const reveal = page.locator('.reveal.pinModal-p28');
  await expect(reveal).toBeVisible();
  await expect(reveal.locator('h5')).toHaveText('Seed pin 28');
  await expect(reveal).toContainText('Description for seed pin 28 about code');
  await expect(reveal).toContainText('From Grace Hopper');
  await expect(reveal).toContainText('Comments');
  await expect(reveal.getByPlaceholder('Add Comment')).toHaveCount(0);
  await snap(page, testInfo, '04-pin-detail');
  await reveal.getByLabel('Close reveal').click();
  await expect(page).toHaveURL(/\/pins$/);
  await expect(page.locator('.reveal:visible')).toHaveCount(0);
});

test('pin detail deep link: loads the pin and its comments from the API', async ({ page }, testInfo) => {
  await page.goto('/pins/p1');
  const reveal = page.locator('.reveal.pinModal-p1');
  await expect(reveal).toBeVisible({ timeout: 15_000 });
  await expect(reveal.locator('h5')).toHaveText('Seed pin 1', { timeout: 15_000 });
  await expect(reveal).toContainText('From Grace Hopper');
  await expect(reveal.locator('.comment-text')).toHaveText(['Lovely pin!', 'Bookmarked for later.']);
  await expect(reveal.locator('pin-pin-comment')).toContainText(['Grace Hopper', 'Alan Turing']);
  await expect(reveal.locator('.delete-comment')).toHaveCount(0);
  await snap(page, testInfo, '05-pin-deep-link');
});
