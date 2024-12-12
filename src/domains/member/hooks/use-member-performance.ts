import { useQuery } from "@tanstack/react-query";
import { getMemberPerformance } from "../server-side/fetchers";

export const useMemberPerformance = () => {
	const query = useQuery({
		queryKey: ["member", "performance"],
		queryFn: getMemberPerformance,
		enabled: true,
	});

	return query;
};
