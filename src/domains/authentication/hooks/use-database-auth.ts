import { api } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDatabaseAuth = (userId?: string) => {
	const queryClient = useQueryClient();

	const query = useQuery({
		queryKey: ["auth", { userId }],
		queryFn: getDatabaseAuth,
		enabled: !!userId,
	});

	const mutation = useMutation({
		mutationFn: authenticateOnDatabase,
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["auth", { userId }] }),
	});

	return { ...query, mutation };
};

const authenticateOnDatabase = async (user: any) => {
	const response = await api.post("whoami", {
		publicId: user?.sub,
		email: user?.email,
		firstName: user?.given_name,
		lastName: user?.family_name,
		nickName: user?.nickname ?? user?.given_name,
	});

	return response.data as string;
};

export const getDatabaseAuth = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { userId }] = queryKey;

	const response = await api.get("whoami", {
		params: { publicId: userId },
	});

	return response.data as string;
};
