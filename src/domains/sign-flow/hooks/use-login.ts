import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
	const navigate = useNavigate();
	console.log({ navigate });

	return {
		login: async () => {
			// console.log("START loginWithPopup");
			// await auth.login?.();
			// console.log("END loginWithPopup");
		},
	};
};
