import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import { useMember } from "@/domains/member/hooks/use-member";
import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";

import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
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
					<TournamentsPerf.Skeleton />
					<MainLeague.Skeleton />
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (performance.isError || member.isError) {
		return (
			<ScreenLayout data-ui="dashboard-screen">
				<ScreenHeading title="Dashboard" subtitle="" />

				<ScreenMainContent>Error</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="dashboard-screen">
			<ScreenHeading title="Hello," subtitle={member?.data?.nickName} />

			<ScreenMainContent data-ui="dashboard-content">
				<TournamentsPerf.Component performance={performance} />
				{/* <MainLeague.Component performance={performance} /> */}
			</ScreenMainContent>
		</ScreenLayout>
	);
};

export { DashboardPage };
performance;
