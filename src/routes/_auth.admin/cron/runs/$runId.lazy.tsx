import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import CronRunDetailPage from "@/domains/admin/pages/cron-run-detail";

export const Route = createLazyFileRoute("/_auth/admin/cron/runs/$runId")({
	component: CronRunDetailRouteComponent,
});

function CronRunDetailRouteComponent() {
	const { runId } = Route.useParams();
	const navigate = useNavigate();

	return <CronRunDetailPage runId={runId} onBackToRuns={() => navigate({ to: "/admin/cron/runs" })} />;
}
