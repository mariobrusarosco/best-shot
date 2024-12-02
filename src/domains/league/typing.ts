export type ILeague = {
	id: string;
	label: string;
	description: string;
};

export type CreateLeagueInput = {
	label: string;
	description?: string;
};

export type CreateGuessInput = {
	matchId: string;
	// round: string;
	tournamentId: string;
	home: {
		score: number;
	};
	away: {
		score: number;
	};
};
