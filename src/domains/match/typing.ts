export type IMatch = {
	id: string;
	date: string;
	round: string;
	status: string;
	tournamentId: string;
	home: ITeam;
	away: ITeam;
};

export type ITeam = {
	id: string;
	score: string;
	shortName: string;
	badge: string;
	name: string;
};
