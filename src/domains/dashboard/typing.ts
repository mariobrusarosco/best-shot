export interface IDashboard {
	matchday: IMatchday;
}

export interface IMatchday {
	all: {
		tournamentLabel: string;
		tournamentId: string;
		roundId: string;
		date: string;
		match: string;
	}[];
}
