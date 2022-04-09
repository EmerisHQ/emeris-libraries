import { expect, test } from './extension-setup';

test.describe('Welcome page', () => {
  test('Loader shows', async ({ page }) => {
    await page.goto(
      'chrome-extension://bfgnlimijmfdeglfpcmdlcebeifaikng/popup.html'
    )
    await page.waitForSelector('.ephemeris');
  });
});
