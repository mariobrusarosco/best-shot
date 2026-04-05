import { Box, Stack, styled, Typography } from "@mui/material";
import { Outlet } from "@tanstack/react-router";
import { ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import TournamentHeading from "@/domains/tournament/components/tournament-heading";
import { useTournament } from "@/domains/tournament/hooks/use-tournament";
import { useTournamentScore } from "@/domains/tournament/hooks/use-tournament-score";
import { useTournamentSimulation } from "@/domains/tournament/hooks/use-tournament-simulation";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { AuthenticatedScreenLayout } from "@/domains/ui-system/layout/authenticated";
import { ScreenMainContent } from "@/domains/ui-system/layout/screen-main-content";
import { FONT_FAMILIES } from "@/domains/ui-system/theme/foundation/typography";

export const SingleTournamentLayout = () => {
	const {
		data: { tournament },
		states,
	} = useTournament({ fetchOnMount: true });
	const { score } = useTournamentScore();
	const simulation = useTournamentSimulation();

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
			<TournamentContainer>
				<Stack flexDirection="row" justifyContent="space-between">
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

					<TournamentScoreDisplay data-ui="tournament-score-display">
						{score.data?.underCalculation ? (
							<UnderCalculationDisplay>
								<Typography
									variant="caption"
									textTransform="uppercase"
									sx={{
										fontFamily: FONT_FAMILIES.heading,
										letterSpacing: "0.2px",
										fontWeight: "700",
									}}
								>
									under calculation
								</Typography>
							</UnderCalculationDisplay>
						) : null}

						<Typography
							variant="h6"
							color="black.400"
							textTransform="uppercase"
							sx={{
								fontFamily: FONT_FAMILIES.heading,
							}}
						>
							you have
						</Typography>
						<Score>
							<Typography
								variant="body2"
								color="neutral.0"
								textTransform="uppercase"
								sx={{
									fontFamily: FONT_FAMILIES.heading,
									fontWeight: "bold",
								}}
							>
								{score.data?.points} points
							</Typography>
						</Score>
					</TournamentScoreDisplay>
				</Stack>

				{simulation.isEnabled ? (
					<SimulationControls>
						<AppPill.Component bgcolor="teal.500" px={2} py={0.75}>
							<Typography
								variant="tag"
								color="neutral.0"
								textTransform="uppercase"
								fontWeight={600}
							>
								simulation
							</Typography>
						</AppPill.Component>

						<AppButton variant="outlined" color="inherit" onClick={simulation.actions.reset}>
							Reset simulation
						</AppButton>
					</SimulationControls>
				) : null}

				<Outlet />
			</TournamentContainer>
		</AuthenticatedScreenLayout>
	);
};

const TournamentContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(4),
}));

const SimulationControls = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
	flexWrap: "wrap",
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
	padding: theme.spacing(0.5),
	borderRadius: theme.shape.medium,
	opacity: 0.7,
	width: "86px",
}));

const Logo = styled("img")(() => ({
	height: "auto",
	maxWidth: "100%",
}));

// TODO: [SCORE DISPLAY] Consider Abstraction
const TournamentScoreDisplay = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	height: "fit-content",
	width: "fit-content",
	gap: theme.spacing(0.5),
	padding: theme.spacing(2),
	backgroundColor: theme.palette.neutral[0],
	borderRadius: theme.shape.medium,
	alignItems: "center",
	flexWrap: "wrap",
}));

const Score = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.teal[500],
	padding: theme.spacing(1, 1.5),
	borderRadius: theme.shape.medium,
}));

const UnderCalculationDisplay = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.pink["700"],
	padding: theme.spacing(0.5, 1),
	borderRadius: theme.shape.medium,
	color: theme.palette.neutral[0],
}));
