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
	const { isAuthenticated, isLoading, user } = useAuthBase();

	return {
		isAuthenticated,
		isLoadingAuth: isLoading,
		authId: user?.sub,
	} satisfies IAuthHook;
};
