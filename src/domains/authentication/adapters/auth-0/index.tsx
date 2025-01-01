import { api } from "@/api";
import { Auth0Provider, useAuth0 as useAuthBase } from "@auth0/auth0-react";
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

	const appLogin = async () => {
		try {
			await loginWithPopup({
				authorizationParams: {
					screen_hint: "login",
				},
			});
			const user = await getIdTokenClaims();

			await api.get("whoami", {
				params: { publicId: user?.sub },
			});
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

			await api.post("whoami", {
				publicId: user?.sub,
				email: user?.email,
				firstName: user?.given_name,
				lastName: user?.family_name,
				nickName: user?.nickname ?? user?.given_name,
			});
		} catch (error) {
			alert(error);

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
		isAuthenticated,
		isLoadingAuth: isLoading,
		authId: user?.sub,
		signup: appSignup,
		login: appLogin,
		logout: appLogout,
	} satisfies IAuthHook;
};

export default { hook, Provider };
