import { useQuery } from "@tanstack/react-query";
import { getMember } from "@/domains/member/api/fetchers";
import { memberKey } from "@/domains/member/api/key";

export const useMember = ({
	fetchOnMount = false,
}: { fetchOnMount?: boolean } = {}) => {
	const query = useQuery({
		queryKey: memberKey(),
		queryFn: getMember,
		enabled: fetchOnMount,
	});

	return query;
};
