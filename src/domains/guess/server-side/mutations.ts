import { api } from "@/api";
import type { CreateGuessInput } from "@/domains/league/typing";
import type { IGuess } from "../typing";

export const createGuess = async (guessInput: CreateGuessInput) => {
	const response = await api.post("guess", guessInput);

	return response.data as IGuess;
};
