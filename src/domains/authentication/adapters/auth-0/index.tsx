import { api } from "@/api";
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
	const databaseAuth = useDatabaseAuth(user?.sub);

	const appLogin = async () => {
		try {
			await loginWithPopup({
				authorizationParams: {
					screen_hint: "login",
				},
			});
			console.log("login OK", { isLoading, user });
			// const user = await getIdTokenClaims();
			// console.log("got user", { isLoading, user });
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	const appSignup = async () => {
		try {
			await loginWithPopup({
				authorizationParams: {
					screen_hint: "signup",
				},
			});
			const user = await getIdTokenClaims();

			databaseAuth.mutation.mutate(user);
		} catch (error) {
			alert(error);
			useDatabaseAuth;
			return Promise.reject(error);
		}
	};

	const appLogout = async () => {
		try {
			await logout();
			await api.delete("whoami");
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	return {
		isAuthenticated: isAuthenticated && databaseAuth.isSuccess,
		isLoadingAuth: isLoading || databaseAuth.isLoading,
		authId: user?.sub,
		signup: appSignup,
		login: appLogin,
		logout: appLogout,
	} satisfies IAuthHook;
};

export default { hook, Provider };
