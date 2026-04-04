import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/api";
import { auth0TokenSchema, createMemberFromAuth0Schema } from "@/domains/authentication/schemas";
import { ErrorHandling } from "@/domains/error-handling";
import { useAuth0 } from "@auth0/auth0-react";

export const useProjectAuth = ({ auth0 }: { auth0: ReturnType<typeof useAuth0> }) => {
	const signMutation = useMutation<string, AxiosError, unknown>({
		mutationFn: async (user: unknown) => {
			// Validate and transform Auth0 token using Zod
			const tokenValidation = auth0TokenSchema.safeParse(user);

			if (!tokenValidation.success) {
				const errors = tokenValidation.error.format();
				const errorMessage = `Invalid Auth0 token data. Missing or invalid required fields`;

				ErrorHandling.logError({
					source: "DATABASE_AUTH_SIGN_VALIDATION",
					message: errorMessage,
					details: errors,
				});

				throw new Error(errorMessage);
			}

			// Transform Auth0 token to member creation format
			const memberData = createMemberFromAuth0Schema.parse(user);
			const response = await api.post("auth/create", memberData, {
				baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
			});

			return response.data as string;
		},
		onError: (error: AxiosError) => {
			ErrorHandling.logError({
				source: "DATABASE_AUTH_SIGN",
				message: error.message,
				code: error.code,
				details: error.response?.data,
			});
		},
	});

	const loginMutation = useMutation<string, AxiosError, unknown>({
		mutationFn: async (token: unknown) => {
			const response = await api.post(
				"auth",
				{ token },
				{
					baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
				}
			);

			return response.data as string;
		},
		onError: (error: AxiosError) => {
			ErrorHandling.logError({
				source: "DATABASE_AUTH",
				message: error.message,
				code: error.code,
				details: error.response?.data,
			});
		},
	});

	const logoutMutation = useMutation<string, AxiosError, unknown>({
		mutationFn: async () => {
			const response = await api.delete("auth");

			return response.data as string;
		},
		onError: (error: AxiosError) => {
			ErrorHandling.logError({
				source: "DATABASE_AUTH_LOGOUT",
				message: error.message,
				code: error.code,
				details: error.response?.data,
			});
		},
	});

	const handleLogin = async () => {
		try {
			await auth0.loginWithPopup({
				authorizationParams: {
					screen_hint: "login",
				},
			});
			const token = await auth0.getAccessTokenSilently();
			if (!token) throw new Error("User not found");
			debugger

			return await loginMutation.mutateAsync(token);
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};

	const handleSignup = async () => {
		try {
			await auth0.loginWithPopup({
				authorizationParams: { screen_hint: "signup" },
			});
			const user = await auth0.getIdTokenClaims();
			console.log("User from token", user);

			// Await the mutation to handle success/error properly
			const result = await signMutation.mutateAsync(user);

			// Show success message
			alert("Account created successfully!");

			return result;
		} catch (error) {
			alert(error instanceof Error ? error.message : String(error));
			return Promise.reject(error);
		}
	};

	const handleLogout = async () => {
		try {
			await auth0.logout({ logoutParams: { returnTo: window.location.origin } });
			await logoutMutation.mutateAsync(undefined);
		} catch (error) {
			alert(error);

			return Promise.reject(error);
		}
	};


	return {
		handleLogin,
		handleSignup,
		handleLogout,
	};
};
