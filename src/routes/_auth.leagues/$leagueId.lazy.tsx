import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeagueHeading } from "@/domains/league/components/league-heading/league-heading";
import { LeaguePerformanceStats } from "@/domains/league/components/league-performance-stats/league-performance-stats";
import { ParticipantsList } from "@/domains/league/components/participants/participants-list";
import { ParticipantsListSkeleton } from "@/domains/league/components/participants/participants-list-skeleton";
import { useLeague } from "@/domains/league/hooks/use-league";
import { Box, styled } from "@mui/system";
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
			<MainContainer data-ui="leagues-screen-loading">
				<ScreenHeading withBackButton>...loading...</ScreenHeading>
			</MainContainer>
		);
	}

	if (league.isError) {
		return (
			<MainContainer data-ui="leagues-screen-error">
				<ScreenHeading withBackButton>...error...</ScreenHeading>
			</MainContainer>
		);
	}

	return (
		<MainContainer data-ui="leagues-screen screen">
			<ScreenHeading withBackButton>
				<LeagueHeading league={league} />
			</ScreenHeading>

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
		</MainContainer>
	);
};

const MainContainer = styled(Box)(({ theme }) => theme.unstable_sx({}));

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId")({
	component: LeaguePage,
});
