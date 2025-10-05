import { Divider, Stack, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { useState } from "react";

import { BestShotIcon } from "@/assets/best-shot-icon";
import AIPredictionButton from "@/domains/ai/components/AIPredictionButton";
import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import type { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { type GUESS_STATUS, GUESS_STATUSES, type IGuess } from "@/domains/guess/typing";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { theme, UIHelper } from "@/theming/theme";
import type { IMatch } from "../../typing";
import { defineMatchTimebox } from "../../utils";
import { CardAnimation } from "./animations";
import { GuessDisplay } from "./guess-display";
import { GuessMatchOutcome } from "./guess-match-outcome";
import { GuessPoints } from "./guess-points";
import { GuessStatus } from "./guess-status";
import { ScoreDisplay } from "./score-display";
import { ScoreInput } from "./score-input";
import { TeamDisplay } from "./team-display";

const SHOW_TIMEBOX_WHEN_GUESS_STATUS = new Set<GUESS_STATUS>([
	GUESS_STATUSES.NOT_STARTED,
	GUESS_STATUSES.WAITING_FOR_GAME,
]);
const SHOW_SAVE_BUTTON_WHEN_GUESS_STATUS = new Set<GUESS_STATUS>([
	GUESS_STATUSES.WAITING_FOR_GAME,
	GUESS_STATUSES.NOT_STARTED,
]);
const SHOW_CTA_BUTTON_WHEN_GUESS_STATUS = new Set<GUESS_STATUS>([
	GUESS_STATUSES.WAITING_FOR_GAME,
	GUESS_STATUSES.NOT_STARTED,
]);
interface Props {
	match: IMatch;
	guess: IGuess;
	guessMutation: ReturnType<typeof useGuessMutation>;
}

const MatchCard = ({ guess, match, guessMutation }: Props) => {
	const [isOpen, setIsOpen] = useState(true);
	const guessInputs = useGuessInputs(guess, match, guessMutation);

	// Match
	const timebox = defineMatchTimebox(match.date);

	const showTimeBox = SHOW_TIMEBOX_WHEN_GUESS_STATUS.has(guess.status);
	const showCTAButton =
		SHOW_CTA_BUTTON_WHEN_GUESS_STATUS.has(guess.status) && !guess.hasLostTimewindowToGuess;
	const showSaveButton = SHOW_SAVE_BUTTON_WHEN_GUESS_STATUS.has(guess.status) && isOpen;

	const handleAIPrediction = (homeScore: number, awayScore: number) => {
		guessInputs.handleHomeGuess(homeScore);
		guessInputs.handleAwayGuess(awayScore);
	};

	return (
		<Card
			data-card-open={false}
			data-ui="match-card"
			data-match-status={match.status}
			data-guess-status={guess.status}
			data-id={guess.id}
		>
			<CardAnimation lastSavedGuess={guessMutation.data?.id === guess.id} />
			<Header data-ui="match-card-header">
				<Stack gap={1} display="flex" flexDirection="row" alignItems="center" width="100%">
					<Stack direction="row" gap={1} alignItems="center">
						<Typography textTransform="uppercase" variant="tag" color="teal.500" fontWeight={500}>
							date
						</Typography>

						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
							fontWeight={500}
						>
							{match.date === null ? "-" : dayjs(match.date).format("HH:mm - MMM DD")}
						</Typography>

						<Divider
							orientation="vertical"
							sx={{ bgcolor: "black.300", width: "1px", height: "15px" }}
						/>
						{showTimeBox ? (
							<Stack direction="row" gap={1} alignItems="center">
								<AppIcon name="ClockFilled" size="tiny" color={theme.palette.teal[500]} />
								<Typography
									variant="tag"
									fontWeight={500}
									textTransform="uppercase"
									color={theme.palette.neutral[100]}
								>
									{timebox} to guess
								</Typography>
							</Stack>
						) : null}

						<GuessMatchOutcome guess={guess} />
						<GuessPoints guess={guess} />
					</Stack>

					<GuessStatus guess={guess} />
				</Stack>

				{showCTAButton ? (
					<CTA>
						<AIPredictionButton
							matchId={match.id}
							onPredictionReceived={handleAIPrediction}
							disabled={!guessInputs.allowNewGuess || guessInputs.isPending}
						/>

						{showSaveButton ? (
							<Button
								onClick={async () => {
									await guessInputs.handleSave();
									setIsOpen(false);
								}}
								disabled={!guessInputs.allowNewGuess || guessInputs.isPending}
							>
								{guessInputs.isPending ? (
									<BestShotIcon fill={theme.palette.neutral[100]} isAnimated />
								) : (
									<AppIcon name="Save" size="extra-small" />
								)}
							</Button>
						) : null}

						<Button onClick={() => setIsOpen((prev) => !prev)}>
							<AppIcon name={isOpen ? "Minus" : "Plus"} size="tiny" />
						</Button>
					</CTA>
				) : null}
			</Header>

			<Teams data-ui="teams">
				<Team data-venue="home" data-ui="team">
					<GuessDisplay cardExpanded={isOpen} data={guess.home} />
					<TeamDisplay cardExpanded={isOpen} team={match.home} />
					<ScoreDisplay matchVenueData={match.home} />
					<ScoreInput
						guessStatus={guess.status}
						cardExpanded={isOpen}
						value={guessInputs.homeGuess}
						handleInputChange={guessInputs.handleHomeGuess}
					/>
				</Team>

				<Team data-venue="away" data-ui="team">
					<ScoreDisplay matchVenueData={match.away} />
					<TeamDisplay cardExpanded={isOpen} team={match.away} />
					<GuessDisplay cardExpanded={isOpen} data={guess.away} />
					<ScoreInput
						guessStatus={guess.status}
						cardExpanded={isOpen}
						value={guessInputs.awayGuess}
						handleInputChange={guessInputs.handleAwayGuess}
					/>
				</Team>
			</Teams>
		</Card>
	);
};

// ===== STYLED COMPONENTS (Following Static Styled Components Pattern) =====

// Main match card container with motion support
const Card = styled(motion(Surface))(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	backgroundColor: theme.palette.black[800],
	padding: theme.spacing(2, 1),
	gap: theme.spacing(3),
	borderRadius: theme.spacing(1),
	maxWidth: "100%",
	position: "relative",
	overflow: "hidden",

	"[data-card-open='true']": {
		gap: theme.spacing(3.5),
	},

	[UIHelper.startsOn("tablet")]: {
		padding: theme.spacing(2),
	},
}));

