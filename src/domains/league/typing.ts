import { ITournament } from "../tournament/typing";

export type ILeague = {
	id: string;
	label: string;
	description?: string;
	tournaments: ITournament[];
	permissions: {
		edit: boolean;
		invite: boolean;
		delete: boolean;
	};
	performance: ILeaguePerformance;
	participants?: IParticipant[];
};

export type ILeaguePerformance = {
	id: string;
	logo: string;
	members: {
		member: string;
		points: string;
	}[];
}[];

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
