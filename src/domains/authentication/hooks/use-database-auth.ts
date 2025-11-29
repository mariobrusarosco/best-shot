import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/api";
import { ErrorHandling } from "@/domains/error-handling";
import { auth0TokenSchema, createMemberFromAuth0Schema } from "../schemas";

export const useDatabaseAuth = () => {
	const sign = useMutation<string, AxiosError, unknown>({
		mutationFn: async (user: unknown) => {
			// Validate and transform Auth0 token using Zod
			const tokenValidation = auth0TokenSchema.safeParse(user);

			if (!tokenValidation.success) {
				const errors = tokenValidation.error.format();
				const errorMessage = `Invalid Auth0 token data. Missing or invalid required fields`
			
				
				ErrorHandling.logError({
					source: "DATABASE_AUTH_SIGN_VALIDATION",
					message: errorMessage,
					details: errors,
				});
				
				throw new Error(errorMessage);
			}

			// Transform Auth0 token to member creation format
			const memberData = createMemberFromAuth0Schema.parse(user);
			const response = await api.post(
				"auth/create",
				memberData,
				{
					baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
				}
			);

			return response.data as string;
		},
		onError: (error: AxiosError) => {
			ErrorHandling.logError({
				source: 'DATABASE_AUTH_SIGN',
				message: error.message,
				code: error.code,
				details: error.response?.data,
			});
		},
	});

	const login = useMutation<string, AxiosError, unknown>({
		mutationFn: async (userId: unknown) => {
			const response = await api.post(
				"auth",
				{ publicId: userId },
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

	return {
		sign,
		login,
	};
};
