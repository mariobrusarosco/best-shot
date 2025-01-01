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
	login: () => Promise<any>;
	logout: () => Promise<any>;
	signup: () => Promise<any>;
};

export type IAuthAdapter = Record<
	APP_MODES,
	{
		AuthProvider: IAuthProvider;
		useAppAuth: () => IAuthHook;
	}
>;
