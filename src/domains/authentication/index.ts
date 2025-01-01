import { APP_MODE } from "../global/utils";
import { ByPassAuthProvider, useByPassAuth } from "./adapters/bypass";
import { IAuthAdapter } from "./adapters/typing";

import Auth0 from "./adapters/auth-0";

const AuthenticationAdapter: IAuthAdapter = {
	"local-dev": {
		AuthProvider: ByPassAuthProvider,
		useAppAuth: useByPassAuth,
	},
	demo: {
		AuthProvider: ByPassAuthProvider,
		useAppAuth: useByPassAuth,
	},
	staging: { AuthProvider: ByPassAuthProvider, useAppAuth: useByPassAuth },
	production: { AuthProvider: Auth0.Provider, useAppAuth: Auth0.hook },
};

export const Authentication = AuthenticationAdapter[APP_MODE];
