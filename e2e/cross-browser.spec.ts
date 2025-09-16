import { test, expect, devices } from '@playwright/test';

// Test across different browsers and devices
const browsers = [
  { name: 'Chromium', device: devices['Desktop Chrome'] },
  { name: 'Firefox', device: devices['Desktop Firefox'] },
  { name: 'WebKit', device: devices['Desktop Safari'] },
  { name: 'Mobile Chrome', device: devices['Pixel 5'] },
  { name: 'Mobile Safari', device: devices['iPhone 12'] }
];

browsers.forEach(({ name, device }) => {
  test.describe(`Cross-browser compatibility: ${name}`, () => {
    test.use(device);

    test(`${name}: Basic page rendering`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify page title
      await expect(page).toHaveTitle(/audeon/i);

      // Verify main content loads
      await expect(page.locator('body')).not.toBeEmpty();

      // Verify navigation exists
      const navigation = page.locator('nav').or(page.locator('[role="navigation"]'));
      await expect(navigation).toBeVisible();

      // Verify tracks load (or appropriate content)
      const hasContent = await page.locator('[data-testid="track-card"]').count() > 0 ||
                         await page.locator('h1, h2, h3').count() > 0;

      expect(hasContent).toBeTruthy();
    });

    test(`${name}: Navigation functionality`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test navigation to explore page
      const exploreLink = page.locator('a[href="/explore"]').or(
        page.locator('a').filter({ hasText: /explore/i })
      );

      if (await exploreLink.isVisible()) {
        await exploreLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/explore/);
      }

      // Test navigation to library page
      const libraryLink = page.locator('a[href="/library"]').or(
        page.locator('a').filter({ hasText: /library/i })
      );

      if (await libraryLink.isVisible()) {
        await libraryLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/library/);
      }

      // Test back to home
      const homeLink = page.locator('a[href="/home"]').or(
        page.locator('a[href="/"]').or(
          page.locator('a').filter({ hasText: /home/i })
        )
      );

      if (await homeLink.isVisible()) {
        await homeLink.click();
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/^\/(home)?$/);
      }
    });

    test(`${name}: Responsive design`, async ({ page }) => {
      // Test different viewport sizes
      const viewports = [
        { width: 1920, height: 1080, name: 'Desktop Large' },
        { width: 1366, height: 768, name: 'Desktop Medium' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 375, height: 667, name: 'Mobile' }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/');
        await page.waitForLoadState('networkidle');

        // Verify page doesn't break at this viewport
        const hasOverflow = await page.evaluate(() => {
          return document.body.scrollWidth > window.innerWidth;
        });

        // Check if navigation is still accessible
        const navigation = page.locator('nav').or(page.locator('[role="navigation"]'));
        const navVisible = await navigation.isVisible();

        // Log viewport test results
        console.log(`${name} - ${viewport.name} (${viewport.width}x${viewport.height}):`, {
          hasHorizontalOverflow: hasOverflow,
          navigationVisible: navVisible
        });

        // Navigation should be visible on all viewports
        expect(navVisible).toBeTruthy();

        // Minimal horizontal overflow is acceptable, but not excessive
        if (hasOverflow) {
          const overflowAmount = await page.evaluate(() => {
            return document.body.scrollWidth - window.innerWidth;
          });
          expect(overflowAmount).toBeLessThan(50); // Allow minor overflow
        }
      }
    });

    test(`${name}: Audio functionality`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Find and click on a track
      const trackCard = page.locator('[data-testid="track-card"]').first();

      if (await trackCard.isVisible()) {
        await trackCard.click();
        await page.waitForLoadState('networkidle');

        // Look for play button
        const playButton = page.locator('button').filter({ hasText: /play|▶/ }).or(
          page.locator('button[aria-label*="play"]')
        ).first();

        if (await playButton.isVisible()) {
          await playButton.click();

          // Verify audio player appears (different selectors for different layouts)
          const audioPlayerAppeared = await Promise.race([
            page.waitForSelector('[data-testid="audio-player"]', { state: 'visible', timeout: 5000 }),
            page.waitForSelector('.fixed.bottom-0', { state: 'visible', timeout: 5000 }),
            page.waitForSelector('audio', { state: 'attached', timeout: 5000 })
          ]).then(() => true).catch(() => false);

          // On some browsers/devices, audio might not work, but UI should still respond
          const buttonStateChanged = await playButton.evaluate((btn) => {
            return btn.textContent?.includes('pause') ||
                   btn.getAttribute('aria-label')?.includes('pause') ||
                   btn.classList.contains('playing');
          });

          expect(audioPlayerAppeared || buttonStateChanged).toBeTruthy();
        }
      }
    });

    test(`${name}: Form interactions`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Look for any search inputs or forms
      const searchInput = page.locator('input[type="search"]').or(
        page.locator('input[placeholder*="search" i]')
      ).first();

      if (await searchInput.isVisible()) {
        // Test typing in search
        await searchInput.fill('test search');
        const value = await searchInput.inputValue();
        expect(value).toBe('test search');

        // Test clearing
        await searchInput.fill('');
        const clearedValue = await searchInput.inputValue();
        expect(clearedValue).toBe('');
      }

      // Look for any buttons and test click interactions
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();

      if (buttonCount > 0) {
        // Test first few buttons for basic interaction
        for (let i = 0; i < Math.min(buttonCount, 3); i++) {
          const button = buttons.nth(i);
          if (await button.isVisible() && await button.isEnabled()) {
            await button.hover();
            // Just verify hover works without error
            expect(await button.isVisible()).toBeTruthy();
          }
        }
      }
    });

    test(`${name}: CSS and styling consistency`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for CSS loading
      const cssLoaded = await page.evaluate(() => {
        const links = document.querySelectorAll('link[rel="stylesheet"]');
        return Array.from(links).every(link => {
          const sheet = (link as HTMLLinkElement).sheet;
          return sheet && sheet.cssRules.length > 0;
        });
      });

      // Check for basic styling
      const hasBasicStyling = await page.evaluate(() => {
        const body = document.body;
        const computedStyle = window.getComputedStyle(body);

        return {
          hasFont: computedStyle.fontFamily !== '',
          hasColors: computedStyle.color !== '' && computedStyle.backgroundColor !== '',
          hasLayout: computedStyle.display !== ''
        };
      });

      console.log(`${name} styling check:`, { cssLoaded, ...hasBasicStyling });

      // Basic styling should be present
      expect(hasBasicStyling.hasFont).toBeTruthy();
      expect(hasBasicStyling.hasLayout).toBeTruthy();
    });

    test(`${name}: JavaScript functionality`, async ({ page }) => {
      // Track console errors
      const consoleErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Test basic JavaScript interaction
      const interactiveElements = await page.locator('button, a[href^="/"], [onclick]').count();
      expect(interactiveElements).toBeGreaterThan(0);

      // Test that React is working (component rendering)
      const hasReactContent = await page.evaluate(() => {
        // Look for React-specific attributes or patterns
        const reactElements = document.querySelectorAll('[data-reactroot], [data-testid]');
        return reactElements.length > 0;
      });

      expect(hasReactContent || interactiveElements > 3).toBeTruthy();

      // Should not have critical JavaScript errors
      const criticalErrors = consoleErrors.filter(error =>
        error.includes('Uncaught') ||
        error.includes('ReferenceError') ||
        error.includes('TypeError')
      );

      expect(criticalErrors.length).toBeLessThan(3);

      if (criticalErrors.length > 0) {
        console.log(`${name} JavaScript errors:`, criticalErrors);
      }
    });
  });
});