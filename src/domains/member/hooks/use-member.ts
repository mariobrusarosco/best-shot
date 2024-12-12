import { useQuery } from "@tanstack/react-query";
import { getMember } from "../server-side/fetchers";

export const useMember = () => {
	const query = useQuery({
		queryKey: ["member"],
		queryFn: getMember,
		enabled: true,
	});

	return query;
};
