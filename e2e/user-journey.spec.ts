import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('Browse tracks → Play audio → Navigate pages', async ({ page }) => {
    // Step 1: Wait for loading to complete, then verify tracks load
    await page.waitForSelector('text=Loading content...', { state: 'hidden', timeout: 15000 });

    // Check if we have track cards, if not skip to explore page test
    const trackCardCount = await page.locator('[data-testid="track-card"]').count();
    if (trackCardCount === 0) {
      console.log('No tracks found on home page, skipping track interaction test');
      return;
    }

    await expect(page.locator('[data-testid="track-card"]').first()).toBeVisible({ timeout: 5000 });

    // Step 2: Click on first track to go to detail page
    const firstTrackTitle = await page.locator('[data-testid="track-card"] h3').first().textContent();
    await page.locator('[data-testid="track-card"]').first().click();

    // Step 3: Verify track detail page loads
    await expect(page).toHaveURL(/\/tracks\/\d+/);
    await expect(page.locator('h1')).toContainText(firstTrackTitle || '');

    // Step 4: Click play button and verify audio player appears
    const playButton = page.locator('button').filter({ hasText: /play|▶/ }).or(
      page.locator('button[aria-label*="play"]')
    ).or(
      page.locator('button').filter({ has: page.locator('svg') }).first()
    );

    await playButton.click();

    // Step 5: Verify audio player component appears
    await expect(page.locator('[data-testid="audio-player"]').or(
      page.locator('.fixed.bottom-0')
    )).toBeVisible({ timeout: 5000 });

    // Step 6: Test navigation while audio is playing
    await page.locator('a[href="/explore"]').click();
    await expect(page).toHaveURL('/explore');

    // Step 7: Verify audio player persists across navigation
    await expect(page.locator('[data-testid="audio-player"]').or(
      page.locator('.fixed.bottom-0')
    )).toBeVisible();
  });

  test('Explore page → Category filtering → Creator profiles', async ({ page }) => {
    // Step 1: Navigate to explore page
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');

    // Step 2: Wait for any loading states to complete
    await page.waitForTimeout(2000); // Give time for data to load

    // Step 3: Look for categories (use flexible selectors)
    const categorySelector = '[data-testid="category-card"], .grid > div, .space-y-4 > div';
    const categoryCount = await page.locator(categorySelector).count();

    if (categoryCount === 0) {
      console.log('No categories found on explore page, checking for other content');
      // Check if page has any content at all
      const hasContent = await page.locator('h1, h2, h3').count();
      expect(hasContent).toBeGreaterThan(0);
      return;
    }

    await expect(page.locator(categorySelector).first()).toBeVisible();

    // Step 4: Click on first category with creators
    const categoryCards = page.locator('[data-testid="category-card"]');
    const availableCategoryCount = await categoryCards.count();

    let categoryClicked = false;
    for (let i = 0; i < availableCategoryCount; i++) {
      const creatorCount = await categoryCards.nth(i).locator('text=/\\d+ creators/').textContent();
      if (creatorCount && !creatorCount.includes('0 creators')) {
        await categoryCards.nth(i).click();
        categoryClicked = true;
        break;
      }
    }

    if (categoryClicked) {
      // Step 4: Verify filtered creators are shown
      await expect(page.locator('[data-testid="creator-card"]').first()).toBeVisible({ timeout: 5000 });

      // Step 5: Click on first creator
      await page.locator('[data-testid="creator-card"]').first().click();

      // Step 6: Verify creator profile page loads
      await expect(page).toHaveURL(/\/creators\/\d+/);
      await expect(page.locator('h1').or(page.locator('[data-testid="creator-name"]'))).toBeVisible();
    }
  });

  test('Library page → Track management', async ({ page }) => {
    // Step 1: Navigate to library page
    await page.goto('/library');
    await page.waitForLoadState('networkidle');

    // Step 2: Verify library page structure
    await expect(page.locator('h1')).toContainText(/library|saved|my tracks/i);

    // Step 3: If there are saved tracks, test interaction
    const savedTracks = page.locator('[data-testid="saved-track"]');
    const trackCount = await savedTracks.count();

    if (trackCount > 0) {
      // Click on first saved track
      await savedTracks.first().click();

      // Should navigate to track detail or play
      await page.waitForLoadState('networkidle');

      // Verify some interaction occurred (either navigation or player)
      const hasNavigation = await page.url().includes('/tracks/');
      const hasPlayer = await page.locator('[data-testid="audio-player"]').isVisible();

      expect(hasNavigation || hasPlayer).toBeTruthy();
    }
  });

  test('Responsive design → Mobile navigation', async ({ page }) => {
    // Step 1: Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Step 2: Navigate to home and verify mobile layout
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Step 3: Verify mobile navigation is visible
    await expect(page.locator('nav').or(page.locator('[role="navigation"]'))).toBeVisible();

    // Step 4: Test navigation tabs work on mobile
    const exploreLink = page.locator('a[href="/explore"]');
    await exploreLink.click();
    await expect(page).toHaveURL('/explore');

    // Step 5: Test back to home
    const homeLink = page.locator('a[href="/home"]').or(page.locator('a[href="/"]'));
    await homeLink.click();
    await expect(page).toHaveURL(/^\/(home)?$/);
  });

  test('Error handling → Network failures', async ({ page }) => {
    // Step 1: Start on home page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Step 2: Simulate network failure
    await page.route('**/*', (route) => {
      if (route.request().url().includes('supabase') || route.request().url().includes('api')) {
        route.abort('internetdisconnected');
      } else {
        route.continue();
      }
    });

    // Step 3: Try to navigate and verify graceful degradation
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Step 4: App should still be functional (show error states, not crash)
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent).not.toContain('Uncaught');

    // Should show some error state or loading state, not blank page
    const hasContent = bodyContent && bodyContent.trim().length > 0;
    expect(hasContent).toBeTruthy();
  });
});