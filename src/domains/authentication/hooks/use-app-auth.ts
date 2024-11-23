import { AuthenticationAdapter } from "@/domains/authentication/adapters";
import { APP_MODE } from "@/domains/global/utils";

const useAUth = AuthenticationAdapter[APP_MODE].hook;

export const useAppAuth = () => {
	const auth = useAUth();

	return { auth };
};
