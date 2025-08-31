import { createFileRoute } from "@tanstack/react-router";
import SchedulerJobsPage from "@/domains/admin/pages/scheduler-jobs";

export const Route = createFileRoute("/_auth/admin/_layout/scheduler-jobs")({
	component: SchedulerJobsPage,
});
