import { ScreenHeading } from "@/domains/global/components/screen-heading";
import {
	TournamentHeading,
	TournamentLogo,
} from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { ScreenLayout } from "../ui-system/layout/screen-layout";

const TournamentLayout = () => {
	const tournament = useTournament();

	if (tournament.isLoading) {
		return (
			<ScreenLayout>
				<Typography variant="h3" color="neutral.10">
					...Loading...
				</Typography>
			</ScreenLayout>
		);
	}

	if (tournament.isError) {
		return (
			<ScreenLayout>
				<Typography variant="h3" color="neutral.10">
					Ops! Something happened
				</Typography>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="tournament-page">
			<ScreenHeading
				title={tournament.data?.label}
				subtitle={tournament.data?.season}
				withBackButton
			>
				<LogoBox>
					<TournamentLogo src={tournament.data?.logo} />
				</LogoBox>
			</ScreenHeading>

			<TournamentHeading tournament={tournament} />

			<Outlet />
		</ScreenLayout>
	);
};

const LogoBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: { all: "none", tablet: "grid" },
		img: {
			maxHeight: "170px",
			maxWidth: "170px",
		},
	}),
);

export { TournamentLayout };
