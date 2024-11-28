import OktaAuth0Provider, {
	useAuth0,
} from "@/domains/authentication/adapters/auth-0";
import {
	ByPassAuthProvider,
	useByPassAuth,
} from "@/domains/authentication/adapters/bypass";
import { APP_MODES } from "@/domains/global/typing";

export type IAuthProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => JSX.Element;

export type IAuthHook = {
	isAuthenticated: boolean;
	isLoadingAuth: boolean;
	authId: string | undefined;
};

export type IAuthAdapter = Record<
	APP_MODES,
	{
		Provider: IAuthProvider;
		hook: () => IAuthHook;
	}
>;

export const AuthenticationAdapter: IAuthAdapter = {
	"local-dev": {
		Provider: ByPassAuthProvider,
		hook: useByPassAuth,
	},
	demo: {
		Provider: ByPassAuthProvider,
		hook: useByPassAuth,
	},
	staging: { Provider: ByPassAuthProvider, hook: useByPassAuth },
	production: { Provider: OktaAuth0Provider, hook: useAuth0 },
};
