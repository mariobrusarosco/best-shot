import { api } from "../../api";
import { CreateGuessInput } from "../league/typing";

export const createGuess = async (guessInput: CreateGuessInput) => {
	const response = await api.post("guess", guessInput);

	return response.data;
};
