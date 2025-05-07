import { api } from "@/api";

export const getMatchPrediction = async (matchId: string) => {
	const response = await api.get(`ai/predict/match/${matchId}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};
