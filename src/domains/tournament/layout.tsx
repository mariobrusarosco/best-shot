import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { TournamentHeading } from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Outlet } from "@tanstack/react-router";

const TournamentLayout = () => {
	const tournament = useTournament();

	if (tournament.isLoading) {
		return (
			<Box>
				<Typography variant="h3" color="neutral.10">
					...Loading...
				</Typography>
			</Box>
		);
	}

	if (tournament.isError) {
		return (
			<Box>
				<Typography variant="h3" color="neutral.10">
					Ops! Something happened
				</Typography>
			</Box>
		);
	}

	return (
		<Container data-ui="tournament-page">
			<ScreenHeading withBackButton>
				<TournamentHeading tournament={tournament} />
			</ScreenHeading>
			<Outlet />
		</Container>
	);
};

const Container = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		flex: 1,
		display: "flex",
		flexDirection: "column",
	}),
);

export { TournamentLayout };
