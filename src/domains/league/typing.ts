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
	homeScore: string;
	awayScore: string;
};
