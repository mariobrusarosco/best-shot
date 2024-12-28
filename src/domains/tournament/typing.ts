import { IMatch } from "../match/typing";

export type ApiTournament = {
	id: string;
	externalId: string;
	label: string;
	logo: string;
	matches: IMatch[];
	mode: string;
	provider: string;
	rounds: { label: string; slug: string }[];
	season: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
};

export type ITournament = {
	id: ApiTournament["id"];
	externalId: ApiTournament["externalId"];
	label: ApiTournament["label"];
	logo: ApiTournament["logo"];
	rounds: ApiTournament["rounds"];
	season: ApiTournament["season"];
	slug: ApiTournament["slug"];
	mode: ApiTournament["mode"];
	starterRound: string;
};

export type ITournamentPerformance = {
	details: Record<string, number>;
	lastUpdated: string;
	points: string;
};

export type ITournamentStandings = {
	lastUpdated: string;
	format: string;
	standings: {
		id: string;
		teamExternalId: string;
		tournamentId: string;
		groupName?: string;
		order: string;
		shortName: string;
		longName: string;
		points: string;
		games: string;
		wins: string;
		draws: string;
		losses: string;
		gf: string;
		ga: string;
		gd: string;
		provider: string;
	}[];
};
