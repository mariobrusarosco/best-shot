import { AuthenticationAdapter } from "@/domains/authentication/adapters";
import { APP_MODE } from "@/domains/global/utils";
import { useMember } from "@/domains/member/hooks/use-member";

export const useAuth = AuthenticationAdapter[APP_MODE].hook;

export const useAppAuth = () => {
	const auth = useAuth();
	console.log("[AUTH]", { auth });
	const member = useMember(auth.authId);

	const memberIsReady = member.isSuccess && member?.data;
	const loadingMemberData = member.isFetching;
	const authError = member.isError || !auth?.isAuthenticated;

	return { memberIsReady, loadingMemberData, authError, member };
};
