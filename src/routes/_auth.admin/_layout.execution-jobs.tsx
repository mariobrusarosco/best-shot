import { createFileRoute } from "@tanstack/react-router";
import ExecutionJobsPage from "@/domains/admin/pages/execution-jobs";

export const Route = createFileRoute("/_auth/admin/_layout/execution-jobs")({
	component: ExecutionJobsPage,
});
