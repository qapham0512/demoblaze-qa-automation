import { test, expect } from '@playwright/test';

test('API-001 @api @regression catalog endpoint returns product data', async ({ request }) => {
  const response = await request.get('https://api.demoblaze.com/entries');
  expect(response.ok()).toBeTruthy();
  const body: unknown = await response.json();
  expect(body).toBeTruthy();
  expect(typeof body).toBe('object');
  expect(Array.isArray((body as { Items?: unknown }).Items)).toBeTruthy();
});
