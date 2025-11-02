import { createFileRoute, redirect } from "@tanstack/react-router";
import { AppLoader } from "@/domains/global/components/app-loader";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		throw redirect({ to: "/dashboard" });
	},
	component: () => <AppLoader />, // Show loader while redirecting
});
