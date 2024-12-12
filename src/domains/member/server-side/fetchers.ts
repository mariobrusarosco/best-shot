import { api } from "@/api";
import { IMember, IMemberPerformance } from "@/domains/member/typing";

// TODO Type "queryKey" correctly
export const getMember = async () => {
	const response = await api.get("member");

	return response.data as IMember;
};

// TODO Type "queryKey" correctly
export const getMemberPerformance = async () => {
	const response = await api.get("member/performance");

	return response.data as IMemberPerformance;
};
