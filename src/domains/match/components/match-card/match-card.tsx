import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { GUESS_STATUS, GUESS_STATUSES, IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Divider } from "@mui/material";

import { BestShotIcon } from "@/assets/best-shot-icon";
import { useGuessMutation } from "@/domains/guess/hooks/use-guess-mutation";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { theme } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Stack, styled } from "@mui/system";
import dayjs from "dayjs";
import { useState } from "react";
import { IMatch } from "../../typing";
import { defineMatchTimebox } from "../../utils";
import { CardAnimation } from "./animations";
import { GuessDisplay } from "./guess-display";
import { GuessMatchOutcome } from "./guess-match-outcome";
import { GuessPoints } from "./guess-points";
import { GuessStatus } from "./guess-status";
import { Button, Card, CTA, Header, Team, Teams } from "./match-card.styles";
import { ScoreDisplay } from "./score-display";
import { ScoreInput } from "./score-input";
import { TeamDisplay } from "./team-display";
import AIPredictionButton from "@/domains/ai/components/AIPredictionButton";

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
		SHOW_CTA_BUTTON_WHEN_GUESS_STATUS.has(guess.status) &&
		!guess.hasLostTimewindowToGuess;
	const showSaveButton =
		SHOW_SAVE_BUTTON_WHEN_GUESS_STATUS.has(guess.status) && isOpen;

	const handleAIPrediction = (homeScore: number, awayScore: number) => {
		guessInputs.handleHomeGuess(homeScore);
		guessInputs.handleAwayGuess(awayScore);
	};

	return (
		<Card
			data-card-open={isOpen}
			data-ui="card"
			data-match-status={match.status}
			data-guess-status={guess.status}
			data-id={guess.id}
		>
			<CardAnimation lastSavedGuess={guessMutation.data?.id === guess.id} />
			<Header>
				<Stack gap={1} alignItems="start">
					<Stack direction="row" gap={1} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
							fontWeight={500}
						>
							date
						</Typography>

						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
							fontWeight={500}
						>
							{match.date === null
								? "-"
								: dayjs(match.date).format("HH:mm - MMM DD")}
						</Typography>

						<Divider
							orientation="vertical"
							sx={{ bgcolor: "black.300", width: "1px", height: "15px" }}
						/>
						{showTimeBox ? (
							<Stack direction="row" gap={1} alignItems="center">
								<AppIcon
									name="ClockFilled"
									size="tiny"
									color={theme.palette.teal[500]}
								/>
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

const Skeleton = styled(Card)(() => ({
	minHeight: "140px",
	position: "relative",
	...shimmerEffect(),
}));

export default {
	Component: MatchCard,
	Skeleton,
};
