import { createLazyFileRoute } from "@tanstack/react-router";
import MainAdminPage from "@/domains/admin/pages/main";

export const Route = createLazyFileRoute("/_auth/admin/_layout/")({
	component: MainAdminPage,
});
