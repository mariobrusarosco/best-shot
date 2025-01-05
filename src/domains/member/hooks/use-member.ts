import { useQuery } from "@tanstack/react-query";
import { getMember } from "../server-side/fetchers";

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

const memberKey = () => ["member"];
