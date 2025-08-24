import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/api";
import { ErrorHandling } from "@/domains/error-handling";

export const useDatabaseAuth = () => {
	const sign = useMutation<string, AxiosError, unknown>({
		mutationFn: async (user: unknown) => {
			const userData = user as Record<string, unknown>;
			const response = await api.post(
				"auth/create",
				{
					publicId: userData?.sub as string,
					email: userData?.email as string,
					firstName: userData?.given_name as string,
					lastName: userData?.family_name as string,
					nickName: (userData?.nickname as string) ?? (userData?.given_name as string),
				},
				{
					baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
				}
			);

			return response.data as string;
		},
		// onError: (error: AxiosError) => {
		// 	ErrorHandling.logError({
		// 		source: 'DATABASE_AUTH',
		// 		message: error.message,
		// 		code: error.code,
		// 		details: error.response?.data,
		// 	});
		// },
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
