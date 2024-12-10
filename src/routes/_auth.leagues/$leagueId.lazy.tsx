import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeaguePerformanceStats } from "@/domains/league/components/league-performance-stats/league-performance-stats";
import { ParticipantsList } from "@/domains/league/components/participants/participants-list";
import { ParticipantsListSkeleton } from "@/domains/league/components/participants/participants-list-skeleton";
import { useLeague } from "@/domains/league/hooks/use-league";
import { ScreenLayout } from "@/domains/ui-system/layout/screen-layout";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

// const detailedRanking = (scoreboard: any) => {
// 	Object.entries(scoreboard).forEach(([member, points]) => {
// 		console.log(member, points);
// 	});
// };

const LeaguePage = () => {
	const { league, mutation, performance } = useLeague();

	console.log("league", league, performance);

	if (league.isLoading) {
		return (
			<ScreenLayout data-ui="leagues-screen-loading">
				<ScreenHeading withBackButton>...loading...</ScreenHeading>
			</ScreenLayout>
		);
	}

	if (league.isError) {
		return (
			<ScreenLayout data-ui="leagues-screen-error">
				<ScreenHeading withBackButton>...error...</ScreenHeading>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="leagues-screen screen">
			<ScreenHeading
				withBackButton
				title="league"
				subtitle={league.data?.label}
			/>
			{/* <LeagueHeading league={league} /> */}

			<Box pt={[6, 10]} pb={14} px={[2, 6]}>
				{league.isLoading ? (
					<Box data-ui="participants-loading">
						<ParticipantsListSkeleton />
					</Box>
				) : (
					<Box data-ui="participants" sx={{ display: "grid", gap: 6 }}>
						<LeaguePerformanceStats
							performance={performance}
							mutation={mutation}
						/>
						<ParticipantsList league={league} />
					</Box>
				)}
			</Box>
		</ScreenLayout>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId")({
	component: LeaguePage,
});
