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
	memberId: string;
	tournamentId: string;
	home: {
		score: string;
	};
	away: {
		score: string;
	};
};
