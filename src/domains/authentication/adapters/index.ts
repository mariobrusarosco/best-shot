import { useAuth0 } from "@auth0/auth0-react";
import {
	ByPassAuthProvider,
	useReactContextAdapter,
} from "@/domains/authentication/context/bypass";
import OktaAuth0Provider from "@/domains/authentication/context/auth-0";
import { APP_MODES } from "@/domains/global/typing";

type IAuthAdapter = Record<
	APP_MODES,
	{
		Provider: ({ children }: { children: React.ReactNode }) => JSX.Element;
		hook: () => any;
	}
>;

export const AuthenticationAdapter: IAuthAdapter = {
	"local-dev": {
		Provider: ByPassAuthProvider,
		hook: useReactContextAdapter,
	},
	demo: {
		Provider: ByPassAuthProvider,
		hook: useReactContextAdapter,
	},
	staging: { Provider: OktaAuth0Provider, hook: useAuth0 },
	production: { Provider: OktaAuth0Provider, hook: useAuth0 },
};
