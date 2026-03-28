export type ILeague = {
	id: string;
	label: string;
	description?: string;
	tournaments: {
		id: string;
		logo: string;
		label: string;
		status: string;
	}[];
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
