import type { ITournament } from "../tournament/schemas";

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
	leaderBoard: {
		memberName: string;
		points: string;
		lastUpdated: string;
	}[];
	standings: Record<
		string,
		{
			id: string;
			logo: string;
			members: {
				member: string;
				points: string;
			}[];
		}
	>;
	lastUpdated: string;
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
