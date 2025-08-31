import { createFileRoute } from "@tanstack/react-router";
import ReportsPage from "@/domains/admin/pages/report";

export const Route = createFileRoute("/_auth/admin/_layout/reports")({
	component: ReportsPage,
});
