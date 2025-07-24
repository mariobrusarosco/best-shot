import { createFileRoute } from "@tanstack/react-router";
import MyAccountScreen from "@/domains/member/screens/my-accounts";

export const Route = createFileRoute("/_auth/my-account")({
	component: MyAccountScreen,
});
