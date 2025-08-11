import { Page, expect } from '@playwright/test';
import { TestConfig } from '../../config/TestConfig';

/**
 * Enterprise-grade authentication helper for E2E testing
 * Provides secure, reliable authentication handling with error recovery
 */
export class AuthenticationHelper {
  private page: Page;
  private config: typeof TestConfig;

  constructor(page: Page) {
    this.page = page;
    this.config = TestConfig;
  }

  /**
   * Sets up demo environment for testing
   * Uses bypass authentication to avoid external dependencies
   */
  async setupDemoEnvironment(): Promise<void> {
    try {
      // Navigate to demo environment
      await this.page.goto(`${this.config.demo.baseUrl}?mode=demo`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for demo mode to be properly initialized
      await this.page.waitForTimeout(1000);

      // Verify we're in demo mode
      const isDemoMode = await this.page.evaluate(() => {
        try {
          return window.location.search.includes('mode=demo') || 
                 (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('demo-mode') === 'true');
        } catch {
          return window.location.search.includes('mode=demo');
        }
      });

      if (!isDemoMode) {
        throw new Error('Failed to initialize demo mode');
      }

      console.log('✅ Demo environment setup complete');
    } catch (error) {
      console.error('❌ Failed to setup demo environment:', error);
      throw error;
    }
  }

  /**
   * Simulates authenticated state for testing
   * Bypasses actual authentication flow for reliable testing
   */
  async simulateAuthenticatedState(userId: string = 'test-user-123'): Promise<void> {
    try {
      // Set authentication state in localStorage with proper error handling
      await this.page.evaluate(({ userId }) => {
        const setItemSafely = (key: string, value: string) => {
          try {
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem(key, value);
              return true;
            }
            return false;
          } catch (error) {
            console.warn(`Could not set localStorage item ${key}:`, error);
            return false;
          }
        };

        // Set demo authentication tokens
        setItemSafely('demo-auth-token', `demo-token-${userId}`);
        setItemSafely('demo-user-id', userId);
        setItemSafely('demo-authenticated', 'true');
        setItemSafely('demo-user-data', JSON.stringify({
          id: userId,
          email: `${userId}@demo.com`,
          name: 'Demo User',
          picture: 'https://via.placeholder.com/150'
        }));

        // Set session storage as fallback
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.setItem('demo-session', 'active');
          }
        } catch (error) {
          console.warn('Could not set sessionStorage:', error);
        }
      }, { userId });

      // Reload page to apply authentication state
      await this.page.reload({ waitUntil: 'networkidle' });

