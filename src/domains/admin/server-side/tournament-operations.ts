import { api } from "@/api";

export interface ICreateTournamentInput {
	tournamentPublicId: string;
	baseUrl: string;
	label: string;
	slug: string;
	provider: string;
	season: string;
	mode: string;
	logoUrl: string;
	standingsMode: string;
}

// Keep the admin-specific tournament creation functionality
export const createTournament = async (data: ICreateTournamentInput) => {
	const response = await api.post("/admin/tournaments", data, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const updateTournament = async (id: string, data: Partial<ICreateTournamentInput>) => {
	const response = await api.patch(`/admin/tournaments/${id}`, data, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const deleteTournament = async (id: string) => {
	const response = await api.delete(`/admin/tournaments/${id}`, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};
