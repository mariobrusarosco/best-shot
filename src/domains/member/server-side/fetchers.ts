import { api } from "@/api";

// TODO Type "queryKey" correctly
export const getMember = async ({ queryKey }: any) => {
	const [, authId] = queryKey;

	const response = await api.get("whoami/" + authId);

	return response.data;
};
