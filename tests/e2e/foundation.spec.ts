import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('static homepage is readable, navigable and accessible', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Ruby Liang/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Building things.',
  );
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await page.getByRole('link', { name: 'Explore the notebook' }).click();
  await expect(page).toHaveURL(/#notebook$/);
  await expect(
    page.getByRole('heading', { name: 'Inside the notebook' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Course notes' }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.screenshot({
    path: testInfo.outputPath('homepage.png'),
    fullPage: true,
  });
});

test('missing page returns a real 404', async ({ page }) => {
  const response = await page.goto('/does-not-exist/');
  expect(response?.status()).toBe(404);
});

test('small screens do not overflow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
