import { api } from "@/api";
import {
	I_Member,
	I_MemberPerformance,
} from "@/domains/member/typing/types-and-interfaces";

export const getMember = async () => {
	const response = await api.get("member", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as I_Member;
};

export const getMemberPerformance = async () => {
	const response = await api.get("member/performance", {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});

	return response.data as I_MemberPerformance;
};
