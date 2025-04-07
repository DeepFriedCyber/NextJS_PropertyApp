import { chromium } from '@playwright/test';

async function globalSetup() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Navigate to the app and set up test data
  await page.goto('http://localhost:3000');
  
  // Clear any existing saved properties
  await page.evaluate(() => {
    localStorage.removeItem('savedProperties');
  });
  
  await browser.close();
}

export default globalSetup;

// Add a test to make Jest happy
describe('Global Setup', () => {
  it('should be a function', () => {
    expect(typeof globalSetup).toBe('function');
  });
}); 