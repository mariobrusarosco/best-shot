import type { z } from "zod";
import { api } from "@/api";
import { CreateTournamentSchema } from "@/domains/admin/schemas";
import type { ITournament } from "@/domains/tournament/schemas";

export const createAdminTournament = async (
	data: z.infer<typeof CreateTournamentSchema>
): Promise<ITournament> => {
	const validatedData = CreateTournamentSchema.parse(data);

	// Construct base URL for SofaScore
	// Pattern: https://api.sofascore.com/api/v1/unique-tournament/{uniqueTournamentId}/season/{seasonId}
	const baseUrl = `https://api.sofascore.com/api/v1/unique-tournament/${validatedData.tournamentPublicId}/season/${validatedData.seasonId}`;

	const payload = {
		...validatedData,
		baseUrl,
	};

	const response = await api.post("/admin/tournaments", payload, {
		baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
	});
	return response.data as ITournament;
};

// Reset user activity
export const resetUserActivity = async (): Promise<{
	success: boolean;
	message: string;
}> => {
	const response = await api.post(
		"/admin/reset-user-activity",
		{},
		{
			baseURL: import.meta.env.VITE_BEST_SHOT_API_V2,
		}
	);
	return response.data;
};
