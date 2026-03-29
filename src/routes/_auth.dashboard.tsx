import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "@/domains/dashboard/screens";

export const Route = createFileRoute("/_auth/dashboard")({
	component: DashboardScreen,
});
