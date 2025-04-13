import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorHandling } from "@/domains/error-handling";

export const useDatabaseAuth = () => {
	const sign = useMutation<string, AxiosError, any>({
		mutationFn: async (user: any) => {
			const response = await api.post("auth/create", {
				publicId: user?.sub,
				email: user?.email,
				firstName: user?.given_name,
				lastName: user?.family_name,
				nickName: user?.nickname ?? user?.given_name,
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

	const login = useMutation<string, AxiosError, any>({
		mutationFn: async (userId: any) => {
			const response = await api.post("auth", { publicId: userId }, {
				baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
			});

			return response.data as string;
		},
		onError: (error: AxiosError) => {
			ErrorHandling.logError({
				source: 'DATABASE_AUTH',
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
