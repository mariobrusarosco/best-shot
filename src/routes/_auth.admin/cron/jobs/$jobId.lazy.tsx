import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import CronJobDetailPage from "@/domains/admin/pages/cron-job-detail";

export const Route = createLazyFileRoute("/_auth/admin/cron/jobs/$jobId")({
	component: CronJobDetailRouteComponent,
});

function CronJobDetailRouteComponent() {
	const { jobId } = Route.useParams();
	const navigate = useNavigate();

	return (
		<CronJobDetailPage jobId={jobId} onBackToList={() => navigate({ to: "/admin/cron/jobs" })} />
	);
}
