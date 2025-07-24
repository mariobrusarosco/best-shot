import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/domains/dashboard/pages";

export const Route = createFileRoute("/_auth/dashboard")({
	component: DashboardPage,
});
