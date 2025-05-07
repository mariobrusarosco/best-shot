import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../server-side/fetchers";

export const useDashboard = () => {
	const query = useQuery({
		queryKey: dashboardKey(),
		queryFn: getDashboard,
		enabled: true,
	});

	return query;
};

export const dashboardKey = () => ["dashboard"];
