import { expect, Page } from '@playwright/test';
import { expectAlert } from '../utils/alerts';

export class HomePage {
  constructor(private readonly page: Page) {}
  async open() { await this.page.goto('/'); await expect(this.page.locator('#nava')).toBeVisible(); }
  async signUp(username: string, password: string) {
    await this.page.locator('#signin2').click();
    await expect(this.page.locator('#signInModal')).toBeVisible();
    await this.page.locator('#sign-username').fill(username);
    await this.page.locator('#sign-password').fill(password);
    await expectAlert(this.page, () => this.page.locator('#signInModal button[onclick="register()"]') .click(), /Sign up successful/i);
    await this.page.locator('#signInModal').waitFor({ state: 'hidden', timeout: 3000 }).catch(async () => {
      await this.page.locator('#signInModal .close').first().click();
    });
  }
  async login(username: string, password: string) {
    await this.page.locator('#login2').click();
    await expect(this.page.locator('#logInModal')).toBeVisible();
    await this.page.locator('#loginusername').fill(username);
    await this.page.locator('#loginpassword').fill(password);
    await this.page.locator('#logInModal button[onclick="logIn()"]') .click();
    await expect(this.page.locator('#nameofuser')).toContainText(`Welcome ${username}`);
    await expect(this.page.locator('#logout2')).toBeVisible();
  }
  async loginExpectAlert(username: string, password: string, message: RegExp) {
    await this.page.locator('#login2').click();
    await this.page.locator('#loginusername').fill(username);
    await this.page.locator('#loginpassword').fill(password);
    await expectAlert(this.page, () => this.page.locator('#logInModal button[onclick="logIn()"]') .click(), message);
    await expect(this.page.locator('#nameofuser')).toBeHidden();
  }
  async openProduct(name: string) {
  const productLink = this.page.getByRole('link', {
    name,
    exact: true
  });

  await expect(productLink).toBeVisible();

  await Promise.all([
    this.page.waitForURL(/prod\.html\?idp_=\d+/),
    productLink.click()
  ]);

  const productTitle = this.page.locator('h2.name');

  await expect(productTitle).toBeVisible();
  await expect(productTitle).toHaveText(name);
}
  async addToCart() {
    await expectAlert(this.page, () => this.page.getByRole('link', { name: 'Add to cart' }).click(), /Product added/i);
  }
  async cart() { await this.page.locator('#cartur').click(); await expect(this.page).toHaveURL(/cart\.html/); }
}
