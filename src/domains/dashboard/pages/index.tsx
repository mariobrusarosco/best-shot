import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";

import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/theming/theme";
import { styled } from "@mui/material";
import { Box } from "@mui/system";
import MainLeague from "../components/main-league";
import TournamentsPerf from "../components/tournaments-perf";

const DashboardPage = () => {
	const member = useMember();
	const performance = useMemberPerformance();

	if (performance.isPending || performance.isPending) {
		return (
			<ScreenLayout data-ui="dashboard-screen">
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<Dashboard>
						<TournamentsPerf.Skeleton />
						<MainLeague.Skeleton />
					</Dashboard>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (performance.isError || member.isError) {
		return (
			<ScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="Dashboard" subtitle="" />

				<ScreenMainContent>
					<Dashboard>Error</Dashboard>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle={member?.data?.nickName} />

			<ScreenMainContent>
				<Dashboard>
					<TournamentsPerf.Component performance={performance} />
					{/* <MainLeague.Component performance={performance} /> */}
				</Dashboard>
			</ScreenMainContent>
		</ScreenLayout>
	);
};

const Dashboard = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",

		[UIHelper.whileIs("mobile")]: {
			pt: 6,
			flexDirection: "column",
			rowGap: 6,
		},
		[UIHelper.startsOn("tablet")]: {
			columnGap: 4,
		},
	}),
);

export { DashboardPage };
performance;
