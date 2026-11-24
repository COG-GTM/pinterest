import { test, expect } from '@playwright/test';
import { resetData, blockExternal, signIn, pinCards, pinTitles, waitForGrid, snap, openPin } from './helpers';

test.beforeEach(async ({ page, request, baseURL }) => {
  await resetData(request, baseURL!);
  await blockExternal(page);
  await signIn(page);
});

test('create pin: validation keeps Save disabled until the form is valid, then the pin is added', async ({ page }, testInfo) => {
  const stamp = Date.now();
  const name = `Parity pin ${stamp}`;
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await page.locator('a[href="/pins/new"]').click();
  await expect(page).toHaveURL(/\/pins\/new$/);
  const reveal = page.locator('.reveal.pinEditModal');
  await expect(reveal).toBeVisible();
  await expect(reveal.locator('h4')).toHaveText('Create Pin');
  const save = reveal.getByRole('button', { name: 'Save' });
  await expect(save).toBeDisabled();
  await expect(reveal.getByRole('button', { name: 'Delete' })).toHaveCount(0);

  await reveal.getByPlaceholder('Title').fill('abc');
  await reveal.getByPlaceholder('Image Url').fill('not-an-image');
  await reveal.getByPlaceholder('Work/Blog Url').fill('https://example.com/parity');
  await reveal.getByPlaceholder('Small Description').fill(`Created by the parity suite at ${stamp}`);
  await expect(save).toBeDisabled();
  await expect(reveal.locator('legend')).toHaveText('Preview Pin');
  await expect(reveal.locator('.callout h6')).toHaveText('abc');
  await snap(page, testInfo, '07-create-invalid');

  await reveal.getByPlaceholder('Title').fill(name);
  await reveal.getByPlaceholder('Image Url').fill('http://localhost/api/img/pin/7.svg');
  await expect(save).toBeDisabled(); // tags are still required
  const tags = reveal.locator('tag-input input');
  await tags.click();
  await tags.pressSequentially('parity');
  await page.keyboard.press('Enter');
  await expect(save).toBeEnabled();
  await expect(reveal.locator('.callout h6')).toHaveText(name);
  await expect(reveal.locator('.callout .pin-desc')).toHaveText(`Created by the parity suite at ${stamp}`);
  await snap(page, testInfo, '08-create-valid');

  await save.click();
  await expect(page).toHaveURL(/\/pins$/);
  await expect(pinCards(page)).toHaveCount(21);
  await expect(pinTitles(page).last()).toHaveText(name);
  await expect(pinCards(page).last()).toContainText('ADA LOVELACE');
});

test('edit and delete pin: owner can edit from the detail menu, then delete', async ({ page }, testInfo) => {
  const newName = `Edited pin ${Date.now()}`;
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await openPin(page, 'Seed pin 30');
  const detail = page.locator('.reveal.pinModal-p30');
  await expect(detail).toBeVisible();
  await expect(detail.locator('.fa-cog')).toBeVisible();
  await detail.locator('.is-dropdown-submenu-parent').hover();
  await detail.getByText('Edit', { exact: true }).click();
  await expect(page).toHaveURL(/\/pins\/p30\/edit$/);
  const edit = page.locator('.reveal.pinEditModal');
  await expect(edit).toBeVisible();
  await expect(edit.locator('h4')).toHaveText('Update Pin');
  await expect(edit.getByPlaceholder('Title')).toHaveValue('Seed pin 30');
  await expect(edit.getByPlaceholder('Work/Blog Url')).toHaveValue('https://example.com/blog/30');
  await expect(edit.locator('tag-input')).toContainText('angular');
  await expect(edit.getByRole('button', { name: 'Delete' })).toBeVisible();
  await snap(page, testInfo, '09-edit');
  await edit.getByPlaceholder('Title').fill(newName);
  await edit.getByRole('button', { name: 'Save' }).click();
  await expect(page).toHaveURL(/\/pins$/);
  // the edited card is re-rendered by masonry, so assert presence rather than position
  await expect(pinTitles(page).filter({ hasText: newName })).toHaveCount(1);
  await expect(pinTitles(page).filter({ hasText: /^\s*Seed pin 30\s*$/ })).toHaveCount(0);

  await waitForGrid(page, 20);
  await openPin(page, newName);
  const detail2 = page.locator('.reveal.pinModal-p30');
  await expect(detail2.locator('h5')).toHaveText(newName);
  await detail2.locator('.is-dropdown-submenu-parent').hover();
  await detail2.getByText('Edit', { exact: true }).click();
  const edit2 = page.locator('.reveal.pinEditModal');
  await expect(edit2.getByPlaceholder('Title')).toHaveValue(newName);
  await edit2.getByRole('button', { name: 'Delete' }).click();
  await expect(page).toHaveURL(/\/pins$/);
  await expect(pinTitles(page).filter({ hasText: newName })).toHaveCount(0);
  await expect(pinTitles(page).filter({ hasText: /^\s*Seed pin 29\s*$/ })).toHaveCount(1);
  await expect(page.getByText(newName)).toHaveCount(0);
});

test('non-owner sees no edit menu on someone else\'s pin', async ({ page }) => {
  await page.goto('/pins');
  await waitForGrid(page, 20);
  await openPin(page, 'Seed pin 29'); // belongs to Alan Turing
  const detail = page.locator('.reveal.pinModal-p29');
  await expect(detail).toBeVisible();
  await expect(detail.locator('h5')).toHaveText('Seed pin 29');
  await expect(detail.locator('.fa-cog')).toHaveCount(0);
});
