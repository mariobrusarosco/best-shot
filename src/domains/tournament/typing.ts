import { IMatch } from "../match/typing";

export type ApiTournament = {
	id: string;
	label: string;
	description: string;
	createdAt: string;
	updatedAt: string;
};

export type ITournament = {
	id: ApiTournament["id"];
	description: ApiTournament["description"];
	label: ApiTournament["label"];
	matches: IMatch[];
};
