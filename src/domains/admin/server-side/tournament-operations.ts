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

// Tournament management operations
export const createStandings = async (tournamentId: string) => {
	const response = await api.post(`/admin/tournaments/${tournamentId}/standings`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const updateStandings = async (tournamentId: string) => {
	const response = await api.patch(`/admin/tournaments/${tournamentId}/standings`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const createRounds = async (tournamentId: string) => {
	const response = await api.post(`/admin/tournaments/${tournamentId}/rounds`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const updateRounds = async (tournamentId: string) => {
	const response = await api.patch(`/admin/tournaments/${tournamentId}/rounds`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const createTeams = async (tournamentId: string) => {
	const response = await api.post(`/admin/tournaments/${tournamentId}/teams`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const updateTeams = async (tournamentId: string) => {
	const response = await api.patch(`/admin/tournaments/${tournamentId}/teams`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const createMatches = async (tournamentId: string) => {
	const response = await api.post(`/admin/tournaments/${tournamentId}/matches`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};

export const updateMatches = async (tournamentId: string) => {
	const response = await api.patch(`/admin/tournaments/${tournamentId}/matches`, {}, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data;
};