// Header section with match details
const Header = styled(Stack)(({ theme }) => ({
	width: "100%",
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gridArea: "header",
	gap: theme.spacing(2),
}));

// Teams container
const Teams = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	gap: theme.spacing(4),

	"[data-card-open='true'] &": {
		gap: theme.spacing(6),
	},
}));

// Individual team container with motion support
const Team = styled(motion.div)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	flex: 1,
	maxWidth: "50%",

	"[data-card-open='true'] &": {
		flexDirection: "column",
		alignItems: "stretch",
		gap: theme.spacing(2),
	},

	"[data-venue='away'] &": {
		gap: theme.spacing(2),
	},
}));

// Call-to-action container
const CTA = styled(Stack)(({ theme }) => ({
	flexDirection: "row",
	justifyContent: "space-between",
	alignItems: "center",
	gap: theme.spacing(1),
}));

// Action button (save, expand/collapse)
const Button = styled(AppButton)(({ theme }) => ({
	borderRadius: theme.spacing(0.5),
	color: theme.palette.neutral[100],
	backgroundColor: theme.palette.teal[500],
	width: "24px",
	height: "24px",

	"&[disabled]": {
		filter: "grayscale(1)",
		opacity: "0.5",
	},
}));

// Loading skeleton
const Skeleton = styled(Card)(() => ({
	minHeight: "140px",
	position: "relative",
	...shimmerEffect(),
}));

export default {
	Component: MatchCard,
	Skeleton,
};
