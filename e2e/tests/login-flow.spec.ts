import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
	test('should successfully log in with existing credentials via Auth0', async ({ page, context }) => {
		// Step 1: Navigate to login page
		await page.goto('/login');
		await expect(page).toHaveURL(/.*login/);
		await expect(page).toHaveTitle(/Best Shot/);

		// Step 2: Click LOGIN button
		const loginButton = page.getByRole('button', { name: 'LOGIN' });
		await expect(loginButton).toBeVisible();

		// Step 3: Click login and wait for Auth0 (if it opens) or direct redirect
		const auth0PagePromise = context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
		const dashboardRedirectPromise = page.waitForURL(/.*dashboard/, { timeout: 5000 }).catch(() => null);

		await loginButton.click();

		// Step 4: Handle Auth0 login if popup opens, otherwise check if already logged in
		const auth0Page = await auth0PagePromise;
		const redirected = await dashboardRedirectPromise;

		if (auth0Page && !redirected) {
			// Auth0 popup opened - need to fill in credentials
			await auth0Page.waitForLoadState('networkidle');
			await expect(auth0Page).toHaveURL(/.*auth0\.com.*login/);

			// Step 5: Fill in login credentials from environment variables
			const email = process.env.E2E_TEST_EMAIL || 'testuser123@example.com';
			const password = process.env.E2E_TEST_PASSWORD || 'TestPassword123!';

			if (!process.env.E2E_TEST_EMAIL || !process.env.E2E_TEST_PASSWORD) {
				console.warn('⚠️  E2E_TEST_EMAIL and E2E_TEST_PASSWORD not set. Using fallback credentials.');
			}

			await auth0Page.getByRole('textbox', { name: /email|username/i }).fill(email);
			await auth0Page.getByRole('textbox', { name: /password/i }).fill(password);

			// Step 6: Click Continue/Log In button
			// Use exact match to avoid matching "Continue with Google" or "Continue with Microsoft"
			const continueButton = auth0Page.getByRole('button', { name: 'Continue', exact: true });
			await continueButton.click();

			// Step 7: Wait for redirect back to app
			await page.waitForURL(/.*dashboard/, { timeout: 15000 });
		} else if (redirected) {
			// Already logged in or session exists - just verify
			await page.waitForLoadState('networkidle');
		} else {
			// Wait a bit and check if we're redirected
			await page.waitForURL(/.*dashboard|.*login/, { timeout: 10000 });
		}

		// Step 8: Verify successful login - should be on dashboard
		await expect(page).toHaveURL(/.*dashboard/);

		// Step 9: Verify user is logged in - check for username in greeting
		// Extract username from email for verification
		const username = process.env.E2E_TEST_EMAIL?.split('@')[0] || 'testuser123';
		// Use test-id to avoid strict mode violations
		await expect(page.getByTestId('screen-heading-subtitle')).toHaveText(username);
	});

	test('should show login form correctly', async ({ page }) => {
		await page.goto('/login');

		// Verify login page elements
		await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
		await expect(page.getByText('New to Best Shot?')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Register now!' })).toBeVisible();
	});

	test('should redirect to dashboard after successful login', async ({ page }) => {
		// This test assumes user is already logged in or will be logged in
		await page.goto('/login');

		// Click login (might use existing session or trigger Auth0)
		const loginButton = page.getByRole('button', { name: 'LOGIN' });
		await loginButton.click();

		// Wait for redirect to dashboard
		await page.waitForURL(/.*dashboard/, { timeout: 15000 });

		// Verify dashboard elements
		await expect(page.getByText(/Hello,|Matchday|tournaments/i)).toBeVisible();
	});
});

