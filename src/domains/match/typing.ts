export type IMatchResponse = {
	id: string;
	date: string;
	round: string;
	tournamentId: string;
	home: {
		id: string;
		score: string | null;
		shortName: string;
		badge: string;
		name: string;
	};
	away: {
		id: string;
		score: string | null;
		shortName: string;
		badge: string;
		name: string;
	};
	status: "ended" | "open";
};

export type IMatch = {
	id: IMatchResponse["id"];
	date: IMatchResponse["date"];
	round: IMatchResponse["round"];
	tournamentId: IMatchResponse["tournamentId"];
	status: IMatchResponse["status"];
	home: {
		score: number | null;
		id: IMatchResponse["home"]["id"];
		shortName: IMatchResponse["home"]["shortName"];
		badge: IMatchResponse["home"]["badge"];
		name: IMatchResponse["home"]["name"];
	};
	away: {
		score: number | null;
		id: IMatchResponse["home"]["id"];
		shortName: IMatchResponse["home"]["shortName"];
		badge: IMatchResponse["home"]["badge"];
		name: IMatchResponse["home"]["name"];
	};
	timebox: string;
};
