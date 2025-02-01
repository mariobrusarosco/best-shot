import { api } from "@/api";
import { IDashboard } from "../typing";

// TODO Type "queryKey" correctly
export const getDashboard = async () => {
	const response = await api.get("/dashboard", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as IDashboard;
};