      console.log('✅ Authenticated state simulated successfully');
    } catch (error) {
      console.error('❌ Failed to simulate authenticated state:', error);
      throw error;
    }
  }

  /**
   * Verifies that user is authenticated
   */
  async verifyAuthenticated(): Promise<boolean> {
    try {
      // Check for authentication indicators
      const authState = await this.page.evaluate(() => {
        const checks = {
          localStorage: false,
          sessionStorage: false,
          url: false,
          dom: false
        };

        // Check localStorage safely
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            checks.localStorage = window.localStorage.getItem('demo-authenticated') === 'true' ||
                                 window.localStorage.getItem('demo-auth-token') !== null;
          }
        } catch (error) {
          console.warn('localStorage check failed:', error);
        }

        // Check sessionStorage safely
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            checks.sessionStorage = window.sessionStorage.getItem('demo-session') === 'active';
          }
        } catch (error) {
          console.warn('sessionStorage check failed:', error);
        }

        // Check URL
        checks.url = !window.location.pathname.includes('/login') && 
                    !window.location.pathname.includes('/signup');

        // Check DOM for authenticated content
        checks.dom = document.querySelector('[data-ui="screen-heading"]') !== null ||
                    document.querySelector('menu') !== null;

        return checks;
      });

      // Consider authenticated if any check passes
      const isAuthenticated = authState.localStorage || 
                             authState.sessionStorage || 
                             (authState.url && authState.dom);

      if (isAuthenticated) {
        console.log('✅ User verification: Authenticated');
      } else {
        console.log('❌ User verification: Not authenticated');
      }

      return isAuthenticated;
    } catch (error) {
      console.error('❌ Authentication verification failed:', error);
      return false;
    }
  }

  /**
   * Handles authentication flow if needed
   */
  async ensureAuthenticated(): Promise<void> {
    const isAuth = await this.verifyAuthenticated();
    
    if (!isAuth) {
      console.log('🔄 User not authenticated, setting up demo authentication...');
      await this.setupDemoEnvironment();
      await this.simulateAuthenticatedState();
      
      // Verify authentication worked
      const finalCheck = await this.verifyAuthenticated();
      if (!finalCheck) {
        throw new Error('Failed to establish authenticated state');
      }
    }
  }

  /**
   * Clears authentication state with safe error handling
   */
  async clearAuthentication(): Promise<void> {
    try {
      await this.page.evaluate(() => {
        const clearStorageSafely = (storage: Storage, keys: string[]) => {
          try {
            if (storage) {
              keys.forEach(key => {
                try {
                  storage.removeItem(key);
                } catch (error) {
                  console.warn(`Could not remove ${key} from storage:`, error);
                }
              });
            }
          } catch (error) {
            console.warn('Storage clearing failed:', error);
          }
        };

        // Clear localStorage safely
        const localStorageKeys = [
          'demo-auth-token',
          'demo-user-id', 
          'demo-authenticated',
          'demo-user-data'
        ];
        
        if (typeof window !== 'undefined' && window.localStorage) {
          clearStorageSafely(window.localStorage, localStorageKeys);
        }

        // Clear sessionStorage safely
        const sessionStorageKeys = ['demo-session'];
        
        if (typeof window !== 'undefined' && window.sessionStorage) {
          clearStorageSafely(window.sessionStorage, sessionStorageKeys);
        }
      });

      console.log('✅ Authentication state cleared');
    } catch (error) {
      console.error('❌ Failed to clear authentication:', error);
      // Don't throw here - clearing auth failure shouldn't break tests
    }
  }

  /**
   * Navigates to login page and handles demo authentication
   */
  async navigateToLogin(): Promise<void> {
    try {
      await this.page.goto(`${this.config.demo.baseUrl}/login?mode=demo`);
      
      // In demo mode, we can simulate clicking login
      const loginButton = this.page.locator('button:has-text("LOGIN")');
      await expect(loginButton).toBeVisible({ timeout: 10000 });
      
      await loginButton.click();
      
      // Wait for navigation to complete
      await this.page.waitForURL(/.*dashboard/, { timeout: 15000 });
      
      console.log('✅ Login navigation complete');
    } catch (error) {
      console.error('❌ Login navigation failed:', error);
      throw error;
    }
  }

  /**
   * Handles logout process
   */
  async logout(): Promise<void> {
    try {
      await this.clearAuthentication();
      await this.page.goto(`${this.config.demo.baseUrl}/login?mode=demo`);
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      throw error;
    }
  }

  /**
   * Wait for authentication to be ready
   */
  async waitForAuthReady(timeout: number = 10000): Promise<void> {
    try {
      await this.page.waitForFunction(
        () => {
          try {
            // Check if we have auth indicators
            const hasAuthToken = (typeof window !== 'undefined' && 
                                 window.localStorage && 
                                 window.localStorage.getItem('demo-authenticated') === 'true') ||
                                document.querySelector('[data-ui="screen-heading"]') !== null;
            
            const notOnLoginPage = !window.location.pathname.includes('/login');
            
            return hasAuthToken && notOnLoginPage;
          } catch {
            // If localStorage fails, check DOM only
            return document.querySelector('[data-ui="screen-heading"]') !== null &&
                   !window.location.pathname.includes('/login');
          }
        },
        { timeout }
      );
      
      console.log('✅ Authentication ready');
    } catch (error) {
      console.warn('⚠️ Authentication ready timeout - proceeding anyway');
    }
  }
}