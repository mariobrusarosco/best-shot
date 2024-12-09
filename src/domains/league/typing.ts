export type ILeague = {
	id: string;
	label: string;
	description?: string;
	participants: IParticipant[];
	performance: ILeaguePerformance;
};

export type ILeaguePerformance = {
	lastUpdatedAt: string;
	performances: {
		name: string;
		points: number;
	}[];
};

export type ILeagueWithParticipants = ILeague & {
	participants: IParticipant[];
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
	id: string;
	matchId: string;
	tournamentId: string;
	home: {
		score: number;
	};
	away: {
		score: number;
	};
};
