import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import Matchday from "@/domains/dashboard/components/matchday";
import { useDashboard } from "@/domains/dashboard/hooks/use-dashboard";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";

const DashboardPage = () => {
	const member = useMember();
	const dashboard = useDashboard();

	if (member.isPending || dashboard.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<Dashboard data-ui="dashboard-content-skeleton">
					<Matchday.Skeleton />
				</Dashboard>
			</AuthenticatedScreenLayout>
		);
	}

	if (member.isError || dashboard.isError) {
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

export { DashboardPage };
