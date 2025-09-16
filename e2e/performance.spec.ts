import { test, expect } from '@playwright/test';

test.describe('Performance Regression Testing', () => {
  test('Page load performance', async ({ page }) => {
    // Start timing
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);

    // Check Core Web Vitals
    const webVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: any = {};

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            vitals.lcp = entry.startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // First Input Delay (FID) - approximation with click
        let fidMeasured = false;
        const measureFID = () => {
          if (!fidMeasured) {
            const start = performance.now();
            setTimeout(() => {
              vitals.fid = performance.now() - start;
              fidMeasured = true;
            }, 0);
          }
        };

        document.addEventListener('click', measureFID, { once: true });
        document.addEventListener('keydown', measureFID, { once: true });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          }
          vitals.cls = clsScore;
        }).observe({ type: 'layout-shift', buffered: true });

        // Return after a short delay to capture metrics
        setTimeout(() => resolve(vitals), 2000);
      });
    });

    console.log('Web Vitals:', webVitals);

    // Core Web Vitals thresholds (good performance)
    if (webVitals.lcp) {
      expect(webVitals.lcp).toBeLessThan(2500); // LCP should be < 2.5s
    }
    if (webVitals.cls) {
      expect(webVitals.cls).toBeLessThan(0.1); // CLS should be < 0.1
    }
  });

  test('Bundle size regression', async ({ page }) => {
    // Navigate to page and analyze resources
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get resource sizes
    const resourceSizes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let jsSize = 0;
      let cssSize = 0;
      let totalSize = 0;

      resources.forEach((resource) => {
        const size = resource.transferSize || 0;
        totalSize += size;

        if (resource.name.endsWith('.js')) {
          jsSize += size;
        } else if (resource.name.endsWith('.css')) {
          cssSize += size;
        }
      });

      return {
        total: totalSize,
        javascript: jsSize,
        css: cssSize,
        count: resources.length
      };
    });

    console.log('Resource sizes:', resourceSizes);

    // Bundle size thresholds
    expect(resourceSizes.javascript).toBeLessThan(1024 * 1024); // JS < 1MB
    expect(resourceSizes.css).toBeLessThan(256 * 1024); // CSS < 256KB
    expect(resourceSizes.total).toBeLessThan(2 * 1024 * 1024); // Total < 2MB
  });

  test('Memory usage', async ({ page, context }) => {
    // Create performance observer
    const cdpSession = await context.newCDPSession(page);
    await cdpSession.send('Performance.enable');

    // Navigate and interact
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Simulate user interactions
    const trackCards = page.locator('[data-testid="track-card"]');
    const cardCount = await trackCards.count();

    for (let i = 0; i < Math.min(cardCount, 3); i++) {
      await trackCards.nth(i).hover();
      await page.waitForTimeout(100);
    }

    // Force garbage collection and measure memory
    const memoryUsage = await cdpSession.send('Runtime.getHeapUsage');

    console.log('Memory usage:', memoryUsage);

    // Memory should be reasonable (< 100MB for a simple page)
    expect(memoryUsage.usedSize).toBeLessThan(100 * 1024 * 1024);

    await cdpSession.detach();
  });

  test('Audio loading performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on first track to go to detail page
    const firstTrack = page.locator('[data-testid="track-card"]').first();
    if (await firstTrack.isVisible()) {
      await firstTrack.click();
      await page.waitForLoadState('networkidle');

      // Time audio player response
      const startTime = Date.now();

      const playButton = page.locator('button').filter({ hasText: /play|▶/ }).or(
        page.locator('button[aria-label*="play"]')
      ).first();

      if (await playButton.isVisible()) {
        await playButton.click();

        // Wait for audio player to appear
        await page.waitForSelector('[data-testid="audio-player"]', {
          state: 'visible',
          timeout: 5000
        }).catch(() => {
          // Audio player might use different selector
          return page.waitForSelector('.fixed.bottom-0', {
            state: 'visible',
            timeout: 5000
          });
        });

        const responseTime = Date.now() - startTime;

        console.log('Audio player response time:', responseTime, 'ms');

        // Audio player should appear within 3 seconds
        expect(responseTime).toBeLessThan(3000);
      }
    }
  });

  test('Database query performance', async ({ page }) => {
    // Measure time to load and display data
    const startTime = Date.now();

    await page.goto('/');

    // Wait for first track to appear (indicating data loaded)
    await page.waitForSelector('[data-testid="track-card"]', {
      state: 'visible',
      timeout: 10000
    });

    const dataLoadTime = Date.now() - startTime;

    console.log('Data load time:', dataLoadTime, 'ms');

    // Data should load within 8 seconds
    expect(dataLoadTime).toBeLessThan(8000);

    // Check that multiple tracks loaded (indicates bulk query worked)
    const trackCount = await page.locator('[data-testid="track-card"]').count();
    expect(trackCount).toBeGreaterThan(1);
  });

  test('Image loading optimization', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check image loading performance
    const imageMetrics = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let totalImages = 0;
      let loadedImages = 0;
      let failedImages = 0;

      images.forEach((img) => {
        totalImages++;
        if (img.complete) {
          if (img.naturalWidth > 0) {
            loadedImages++;
          } else {
            failedImages++;
          }
        }
      });

      return {
        total: totalImages,
        loaded: loadedImages,
        failed: failedImages,
        loadRate: totalImages > 0 ? (loadedImages / totalImages) * 100 : 100
      };
    });

    console.log('Image loading metrics:', imageMetrics);

    // At least 80% of images should load successfully
    expect(imageMetrics.loadRate).toBeGreaterThan(80);

    // Should not have excessive failed images
    expect(imageMetrics.failed).toBeLessThan(imageMetrics.total * 0.2);
  });

  test('Network request optimization', async ({ page }) => {
    // Track network requests
    const requests: any[] = [];

    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
        timestamp: Date.now()
      });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Analyze requests
    const apiRequests = requests.filter(r => r.url.includes('supabase') || r.url.includes('api'));
    const imageRequests = requests.filter(r => r.resourceType === 'image');
    const duplicateUrls = new Set();
    const duplicates = requests.filter(r => {
      if (duplicateUrls.has(r.url)) {
        return true;
      }
      duplicateUrls.add(r.url);
      return false;
    });

    console.log('Network analysis:', {
      totalRequests: requests.length,
      apiRequests: apiRequests.length,
      imageRequests: imageRequests.length,
      duplicates: duplicates.length
    });

    // Should not have excessive API calls
    expect(apiRequests.length).toBeLessThan(20);

    // Should not have many duplicate requests
    expect(duplicates.length).toBeLessThan(5);

    // Should not make too many image requests initially
    expect(imageRequests.length).toBeLessThan(50);
  });
});