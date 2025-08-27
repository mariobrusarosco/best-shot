import { AdminLayout } from "@/domains/admin/layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/admin/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminLayout />;
}
