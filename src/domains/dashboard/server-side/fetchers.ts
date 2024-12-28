import { api } from "@/api";
import { IDashboard } from "@/domains/dashboard/typing";

// TODO Type "queryKey" correctly
export const getDashboard = async () => {
	const response = await api.get("dashboard");

	return response.data as IDashboard;
};
