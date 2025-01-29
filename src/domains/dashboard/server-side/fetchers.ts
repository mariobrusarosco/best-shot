import { api } from "@/api";
import { IDashboard } from "@/domains/dashboard/typing";

// TODO Type "queryKey" correctly
export const getDashboard = async () => {
	const response = await api.get("/dashboard", {
		baseURL: "http://localhost:9090/api/v2"
	});

	return response.data as IDashboard;
};
