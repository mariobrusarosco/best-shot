import MyAccountScreen from "@/domains/member/screens/my-account";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/my-account")({
	component: MyAccountScreen,
});
