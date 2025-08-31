import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/domains/admin/layout";

export const Route = createFileRoute("/_auth/admin/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminLayout />;
}
