import { IMatch } from "../match/typing";

export type ApiTournament = {
	id: string;
	label: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	seasonId: string;
	externalId: string;
};

export type ITournament = {
	id: ApiTournament["id"];
	description: ApiTournament["description"];
	label: ApiTournament["label"];
	matches: IMatch[];
	logo: string;
	seasonId: ApiTournament["seasonId"];
	externalId: ApiTournament["externalId"];
};
};
