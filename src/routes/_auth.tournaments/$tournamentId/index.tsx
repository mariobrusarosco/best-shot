import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SingleTournamentScreen } from "@/domains/tournament/screens/single-tournament";

const tournamentSearchSchema = z.object({
	selectedRound: z.string().min(1).optional(),
});

export const Route = createFileRoute("/_auth/tournaments/$tournamentId/")({
	component: SingleTournamentScreen,
	validateSearch: tournamentSearchSchema,
});
