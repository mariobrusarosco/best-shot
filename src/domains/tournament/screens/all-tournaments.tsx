import { Box, styled, Typography } from "@mui/material";
import { ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import {
	TournamentsList,
	TournamentsListLoading,
} from "@/domains/tournament/components/tournaments-list";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { UIHelper } from "@/domains/ui-system/theme";
import { FONT_FAMILIES } from "@/domains/ui-system/theme/foundation/typography";

export const AllTournamentsScreen = () => {
	const { tournaments } = useTournaments();

	if (tournaments.states.isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<TournamentsListLoading />
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (tournaments.states.isError) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						Ops! Something happened
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (tournaments.states.isEmpty) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<Typography variant="h3" color="neutral.10">
						No tournaments found
					</Typography>
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="tournaments-screen">
			<AllTournamentsDisplay>
				<Typography data-ui="title" variant="h2" textTransform="uppercase" color="black.400">
					All Tournaments
				</Typography>

				<CurrentSeasonContainer>
					<Typography
						variant="body1"
						color="black.400"
						textTransform="lowercase"
						sx={{
							fontFamily: FONT_FAMILIES.heading,
						}}
					>
						current round
					</Typography>
					{/* TODO This Styled Component will be a Pill component once the new Pill is ready */}
					<CurrentSeason>
						<Typography
							variant="body2"
							color="neutral.0"
							textTransform="uppercase"
							sx={{
								fontFamily: FONT_FAMILIES.heading,
								fontWeight: "bold",
							}}
						>
							2025/2026
						</Typography>
					</CurrentSeason>
				</CurrentSeasonContainer>
			</AllTournamentsDisplay>

			<ScreenContainer data-ui="tournaments-main-content">
				<TournamentsList tournaments={tournaments.data} />
			</ScreenContainer>
		</AuthenticatedScreenLayout>
	);
};

export const ScreenContainer = styled(ScreenMainContent)(({ theme }) => ({
	[UIHelper.startsOn("tablet")]: {
		paddingLeft: theme.spacing(0),
		paddingRight: theme.spacing(2),
	},
}));

// TODO: Consider in tbe future to abstract this component to the ui-system
// given lots of screens might have this component

const AllTournamentsDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	width: "fit-content",
	gap: theme.spacing(2),
	padding: theme.spacing(3.5),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.borderRadius.medium,
}));

const CurrentSeasonContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1.5),
	alignItems: "center",
}));

const CurrentSeason = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(1, 1.5),
	borderRadius: theme.borderRadius.medium,
}));
