import { test, expect } from '@playwright/test';

test('should add property to comparison', async ({ page }) => {
  // Enable debug logging
  page.on('console', msg => console.log(msg.text()));
  page.on('pageerror', err => console.error(err));

  // Mock API responses
  await page.route('**/api/properties/location', async (route) => {
    console.log('Mocking properties/location API');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        properties: [
          {
            id: '1',
            title: 'Test Property 1',
            price: 500000,
            location: 'London',
            bedrooms: 2,
            bathrooms: 1,
            image_url: '/placeholder.jpg'
          }
        ]
      })
    });
  });

  await page.route('**/api/properties/compare', async (route) => {
    console.log('Mocking properties/compare API');
    const request = await route.request().postDataJSON();
    const ids = request.ids || [];
    
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '1',
          title: 'Test Property 1',
          price: 500000,
          location: 'London',
          bedrooms: 2,
          bathrooms: 1,
          image_url: '/placeholder.jpg'
        }
      ].filter(p => ids.includes(p.id)))
    });
  });

  console.log('Navigating to home page');
  await page.goto('/', { waitUntil: 'networkidle' });
  
  console.log('Waiting for property grid');
  await page.waitForSelector('[data-testid="property-grid"]', { state: 'visible', timeout: 10000 });
  
  console.log('Waiting for property card');
  await page.waitForSelector('[data-testid="property-card-1"]', { state: 'visible', timeout: 10000 });
  
  // Take a screenshot before clicking
  await page.screenshot({ path: 'before-click.png', fullPage: true });
  
  console.log('Waiting for add to compare button to be ready');
  const addToCompareButton = page.locator('[data-testid="add-to-compare-1"]');
  await addToCompareButton.waitFor({ state: 'visible', timeout: 10000 });
  
  console.log('Clicking add to compare button');
  await addToCompareButton.click();
  
  // Take a screenshot after clicking
  await page.screenshot({ path: 'after-click.png', fullPage: true });
  
  console.log('Waiting for compare button');
  const compareButton = page.locator('[data-testid="compare-button"]');
  await compareButton.waitFor({ state: 'visible', timeout: 10000 });
  
  console.log('Getting compare button text');
  const compareButtonText = await compareButton.textContent();
  console.log('Compare button text:', compareButtonText);
  expect(compareButtonText).toContain('Compare (1)');

  // Take a final screenshot
  await page.screenshot({ path: 'final.png', fullPage: true });
}); 