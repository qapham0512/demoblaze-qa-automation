import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { newUser } from '../../src/fixtures/data';

test.describe('Login', () => {
  test('LOGIN-001 @smoke @regression valid credentials show authenticated identity', async ({ page }) => {
    const home = new HomePage(page); const user = newUser();
    await home.open();
    if (process.env.DEMOBLAZE_USERNAME && process.env.DEMOBLAZE_PASSWORD) {
      await home.login(process.env.DEMOBLAZE_USERNAME, process.env.DEMOBLAZE_PASSWORD);
    } else { await home.signUp(user.username, user.password); await home.login(user.username, user.password); }
    await expect(page.locator('#logout2')).toBeVisible();
  });
  test('LOGIN-002 @regression unknown username rejected', async ({ page }) => {
    const home = new HomePage(page); await home.open();
    await home.loginExpectAlert(`missing_${Date.now()}`, 'WrongPass123!', /User does not exist/i);
  });
  test('LOGIN-003 @regression blank username and password rejected', async ({ page }) => {
    const home = new HomePage(page); await home.open();
    await home.loginExpectAlert('', '', /Please fill out Username and Password/i);
  });
  test('LOGIN-004 @regression log in modal can be closed without logging in', async ({ page }) => {
    const home = new HomePage(page); await home.open();
    await page.locator('#login2').click();
    await page.locator('#logInModal').getByRole('button', { name: 'Close' }).last().click();
    await expect(page.locator('#logInModal')).toBeHidden();
    await expect(page.locator('#nameofuser')).toBeHidden();
  });
});
