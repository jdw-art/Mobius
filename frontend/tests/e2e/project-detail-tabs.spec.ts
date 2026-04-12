import { test, expect } from '@playwright/test';

test.describe('Project Detail Tabs', () => {
  let projectId: string;

  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page).toHaveURL(/.*\/project.*/, { timeout: 10000 });

    // Get the URL to extract project ID
    const url = page.url();
    const match = url.match(/\/project\/([a-zA-Z0-9-]+)/);
    if (match) {
      projectId = match[1];
    } else {
      // Click first project if URL doesn't have project ID
      const firstProjectLink = page.locator('tbody tr:first-child a, tbody tr:first-child [role="button"]').first();
      await firstProjectLink.click();
      await expect(page).toHaveURL(/\/project\/[a-zA-Z0-9-]+/, { timeout: 5000 });
      const newUrl = page.url();
      const newMatch = newUrl.match(/\/project\/([a-zA-Z0-9-]+)/);
      projectId = newMatch ? newMatch[1] : '';
    }
  });

  test('should display Overview tab by default', async ({ page }) => {
    // Check that some overview content is visible
    await expect(page.locator('.ant-tabs-tab-active').or(page.getByText('概况'))).toBeVisible({ timeout: 5000 });
  });

  test('should display Requirements tab with data', async ({ page }) => {
    // Click Requirements tab
    await page.getByRole('tab', { name: /需求|Requirements/ }).click();

    // Should show requirements table or list
    await expect(page.locator('table, .ant-table')).toBeVisible({ timeout: 5000 });
  });

  test('should display Applications tab with data', async ({ page }) => {
    // Click Applications tab
    await page.getByRole('tab', { name: /应用|Applications/ }).click();

    // Should show applications table
    await expect(page.locator('table, .ant-table')).toBeVisible({ timeout: 5000 });
  });

  test('should display Builds tab with data', async ({ page }) => {
    // Click Builds tab
    await page.getByRole('tab', { name: /构建|Builds/ }).click();

    // Should show builds table
    await expect(page.locator('table, .ant-table')).toBeVisible({ timeout: 5000 });
  });

  test('should display Defects tab with data', async ({ page }) => {
    // Click Defects tab (测试缺陷)
    await page.getByRole('tab', { name: /测试缺陷|Defects/ }).click();

    // Should show defects table
    await expect(page.locator('table, .ant-table')).toBeVisible({ timeout: 5000 });
  });

  test('should display Documents tab with data', async ({ page }) => {
    // Click Documents tab
    await page.getByRole('tab', { name: /文档|Documents/ }).click();

    // Should show documents table
    await expect(page.locator('table, .ant-table')).toBeVisible({ timeout: 5000 });
  });

  test('should display Risks tab with data', async ({ page }) => {
    // Click Risks tab
    await page.getByRole('tab', { name: /风险|Risks/ }).click();

    // Should show risks table
    await expect(page.locator('table, .ant-table')).toBeVisible({ timeout: 5000 });
  });
});