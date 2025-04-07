import { test, expect } from '@playwright/test';

test.describe('Property Search Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page with search functionality', async ({ page }) => {
    // Verify initial state
    await expect(page.getByRole('heading', { name: 'UK Property Search' })).toBeVisible();
    await expect(page.getByPlaceholder('Enter a location')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('should allow searching for properties by location', async ({ page }) => {
    // Enter a location and search
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // Verify results
    await expect(page.getByText('properties found')).toBeVisible();
    await expect(page.locator('.property-grid')).toBeVisible();
  });

  test('should allow filtering properties', async ({ page }) => {
    // First search for a location
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // Open filters
    await page.getByRole('button', { name: 'Filters' }).click();

    // Apply filters
    await page.getByLabel('Radius').selectOption('2');
    await page.getByLabel('Min Price').fill('200000');
    await page.getByLabel('Max Price').fill('500000');
    await page.getByLabel('Property Type').selectOption('Detached');
    await page.getByRole('button', { name: 'Apply Filters' }).click();

    // Verify filtered results
    await expect(page.getByText('properties found')).toBeVisible();
  });

  test('should allow saving and viewing saved properties', async ({ page }) => {
    // Search for properties
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // Save a property
    const firstProperty = page.locator('.property-card').first();
    await firstProperty.getByRole('button', { name: 'Save Property' }).click();

    // Verify property is saved
    await expect(page.getByText('Saved Properties')).toBeVisible();
    await expect(page.locator('.saved-properties-grid')).toBeVisible();
  });

  test('should allow comparing properties', async ({ page }) => {
    // Search for properties
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // Add properties to compare
    const properties = page.locator('.property-card');
    await properties.nth(0).getByRole('button', { name: 'Compare' }).click();
    await properties.nth(1).getByRole('button', { name: 'Compare' }).click();

    // Open compare view
    await page.getByRole('button', { name: 'Compare (2)' }).click();

    // Verify compare view
    await expect(page.getByText('Compare Properties')).toBeVisible();
    await expect(page.locator('.compare-grid')).toBeVisible();
  });

  test('should show property details when clicking view details', async ({ page }) => {
    // Search for properties
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // View property details
    await page.locator('.property-card').first().getByRole('button', { name: 'View Details' }).click();

    // Verify property details modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Property Details')).toBeVisible();
    await expect(page.getByText('Similar Properties')).toBeVisible();
  });

  test('should persist saved properties after page refresh', async ({ page }) => {
    // Search and save a property
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('.property-card').first().getByRole('button', { name: 'Save Property' }).click();

    // Refresh the page
    await page.reload();

    // Verify saved property is still there
    await expect(page.getByText('Saved Properties')).toBeVisible();
    await expect(page.locator('.saved-properties-grid')).toBeVisible();
  });

  test('should show similar properties in the details view', async ({ page }) => {
    // Search for properties
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // View property details
    await page.locator('.property-card').first().getByRole('button', { name: 'View Details' }).click();

    // Verify similar properties section
    await expect(page.getByText('Similar Properties')).toBeVisible();
    await expect(page.locator('.similar-properties-grid')).toBeVisible();
  });

  test('should allow sharing properties', async ({ page }) => {
    // Search for properties
    await page.getByPlaceholder('Enter a location').fill('London');
    await page.getByRole('button', { name: 'Search' }).click();

    // View property details
    await page.locator('.property-card').first().getByRole('button', { name: 'View Details' }).click();

    // Click share button
    await page.getByRole('button', { name: 'Share Property' }).click();

    // Verify share functionality
    // Note: This test might need to be adjusted based on the actual share implementation
    await expect(page.getByText('Share this property')).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Try searching with invalid location
    await page.getByPlaceholder('Enter a location').fill('Invalid Location');
    await page.getByRole('button', { name: 'Search' }).click();

    // Verify error message
    await expect(page.getByText('No properties found')).toBeVisible();
  });
}); 