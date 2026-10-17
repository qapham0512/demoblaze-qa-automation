import { expect, Page } from '@playwright/test';
import { customer } from '../fixtures/data';

export class CartPage {
  constructor(private readonly page: Page) {}
  get rows() { return this.page.locator('#tbodyid tr'); }
  async assertProduct(name: string, price: number) {
    const row = this.rows.filter({ hasText: name });
    await expect(row).toHaveCount(1);
    await expect(row.locator('td').nth(2)).toHaveText(String(price));
    await expect(this.page.locator('#totalp')).toHaveText(String(price));
  }
  async deleteProduct(name: string) {
    const row = this.rows.filter({ hasText: name });
    await row.getByRole('link', { name: 'Delete' }).click();
    await expect(row).toHaveCount(0);
  }
  async openCheckout() {
  const placeOrderButton = this.page.getByRole('button', {
    name: 'Place Order',
    exact: true
  });

  const orderModal = this.page.locator('#orderModal');

  await expect(placeOrderButton).toBeVisible();
  await expect(placeOrderButton).toBeEnabled();

  await placeOrderButton.click();

  await expect(orderModal).toHaveClass(/show/);
  await expect(orderModal).toBeVisible();
}
  async purchase(data = customer) {
    await this.page.locator('#name').fill(data.name);
    await this.page.locator('#country').fill(data.country);
    await this.page.locator('#city').fill(data.city);
    await this.page.locator('#card').fill(data.card);
    await this.page.locator('#month').fill(data.month);
    await this.page.locator('#year').fill(data.year);
    await this.page.locator('#orderModal button[onclick="purchaseOrder()"]').click();
    await expect(this.page.locator('.sweet-alert')).toBeVisible();
    await expect(this.page.locator('.sweet-alert h2')).toHaveText(/Thank you for your purchase!/i);
    const detail = await this.page.locator('.sweet-alert .lead').innerText();
    expect(detail).toContain(`Name: ${data.name}`);
    expect(detail).toContain(`Card Number: ${data.card}`);
    expect(detail).toMatch(/Id:\s*\d+/);
    return detail;
  }
}
