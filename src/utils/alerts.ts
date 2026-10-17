/** Register handler BEFORE clicking, to avoid races with native alert dialogs. */
import { expect, Page } from '@playwright/test';

export async function expectAlert(
  page: Page,
  action: () => Promise<void>,
  expected: RegExp
): Promise<string> {

  const dialogPromise = page.waitForEvent('dialog');

  const actionPromise = action();

  const dialog = await dialogPromise;

  const message = dialog.message();

  await dialog.accept();

  await actionPromise;

  expect(message).toMatch(expected);

  return message;
}