import { test, expect } from '@playwright/test';

test.describe('Project List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/');
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');
    await page.getByRole('button', { name: '登录' }).click();
    await expect(page).toHaveURL(/.*\/project.*/, { timeout: 10000 });
  });

  test('should display project list', async ({ page }) => {
    // Should have project list heading or title
    await expect(page.getByText('项目列表')).toBeVisible({ timeout: 5000 });

    // Should have at least one project
    const projectNames = page.getByTestId('project-name') || page.locator('tbody tr');
    await expect(projectNames.first()).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to project detail when clicking a project', async ({ page }) => {
    // Find and click the first project link
    const firstProjectLink = page.locator('tbody tr:first-child a, tbody tr:first-child [role="button"]').first();
    await firstProjectLink.click();

    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/project\/[a-zA-Z0-9-]+/, { timeout: 5000 });
  });
});