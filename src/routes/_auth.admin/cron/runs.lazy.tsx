import { createLazyFileRoute } from "@tanstack/react-router";
import CronRunsPage from "@/domains/admin/pages/cron-runs";

export const Route = createLazyFileRoute("/_auth/admin/cron/runs")({
	component: CronRunsPage,
});
