import { api } from "../../api";
import {
	globoEsporteRound,
	responseGloboEsporteRound,
	responseTournament,
} from "./typing";

export const getTournament = async ({ queryKey }) => {
	const [_key, { id, activeRound }] = queryKey;

	const response = await api.get(`tournament/${id}?round=${activeRound}`);

	return response.data as globoEsporteRound;
};

export const getTournaments = async () => {
	const response = await api.get("tournament");

	return response.data as responseTournament[];
};
