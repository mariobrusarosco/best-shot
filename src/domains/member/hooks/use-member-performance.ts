import { useQuery } from "@tanstack/react-query";
import { getMemberPerformance } from "@/domains/member/api/fetchers";
import { memberPerformanceKey } from "@/domains/member/api/key";

export const useMemberPerformance = () => {
	const query = useQuery({
		queryKey: memberPerformanceKey(),
		queryFn: getMemberPerformance,
		enabled: true,
	});

	return query;
};
