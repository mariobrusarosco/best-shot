import { useAuth0 } from "@auth0/auth0-react";
import { ByPassAuthProvider } from "./context/bypass";
import OktaAuth0Provider from "./context/auth-0";

export const AuthenticationAdapter = {
	localhost: { Provider: OktaAuth0Provider, hook: useAuth0 },
	demo: {
		Provider: ByPassAuthProvider,
		hook: () => ({
			isAuthenticated: true,
		}),
	},
	staging: { Provider: OktaAuth0Provider, hook: useAuth0 },
	production: { Provider: OktaAuth0Provider, hook: useAuth0 },
};
