import { useMutation } from "@tanstack/react-query";
import { createGuess } from "../../demo/mutations";

export const useGuessMutation = () => {
	const mutation = useMutation({
		mutationFn: createGuess,
		onSuccess: () => {
			console.log("Guess created successfully");
		},
	});

	return mutation;
};
