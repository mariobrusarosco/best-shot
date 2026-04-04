import { APP_MODE } from "@/domains/global/utils";
import Auth0 from "./adapters/auth-0";
import Bypass from "./adapters/bypass";
import type { IAuthAdapter } from "./adapters/typing";

export const Authentication: IAuthAdapter = {
	"local-dev": {
		Provider: Auth0.AuthProvider,
		useAuthenticatedUser: Auth0.useAuthenticatedUser,
	},
	demo: {
		Provider: Bypass.Provider,
		useAuthenticatedUser: Bypass.useAuthenticatedUser,
	},
	staging: {
		Provider: Auth0.AuthProvider,
		useAuthenticatedUser: Auth0.useAuthenticatedUser,
	},
	production: {
		Provider: Auth0.AuthProvider,
		useAuthenticatedUser: Auth0.useAuthenticatedUser,
	},
}[APP_MODE];
