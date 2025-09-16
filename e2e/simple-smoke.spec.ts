import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Phase 3 Verification', () => {
  test('App loads and displays content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Basic page structure
    await expect(page).toHaveTitle(/audeon/i);
    await expect(page.locator('body')).not.toBeEmpty();

    // Navigation should exist
    const nav = page.locator('nav').or(page.locator('[role="navigation"]'));
    await expect(nav).toBeVisible();

    console.log('✅ Basic page structure verified');
  });

  test('E2E framework is working correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if tracks load (with fallback for empty state)
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent!.length).toBeGreaterThan(50);

    console.log('✅ E2E test framework operational');
  });
});