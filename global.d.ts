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

export {};

// Type definitions for Tabler Icons
declare module "@tabler/icons-react/dist/icons/*.mjs" {
	import { ForwardRefExoticComponent, SVGProps } from "react";

	const IconComponent: ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;
	export default IconComponent;
}
