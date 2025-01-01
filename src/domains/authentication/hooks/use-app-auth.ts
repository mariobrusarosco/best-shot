import { AuthenticationAdapter } from "@/domains/authentication/adapters";
import { APP_MODE } from "@/domains/global/utils";

const useAuthAdapter = AuthenticationAdapter[APP_MODE].hook;

export const useAppAuth = () => {
	const auth = useAuthAdapter();

	console.log("useAuthAdapter [auth]", auth);
	return { auth };
};
