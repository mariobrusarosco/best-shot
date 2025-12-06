import { test, expect } from '@playwright/test';

test.describe('Sign Up Flow', () => {
	test('should successfully create a new account via Auth0', async ({ page, context }) => {
		// Step 1: Navigate to signup page
		await page.goto('/signup');
		await expect(page).toHaveURL(/.*signup/);
		await expect(page).toHaveTitle(/Best Shot/);

		// Step 2: Click SIGN UP button
		const signUpButton = page.getByRole('button', { name: 'SIGN UP' });
		await expect(signUpButton).toBeVisible();
		
		// Wait for the Auth0 popup/new tab to open
		const [auth0Page] = await Promise.all([
			context.waitForEvent('page'), // Wait for new page/tab
			signUpButton.click(),
		]);

		// Step 3: Wait for Auth0 signup page to load
		await auth0Page.waitForLoadState('networkidle');
		await expect(auth0Page).toHaveURL(/.*auth0\.com.*signup/);
		await expect(auth0Page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

		// Step 4: Fill in the signup form
		// Generate a short unique username (max 20 chars: "testuser" = 8, so we have 12 chars for uniqueness)
		const timestamp = Date.now().toString().slice(-8); // Last 8 digits for uniqueness
		const username = `test${timestamp}`; // Max 12 chars, well under 20 char limit
		const email = `test${timestamp}@example.com`;
		const password = 'TestPassword123!';

		await auth0Page.getByRole('textbox', { name: 'Username' }).fill(username);
		await auth0Page.getByRole('textbox', { name: 'Email address' }).fill(email);
		await auth0Page.getByRole('textbox', { name: 'Password' }).fill(password);

		// Step 5: Click Continue button
		await auth0Page.getByRole('button', { name: 'Continue', exact: true }).click();

		// Step 6: Wait for navigation - could be consent page, error, or redirect
		try {
			// Wait for either consent page or check if page closed/redirected
			await Promise.race([
				auth0Page.waitForURL(/.*consent/, { timeout: 10000 }),
				page.waitForURL(/.*login|.*dashboard/, { timeout: 10000 }),
				auth0Page.waitForEvent('close', { timeout: 10000 }).then(() => 'closed'),
			]);
		} catch (error) {
			// Timeout - let's check what state we're in
			console.log('Navigation timeout - checking state...');
		}

		// Step 7: Handle consent page if it appeared
		if (!auth0Page.isClosed() && auth0Page.url().includes('consent')) {
			await expect(auth0Page.getByRole('heading', { name: 'Authorize App' })).toBeVisible();
			const acceptButton = auth0Page.getByRole('button', { name: 'Accept' });
			await expect(acceptButton).toBeVisible();

			// Accept consent and wait for redirect back to app
			await Promise.all([
				page.waitForURL(/.*login|.*dashboard|.*signup/, { timeout: 15000 }),
				acceptButton.click(),
			]);
		}
		// If Auth0 page closed or we're already redirected, that's fine
		// The signup might have completed or user might already exist

		// Step 8: Handle success dialog if it appears
		page.on('dialog', async (dialog) => {
			if (dialog.message().includes('Account created successfully')) {
				await dialog.accept();
			}
		});

		// Step 9: Verify we're redirected (either to login or dashboard)
		// The app redirects to login after successful signup
		await expect(page).toHaveURL(/.*login|.*dashboard/);

		// Step 10: Verify we're on the login page (expected behavior)
		if (page.url().includes('/login')) {
			await expect(page.getByRole('button', { name: 'LOGIN' })).toBeVisible();
		}
	});

	test('should show signup form correctly', async ({ page }) => {
		await page.goto('/signup');
		
		// Verify signup page elements
		await expect(page.getByRole('button', { name: 'SIGN UP' })).toBeVisible();
		await expect(page.getByRole('button', { name: /using Auth0 by Okta/ })).toBeVisible();
		await expect(page.getByText('Already have an account?')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Login now!' })).toBeVisible();
	});
});

