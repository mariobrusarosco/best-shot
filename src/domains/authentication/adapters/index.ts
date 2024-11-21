import OktaAuth0Provider from "@/domains/authentication/context/auth-0";
import {
	ByPassAuthProvider,
	useReactContextAdapter,
} from "@/domains/authentication/context/bypass";
import { APP_MODES } from "@/domains/global/typing";
import { useAuth0 } from "@auth0/auth0-react";

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
	staging: { Provider: ByPassAuthProvider, hook: useReactContextAdapter },
	production: { Provider: OktaAuth0Provider, hook: useAuth0 },
};
