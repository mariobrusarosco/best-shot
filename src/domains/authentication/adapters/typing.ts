import type { I_Member } from "@/domains/member/typing/types-and-interfaces";
import type { UseQueryResult } from "@tanstack/react-query";

export type IAuthProvider = ({ children }: { children: React.ReactNode }) => JSX.Element;

export type IAuthHook = {
	isAuthenticated: boolean;
	isLoadingAuth: boolean;
	authId: string | undefined;
	login: () => Promise<unknown>;
	logout: () => Promise<unknown>;
	signup: () => Promise<unknown>;
	member: UseQueryResult<I_Member, Error>;
};

export type IAuthAdapter = {
	Provider: IAuthProvider;
	useAuthenticatedUser: () => IAuthHook;
};
