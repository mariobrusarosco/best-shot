import { useQuery } from "@tanstack/react-query";
import { getMember } from "../server-side/fetchers";

export const useMember = () => {
	const query = useQuery({
		queryKey: memberKey(),
		queryFn: getMember,
		enabled: true,
	});

	return query;
};

const memberKey = () => ["member"];
