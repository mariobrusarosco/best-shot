declare global {
	namespace NodeJS {
		interface ProcessEnv {
			VITE_AUTH_DOMAIN: string;
			VITE_AUTH_CLIENT_ID: string;
			VITE_BEST_SHOT_API: string;
			VITE_MOCKED_MEMBER_PUBLIC_ID: string;
			VITE_DATA_PROVIDER_ASSETS_URLVITE_DATA_PROVIDER_ASSETS_URL: string;
		}
	}
}

// All MUI type augmentations have been moved to src/types/mui-overrides.d.ts
// This prevents conflicts and provides a single source of truth for all MUI extensions
