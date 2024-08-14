/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BEST_SHOT_API: string;
	readonly VITE_ACCESS_CONTROL_ALLOW_ORIGIN: string;
	readonly VITE_AUTH_DOMAIN: string;
	readonly VITE_AUTH_CLIENT_ID: string;
	readonly VITE_AUTH_CLIENT_SECRETS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
