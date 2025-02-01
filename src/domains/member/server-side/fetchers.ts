import { api } from "@/api";
import { IMember, IMemberPerformance } from "@/domains/member/typing";

export const getMember = async () => {
	const response = await api.get("member", {
		baseURL: process.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as IMember;
};

export const getMemberPerformance = async () => {
	const response = await api.get("member/performance", {
		baseURL: process.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as IMemberPerformance;
};
