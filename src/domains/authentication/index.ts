import { APP_MODE } from "@/domains/global/utils";
import Auth0 from "./adapters/auth-0";
import Bypass from "./adapters/bypass";
import type { IAuthAdapter } from "./adapters/typing";

const AuthenticationAdapter: IAuthAdapter = {
	"local-dev": {
		AuthProvider: Auth0.Provider,
		useAppAuth: Auth0.hook,
	},
	demo: {
		AuthProvider: Bypass.Provider,
		useAppAuth: Bypass.hook,
	},
	staging: { AuthProvider: Auth0.Provider, useAppAuth: Auth0.hook },
	production: { AuthProvider: Auth0.Provider, useAppAuth: Auth0.hook },
};

export const Authentication = AuthenticationAdapter[APP_MODE];
