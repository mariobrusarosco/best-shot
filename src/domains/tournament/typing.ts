import { IMatch } from "../match/typing";

export type ApiTournament = {
	id: string;
	externalId: string;
	label: string;
	logo: string;
	matches: IMatch[];
	mode: string;
	provider: string;
	rounds: string;
	season: string;
	slug: string;
	createdAt: string;
	updatedAt: string;
};

export type ITournament = {
	id: ApiTournament["id"];
	externalId: ApiTournament["externalId"];
	label: ApiTournament["label"];
	logo: ApiTournament["logo"];
	matches: IMatch[];
	rounds: ApiTournament["rounds"];
	season: ApiTournament["season"];
	slug: ApiTournament["slug"];
	mode: ApiTournament["mode"];
};
