import type { z } from "zod";
import type { IMatch } from "@/domains/match/typing";
import type { TournamentStandingTeamSchema } from "./schemas";

export type TournamentSearch = {
	round?: string;
	simulate?: boolean;
};

export type TournamentRoundsSearch = TournamentSearch;

export interface SimulationMatchOverride {
	matchId: string;
	round: string;
	source: "official" | "generated";
	home: {
		id: string;
		shortName: string;
		name: string;
		badge: string;
		score: number;
	};
	away: {
		id: string;
		shortName: string;
		name: string;
		badge: string;
		score: number;
	};
	updatedAt: string;
}

export interface TournamentSimulationState {
	version: number;
	updatedAt: string | null;
	matchOverrides: Record<string, SimulationMatchOverride>;
}

export type SimulatedStanding = z.infer<typeof TournamentStandingTeamSchema>;

export interface SimulatedKnockoutRound {
	slug: string;
	label: string;
	matches: IMatch[];
}
