import { Box, styled, Typography } from "@mui/material";
import { Matchday, MatchdaySkeleton } from "@/domains/dashboard/components/matchday";
import { useDashboard } from "@/domains/dashboard/hooks/use-dashboard";
import { ScreenHeading, ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";

export const DashboardScreen = () => {
	const member = useMember();
	const dashboard = useDashboard();

	if (member.isPending || dashboard.isPending) {
		return (
			<AuthenticatedScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<Dashboard data-ui="dashboard-content-skeleton">
					<MatchdaySkeleton />
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
			<DashboardDisplay>
				<Introduction>
					<Typography
						data-ui="title"
						textTransform="lowercase"
						variant="body1"
						color="black.400"
						fontWeight="bold"
					>
						Hello,
					</Typography>

					<Typography data-ui="title" variant="h2" color="black.400" letterSpacing="2px" sx={{}}>
						{member?.data?.nickName}
					</Typography>
				</Introduction>
			</DashboardDisplay>

			<Dashboard data-ui="dashboard-content">
				<Matchday matchday={dashboard.data.matchday} />
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

const DashboardDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	height: "fit-content",
	width: "fit-content",
	gap: theme.spacing(0.5),
	padding: theme.spacing(2),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.borderRadius.medium,
	alignItems: "center",
	flexWrap: "wrap",
}));

const Introduction = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
}));
