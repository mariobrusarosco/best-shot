import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeagueHeading } from "@/domains/league/components/league-heading/league-heading";
import { LeaguePerformance } from "@/domains/league/components/league-performance/league-performance";
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
	const { league, mutation } = useLeague();

	console.log("league", league);

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
					<div data-ui="participants">
						<ParticipantsListSkeleton />
					</div>
				) : (
					<div data-ui="participants">
						<ParticipantsList league={league} />
						<LeaguePerformance league={league} mutation={mutation} />
					</div>
				)}

				{/* {Object.entries(league.participants).map(([member, points]) => (
					<Box key={member}>
						<Card>
							<Typography variant="h6">{member}</Typography>
						</Card>

						{points?.map((point) => (
							<Box
								sx={{
									color: "neutral.100",
									display: "flex",
									gap: 2,
									flexWrap: "wrap",
								}}
							>
								<Card key={point} sx={{ display: "flex", gap: 2 }}>
									<Typography variant="topic">home</Typography>
									<Typography variant="topic">{point.home}</Typography>
								</Card>
								<Card key={point} sx={{ display: "flex", gap: 2 }}>
									<Typography variant="topic">away</Typography>
									<Typography variant="topic">{point.away}</Typography>
								</Card>
								<Card key={point} sx={{ display: "flex", gap: 2 }}>
									<Typography variant="topic">outcome</Typography>
									<Typography variant="topic">{point.outcome}</Typography>
								</Card>
							</Box>
						))}
					</Box>
				))} */}
			</Box>
		</MainContainer>
	);
};

const MainContainer = styled(Box)(({ theme }) => theme.unstable_sx({}));

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId")({
	component: LeaguePage,
});
