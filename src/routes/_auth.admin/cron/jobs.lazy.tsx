import { createLazyFileRoute } from "@tanstack/react-router";
import CronJobsPage from "@/domains/admin/pages/cron-jobs";

export const Route = createLazyFileRoute("/_auth/admin/cron/jobs")({
	component: CronJobsPage,
});
