import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext } from "react";
import type { IAuthHook } from "@/domains/authentication/adapters/typing";
import { useProjectAuth } from "@/domains/authentication/hooks/use-project-auth";
import { useMember } from "@/domains/member/hooks/use-member";


const AuthContext = createContext<any>(null);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	// Auth0 Data Authentication and Methods
	const auth0 = useAuth0();
	// Best Shot Data Authentication and Methods
	const projectAuth = useProjectAuth({ auth0 });
	// Best Shot Member
	const member = useMember({ fetchOnMount: auth0.isAuthenticated });

	const contextValue = {
		isAuthenticated: auth0.isAuthenticated,
		isLoadingAuth: auth0.isLoading,
		authId: auth0.user?.sub,
		signup: projectAuth.handleSignup,
		login: projectAuth.handleLogin,
		logout: projectAuth.handleLogout,
		member
	} satisfies IAuthHook;

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
};

const ProviderWithAuth0 = ({ children }: { children: React.ReactNode }) => {
	return (
		<Auth0Provider
			domain={import.meta.env.VITE_AUTH_DOMAIN}
			clientId={import.meta.env.VITE_AUTH_CLIENT_ID}
			authorizationParams={{
				redirect_uri: window.location.origin,
				audience: import.meta.env.VITE_AUTH0_AUDIENCE,
			}}
			useRefreshTokens={true}
			cacheLocation="localstorage"
			
		>
			<AuthProvider>{children}</AuthProvider>
		</Auth0Provider>
	);
};

const useAuthenticatedUser = () => {
	console.log("STARTING.... adpater auth hook...");

	const context = useContext(AuthContext);

	if (context === undefined) {
		throw new Error('useCount must be used within a CountProvider')
	}
	return context
};

export default { useAuthenticatedUser, AuthProvider: ProviderWithAuth0 };
