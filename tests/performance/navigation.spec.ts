import { test, expect } from '@playwright/test';
/** Soft smoke-level timing check, not a load or SLA benchmark. Run intentionally. */
test('PERF-001 @performance catalog loads under configurable generous threshold', async ({ page }) => {
  const t0 = Date.now();
  await page.goto('/');
  await expect(page.locator('.card-title').first()).toBeVisible();
  const elapsed = Date.now() - t0;
  expect(elapsed).toBeLessThan(Number(process.env.PERF_MAX_MS ?? 30_000));
});
