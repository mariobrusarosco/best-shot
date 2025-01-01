import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";

import Matchday from "@/domains/dashboard/components/matchday";
import { useDashboard } from "@/domains/dashboard/hooks/use-dashboard";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { styled } from "@mui/system";
import TournamentsPerf from "../components/tournaments-perf";

const DashboardPage = () => {
	const member = useMember();
	const performance = useMemberPerformance();
	const dashboard = useDashboard();

	if (member.isPending || performance.isPending || dashboard.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<ScreenMainContent data-ui="dashboard-content">
					<Matchday.Skeleton />
					<TournamentsPerf.Skeleton />
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (performance.isError || member.isError || dashboard.isError) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="Dashboard" subtitle="" />

				<ScreenMainContent>Error</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle={member?.data?.nickName} />

			<Dashboard data-ui="dashboard-content">
				<Matchday.Component matchday={dashboard.data.matchday} />
				<TournamentsPerf.Component performance={performance} />
			</Dashboard>
		</AuthenticatedScreenLayout>
	);
};

export const Dashboard = styled(ScreenMainContent)(({ theme }) => ({
	flexDirection: "column",
	gap: theme.spacing(4),
}));

export { DashboardPage };
performance;
