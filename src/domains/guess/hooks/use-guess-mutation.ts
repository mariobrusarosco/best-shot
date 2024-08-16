import { useMutation } from "@tanstack/react-query";
import { createGuess } from "../../demo/mutations";

export const useGuessMutation = () => {
	const mutate = useMutation({
		mutationFn: createGuess,
		onSuccess: () => {
			alert("Guess created successfully");
		},
	});

	return mutate;
};
