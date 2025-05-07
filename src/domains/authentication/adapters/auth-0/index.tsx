import { api } from "@/api";
import { useMember } from "@/domains/member/hooks/use-member";
import { Auth0Provider, useAuth0 as useAuthBase } from "@auth0/auth0-react";
import { useDatabaseAuth } from "../../hooks/use-database-auth";
import { IAuthHook } from "../typing";

const Provider = ({ children }: { children: React.ReactNode }) => {
	return (
		<Auth0Provider
			domain={import.meta.env.VITE_AUTH_DOMAIN}
			clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
			authorizationParams={{
				redirect_uri: window.location.origin,
			}}
			useRefreshTokens={true}
			cacheLocation="localstorage"
		>
			{children}
		</Auth0Provider>
	);
};

const hook = () => {
	const {
		isAuthenticated,
		isLoading,
		user,
		loginWithPopup,
		logout,
		getIdTokenClaims,
	} = useAuthBase();
	const databaseAuth = useDatabaseAuth();
	const member = useMember({ fetchOnMount: isAuthenticated });

	const appLogin = async () => {
		try {
			await loginWithPopup({
				authorizationParams: {
					screen_hint: "login",
				},
			});
			const user = await getIdTokenClaims();
			if (!user) throw new Error("User not found");

			console.log("login OK", { isLoading, user });

			return await databaseAuth.login.mutateAsync(user.sub);
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	const appSignup = async () => {
		try {
			await loginWithPopup({
				authorizationParams: { screen_hint: "signup" },
			});
			const user = await getIdTokenClaims();
			console.log("User from token", user);
			
			const mutation = databaseAuth.sign.mutate(user);
			console.log("Mutation", mutation);

			return mutation;
		} catch (error) {
			alert(error);
			return Promise.reject(error);
		}
	};

	const appLogout = async () => {
		try {
			await logout({ logoutParams: { returnTo: window.location.origin } });
			await api.delete("auth");
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	return {
		isAuthenticated: isAuthenticated && member.isSuccess,
		isLoadingAuth: isLoading || member.isLoading,
		authId: user?.sub,
		signup: appSignup,
		login: appLogin,
		logout: appLogout,
	} satisfies IAuthHook;
};

export default { hook, Provider };
