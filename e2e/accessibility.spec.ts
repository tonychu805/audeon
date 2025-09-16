import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance (WCAG)', () => {
  test('Home page accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Track detail page accessibility', async ({ page }) => {
    // Navigate to home first to get a track
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for tracks to load and click first one
    const firstTrack = page.locator('[data-testid="track-card"]').first();
    if (await firstTrack.isVisible()) {
      await firstTrack.click();
      await page.waitForLoadState('networkidle');

      // Run accessibility scan on track detail page
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('Explore page accessibility', async ({ page }) => {
    await page.goto('/explore');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Library page accessibility', async ({ page }) => {
    await page.goto('/library');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Audio player accessibility', async ({ page }) => {
    // Navigate and trigger audio player
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on a track to trigger audio player
    const trackCard = page.locator('[data-testid="track-card"]').first();
    if (await trackCard.isVisible()) {
      await trackCard.click();
      await page.waitForLoadState('networkidle');

      // Try to click play button
      const playButton = page.locator('button').filter({ hasText: /play|▶/ }).or(
        page.locator('button[aria-label*="play"]')
      ).first();

      if (await playButton.isVisible()) {
        await playButton.click();
        await page.waitForTimeout(2000); // Wait for audio player to appear

        // Run accessibility scan with audio player present
        const accessibilityScanResults = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa'])
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      }
    }
  });

  test('Keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test tab navigation
    let focusableElements = 0;

    // Count focusable elements by tabbing through
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => document.activeElement?.tagName);

      if (activeElement && ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(activeElement)) {
        focusableElements++;
      }

      // Break if we've cycled back to body or first element
      if (i > 5 && activeElement === 'BODY') break;
    }

    // Should have at least some focusable elements (navigation + tracks)
    expect(focusableElements).toBeGreaterThan(3);
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');

      // Images should have alt text or be decorative (alt="")
      if (src && !src.includes('data:')) {
        expect(alt).not.toBeNull();
      }
    }

    // Check for proper labels on form elements
    const inputs = page.locator('input, select, textarea');
    const inputCount = await inputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const hasLabel = await input.evaluate((el) => {
        const id = el.id;
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        const hasAssociatedLabel = id && document.querySelector(`label[for="${id}"]`);

        return !!(ariaLabel || ariaLabelledBy || hasAssociatedLabel);
      });

      expect(hasLabel).toBeTruthy();
    }

    // Check for proper button labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAccessibleName = await button.evaluate((el) => {
        const textContent = el.textContent?.trim();
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');

        return !!(textContent || ariaLabel || ariaLabelledBy);
      });

      expect(hasAccessibleName).toBeTruthy();
    }
  });

  test('Color contrast compliance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Run axe scan specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .withRules(['color-contrast'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Focus management', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test that focus is visible
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      const active = document.activeElement;
      const computedStyle = window.getComputedStyle(active as Element);

      return {
        tagName: active?.tagName,
        outline: computedStyle.outline,
        outlineWidth: computedStyle.outlineWidth,
        outlineColor: computedStyle.outlineColor,
        boxShadow: computedStyle.boxShadow
      };
    });

    // Should have some form of focus indicator
    const hasFocusIndicator =
      focusedElement.outline !== 'none' ||
      focusedElement.outlineWidth !== '0px' ||
      focusedElement.boxShadow !== 'none';

    expect(hasFocusIndicator || focusedElement.tagName === 'BODY').toBeTruthy();
  });
});