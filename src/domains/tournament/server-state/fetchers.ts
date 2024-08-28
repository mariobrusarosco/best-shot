import { api } from "../../../api";
import { ITournament } from "../typing";

export const getTournament = async ({ queryKey }: { queryKey: any }) => {
	const [_key, { id, activeRound }] = queryKey;

	const response = await api.get(`tournaments/${id}?round=${activeRound}`);

	return response.data as ITournament;
};

export const getTournaments = async () => {
	const response = await api.get("tournaments");

	return response.data;
};
