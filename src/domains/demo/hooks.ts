import { useQuery } from "@tanstack/react-query";
import { getMembers } from "./fetchers";
import { getUserToken } from "./utils";

export const useMembers = () => {
	const fakeAuth = getUserToken();

	const members = useQuery({
		queryKey: ["members", { memberId: fakeAuth }],
		queryFn: getMembers,
		enabled: !!fakeAuth,
	});

	return members;
};
