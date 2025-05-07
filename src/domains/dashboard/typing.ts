export interface IDashboard {
	matchday: IMatchday;
}

export interface IMatchday {
	all: {
		tournamentLabel: string;
		tournamentId: string;
		roundSlug: string;
		date: string;
		match: string;
	}[];
}
