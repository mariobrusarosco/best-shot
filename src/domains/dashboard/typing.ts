export interface IDashboard {
	matchday: IMatchday;
}

export interface IMatchday {
	all: {
		tournamentLabel: string;
		roundId: string;
	}[];
}
