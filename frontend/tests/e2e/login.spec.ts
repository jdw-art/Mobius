import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully and redirect to project list', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login page
    await expect(page).toHaveURL(/.*login.*/);

    // Fill in login form
    await page.getByPlaceholder('用户名').fill('admin');
    await page.getByPlaceholder('密码').fill('admin123');

    // Click login button
    await page.getByRole('button', { name: '登录' }).click();

    // Should redirect to project list
    await expect(page).toHaveURL(/.*\/project.*/);

    // Should see project list
    await expect(page.getByText('项目列表')).toBeVisible({ timeout: 10000 });
  });
});