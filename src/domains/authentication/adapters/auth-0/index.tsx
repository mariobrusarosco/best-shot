import { api } from "@/api";
import { Auth0Provider, useAuth0 as useAuthBase } from "@auth0/auth0-react";
import { IAuthHook } from "..";

export default function OktaAuth0Provider({
	children,
}: {
	children: React.ReactNode;
}) {
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
}

export const useAuth0 = () => {
	const {
		isAuthenticated,
		isLoading,
		user,
		loginWithPopup,
		logout,
		getIdTokenClaims,
	} = useAuthBase();
	// const router = useRouter();
	// console.log({ router });

	const appLogin = async () => {
		await loginWithPopup({
			authorizationParams: {
				redirect_uri: "http://localhost:5173/dashboard/",
				screen_hint: "login",
			},
		});
		const user = await getIdTokenClaims();

		await api.get("whoami", {
			params: { publicId: user?.sub },
		});

		alert("Welcome back to Best Shot!");
		// navigate({ from: "/", to: "/dashboard" });
	};

	const appSignup = async () => {
		try {
			await loginWithPopup({
				authorizationParams: {
					screen_hint: "signup",
				},
			});
			const user = await getIdTokenClaims();
			alert("User created, welcome to Best Shot!");

			console.log(user);

			return api.post("whoami", {
				publicId: user?.sub,
				email: user?.email,
				firstName: user?.given_name,
				lastName: user?.family_name,
				nickName: user?.nickname ?? user?.given_name,
			});
		} catch (error) {
			return Promise.reject(error);
		}
	};

	const appLogout = async () => {
		logout({
			logoutParams: {
				returnTo: "http://localhost:5173/login",
			},
		});
		await api.delete("whoami");
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
