import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useDatabaseAuth = () => {
	const sign = useMutation({
		mutationFn: async (user: any) => {
			const response = await api.post("auth/create", {
				publicId: user?.sub,
				email: user?.email,
				firstName: user?.given_name,
				lastName: user?.family_name,
				nickName: user?.nickname ?? user?.given_name,
			});

			return response.data as string;
		},
	});

	const login = useMutation({
		mutationFn: async (userId: any) => {
			const response = await api.post("auth", { publicId: userId });

			return response.data as string;
		},
	});

	return {
		sign,
		login,
	};
};
