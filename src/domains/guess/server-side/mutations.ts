import { api } from "@/api";
import { CreateGuessInput } from "@/domains/league/typing";
import { IGuess } from "../typing";

export const createGuess = async (guessInput: CreateGuessInput) => {
	const response = await api.post("guess", guessInput);

	return response.data as IGuess;
};
