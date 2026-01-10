import { useEffect } from "react";
import { Monitoring } from "@/configuration/monitoring";
import { Authentication } from "@/domains/authentication";
import { useMember } from "@/domains/member/hooks/use-member";

const { useAppAuth } = Authentication;

/**
 * SentryUserIdentifier Component
 *
 * Automatically identifies users to Sentry when they log in
 * and clears user data when they log out.
 *
 * This links all errors and sessions to specific users, enabling:
 * - See which users are experiencing errors
 * - Contact affected users proactively
 * - Filter errors by user
 * - Track user-specific error patterns
 */
export function SentryUserIdentifier() {
	const { isAuthenticated } = useAppAuth();
	const member = useMember({ fetchOnMount: isAuthenticated });

	useEffect(() => {
		if (isAuthenticated && member.isSuccess && member.data) {
			// User is logged in and member data is loaded
			Monitoring.setUser({
				id: member.data.id,
				email: member.data.email,
				username: member.data.nickName,
				role: member.data.role,
			});

			// Set user role as a custom tag for filtering in Sentry dashboard
			// This allows you to query: "Show me all errors from admin users"
			if (member.data.role) {
				Monitoring.setTag("user.role", member.data.role);
			}
		} else if (!isAuthenticated) {
			// User logged out - clear Sentry user data
			Monitoring.setUser(null);
		}
	}, [isAuthenticated, member.isSuccess, member.data]);

	// This component doesn't render anything
	return null;
}
