import { DashboardPage } from "@/domains/dashboard/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
	component: DashboardPage,
});
