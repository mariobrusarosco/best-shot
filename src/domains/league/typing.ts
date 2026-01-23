import type { ITournament } from "@/domains/tournament/schemas";

export type ILeague = {
	id: string;
	label: string;
	description?: string;
	tournaments: ITournament[];
	permissions: {
		edit: boolean;
		invite: boolean;
		delete: boolean;
	};
	participants?: IParticipant[];
};

export type IParticipant = {
	nickName: string;
	role: string;
};

export type CreateLeagueInput = {
	label: string;
	description?: string;
};

export type CreateGuessInput = {
	matchId: string;
	tournamentId: string;
	home: {
		score: number;
	};
	away: {
		score: number;
	};
};
