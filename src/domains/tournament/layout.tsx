import {
	ScreenHeading,
	ScreenHeadingSkeleton,
} from "@/domains/global/components/screen-heading";
import TournamentHeading, {
	TournamentLogo,
} from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Outlet } from "@tanstack/react-router";
import { ScreenLayout } from "../ui-system/layout/screen-layout";
import { ScreenMainContent } from "../ui-system/layout/screen-main-content";

const TournamentLayout = () => {
	const tournament = useTournament();

	if (tournament.isPending) {
		return (
			<ScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<TournamentHeading.Skeleton />
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	if (tournament.isError) {
		return (
			<ScreenLayout>
				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						Ops! Something happened
					</Typography>
				</ScreenMainContent>
			</ScreenLayout>
		);
	}

	return (
		<ScreenLayout data-ui="tournament-page">
			<ScreenHeading
				title={tournament.data?.label}
				subtitle={tournament.data?.season}
				backTo="/tournaments"
			>
				<LogoBox>
					<TournamentLogo src={tournament.data?.logo} />
				</LogoBox>
			</ScreenHeading>

			<ScreenMainContent data-ui="screen-main-content">
				<TournamentHeading.Component tournament={tournament} />

				<Outlet />
			</ScreenMainContent>
		</ScreenLayout>
	);
};

const LogoBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		img: {
			maxHeight: "110px",
			maxWidth: "110px",
		},
	}),
);

export { TournamentLayout };
