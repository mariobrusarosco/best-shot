import { APP_MODE } from "@/domains/global/utils";
import { AuthenticationAdapter } from "@/domains/authentication/adapters";

export const AuthProvider = AuthenticationAdapter[APP_MODE].Provider;
