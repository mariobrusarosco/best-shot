import { api } from "@/api";
import type { IGuess } from "@/domains/guess/typing";
import type { CreateGuessInput } from "@/domains/league/typing";

export const createGuess = async (guessInput: CreateGuessInput) => {
	const response = await api.post("guess", guessInput);

	return response.data as IGuess;
};
