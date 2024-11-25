import { IMatch } from "../match/typing";

export type ApiTournament = {
	id: string;
	label: string;
	seasonId: string;
	externalId: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};

export type ITournament = {
	id: ApiTournament["id"];
	description: ApiTournament["description"];
	label: ApiTournament["label"];
	matches: IMatch[];
	seasonId: ApiTournament["seasonId"];
	externalId: ApiTournament["externalId"];
};
