import { AuthenticationAdapter } from "../utils";

const mode = import.meta.env.MODE as
	| "demo"
	| "localhost"
	| "staging"
	| "production";

const useAUth = AuthenticationAdapter[mode].hook;

export const useAppAuth = () => {
	const auth = useAUth();

	return { auth };
};
