import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Check if page title exists or main content is visible
  await expect(page).toHaveTitle(/Cricinfo|Sports|ScoreNews/i);
});
