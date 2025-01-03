import { APP_MODE } from "../global/utils";
import { IAuthAdapter } from "./adapters/typing";

import Auth0 from "./adapters/auth-0";
import ByPass from "./adapters/bypass";

const AuthenticationAdapter: IAuthAdapter = {
	"local-dev": {
		AuthProvider: Auth0.Provider,
		useAppAuth: Auth0.hook,
	},
	demo: {
		AuthProvider: ByPass.Provider,
		useAppAuth: ByPass.hook,
	},
	staging: { AuthProvider: Auth0.Provider, useAppAuth: Auth0.hook },
	production: { AuthProvider: Auth0.Provider, useAppAuth: Auth0.hook },
};

export const Authentication = AuthenticationAdapter[APP_MODE];
