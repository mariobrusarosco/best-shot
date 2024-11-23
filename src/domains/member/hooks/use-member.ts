import { useQuery } from "@tanstack/react-query";
import { getMember } from "../server-side/fetchers";

export const useMember = (authId?: string | undefined) => {
	const query = useQuery({
		queryKey: ["member"],
		queryFn: getMember,
		enabled: !!authId,
	});

	return { ...query };
};
