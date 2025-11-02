import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Matchday from "@/domains/dashboard/components/matchday";
import { useDashboard } from "@/domains/dashboard/hooks/use-dashboard";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import TournamentsPerf from "../components/tournaments-perf";

const DashboardPage = () => {
	const member = useMember();
	const performance = useMemberPerformance();
	const dashboard = useDashboard();

	if (member.isPending || performance.isPending || dashboard.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<Dashboard data-ui="dashboard-content-skeleton">
					<Matchday.Skeleton />
					<TournamentsPerf.Skeleton />
				</Dashboard>
			</AuthenticatedScreenLayout>
		);
	}

	if (member.isError || performance.isError || dashboard.isError) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="Dashboard" subtitle="" />

				<ScreenMainContent>
					<Typography variant="h6" color="error">
						Error
					</Typography>
				</ScreenMainContent>
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
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		gap: theme.spacing(4),
	},
}));

const DatePickerSection = styled(Box)(({ theme }) => ({
	padding: theme.spacing(2),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	border: `1px solid ${theme.palette.divider}`,
}));

const DatePickerGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: theme.spacing(2),

	[UIHelper.startsOn("tablet")]: {
		gridTemplateColumns: "repeat(3, 1fr)",
	},
}));

export { DashboardPage };
performance;
