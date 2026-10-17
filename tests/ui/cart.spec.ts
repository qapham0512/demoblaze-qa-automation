import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { CartPage } from '../../src/pages/CartPage';
import { product } from '../../src/fixtures/data';
import { expectAlert } from '../../src/utils/alerts';

test.describe('Cart and checkout', () => {
  test('CART-001 @smoke @regression add a product and successfully order', async ({ page }) => {
    const home = new HomePage(page); 
    const cart = new CartPage(page);
    await home.open(); await home.openProduct(product.name); await home.addToCart(); 
    await home.cart();
    await cart.assertProduct(product.name, product.price);
    await cart.openCheckout();
    const detail = await cart.purchase();
    expect(detail).toContain(`Amount: ${product.price} USD`);
    await page.locator('.sweet-alert button.confirm').click();
    await expect(page).toHaveURL(/^https:\/\/www\.demoblaze\.com\/(cart|index)\.html$/);
  });
  test('CART-002 @regression delete product removes cart entry', async ({ page }) => {
    const home = new HomePage(page); 
    const cart = new CartPage(page);
    await home.open(); await home.openProduct(product.name); 
    await home.addToCart(); 
    await home.cart();
    await cart.assertProduct(product.name, product.price);
    await cart.deleteProduct(product.name);
    await expect(cart.rows).toHaveCount(0);
    await expect(page.locator('#totalp')).toHaveText(/^(0)?$/);
  });
  test('CART-003 @regression empty checkout required name and card', async ({ page }) => {
    const home = new HomePage(page); 
    const cart = new CartPage(page);
    await home.open(); 
    await home.cart(); 
    await cart.openCheckout();
    await expectAlert(page, () => page.locator('#orderModal button[onclick="purchaseOrder()"]') .click(), /Please fill out Name and Creditcard/i);
    await expect(page.locator('#orderModal')).toBeVisible();
  });
});
