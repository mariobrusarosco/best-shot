import { APP_MODE } from "@/domains/global/utils";
import { AuthenticationAdapter } from "@/domains/authentication/adapters";

const useAUth = AuthenticationAdapter[APP_MODE].hook;

export const useAppAuth = () => {
	const auth = useAUth();

	return { auth };
};
