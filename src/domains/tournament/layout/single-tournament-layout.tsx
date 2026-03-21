import { Box, styled, Typography } from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import { ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import TournamentHeading from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { FONT_FAMILIES } from "@/domains/ui-system/theme/foundation/typography";

export const SingleTournamentLayout = () => {
	const {
		data: { tournament },
		states,
	} = useTournament({ fetchOnMount: true });

	if (states.isError) {
		<AuthenticatedScreenLayout>
			<ScreenHeadingSkeleton />

			<ScreenMainContent>
				<Typography>Error</Typography>
			</ScreenMainContent>
		</AuthenticatedScreenLayout>;
	}

	if (states.isLoading) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<TournamentHeading.Skeleton />
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	if (states.isEmpty) {
		return (
			<AuthenticatedScreenLayout>
				<ScreenHeadingSkeleton />

				<ScreenMainContent>
					<TournamentHeading.Skeleton />
				</ScreenMainContent>
			</AuthenticatedScreenLayout>
		);
	}

	return (
		<AuthenticatedScreenLayout data-ui="single-tournament-layout" overflow="hidden">
			<TournamentConteainer>
				<TournamentDisplay>
					<NameAndCurrentRound>
						<Typography data-ui="title" variant="h2" textTransform="uppercase" color="black.400">
							{tournament?.label}
						</Typography>

						<CurrentRoundContainer>
							<Typography
								variant="body1"
								color="black.400"
								textTransform="lowercase"
								sx={{
									fontFamily: FONT_FAMILIES.heading,
									// fontWeight: "bold",
								}}
							>
								current round
							</Typography>
							{/* TODO This Styled Component will be a Pill component once the new Pill is ready */}
							<CurrentRound>
								<Typography
									variant="body2"
									color="neutral.0"
									textTransform="uppercase"
									sx={{
										fontFamily: FONT_FAMILIES.heading,
										fontWeight: "bold",
									}}
								>
									{tournament?.currentRound}
								</Typography>
							</CurrentRound>
						</CurrentRoundContainer>
					</NameAndCurrentRound>

					<LogoContainer>
						<Logo src={tournament?.logo} />
					</LogoContainer>
				</TournamentDisplay>

				<Outlet />
			</TournamentConteainer>
		</AuthenticatedScreenLayout>
	);
};

const TournamentConteainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	padding: theme.spacing(4, 2),
	gap: theme.spacing(4),
}));

const CurrentRoundContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	gap: theme.spacing(1.5),
	alignItems: "center",
}));

const CurrentRound = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(1, 1.5),
	borderRadius: theme.shape.medium,
}));

const TournamentDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	width: "fit-content",
	gap: theme.spacing(2),
	padding: theme.spacing(3.5),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.shape.medium,
}));

const NameAndCurrentRound = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(1),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
	// backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(0.5),
	borderRadius: theme.shape.medium,
	opacity: 0.7,
	width: "86px",
}));

const Logo = styled("img")(() => ({
	height: "auto",
	maxWidth: "100%",
}));
