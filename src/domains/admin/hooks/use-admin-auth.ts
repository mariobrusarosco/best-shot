import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Authentication } from "@/domains/authentication";
import { useMember } from "@/domains/member/hooks/use-member";

export const useAdminAuth = () => {
	const auth = Authentication.useAppAuth();
	const navigate = useNavigate();
	const { data: member, isLoading: isMemberLoading } = useMember({
		fetchOnMount: auth.isAuthenticated,
	});

	const isAdmin = member?.role === "admin";
	const isLoading = auth.isLoadingAuth || isMemberLoading;

	useEffect(() => {
		// Redirect non-admin users after authentication and member data are loaded
		if (!isLoading && auth.isAuthenticated && !isAdmin) {
			navigate({ to: "/dashboard" });
		}
	}, [isLoading, auth.isAuthenticated, isAdmin, navigate]);

	return {
		isAdmin,
		isLoading,
		isAuthenticated: auth.isAuthenticated,
		member,
	};
};
