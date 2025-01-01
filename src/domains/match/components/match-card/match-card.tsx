import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { GUESS_STATUS, GUESS_STATUSES, IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { shimmerEffectNew } from "@/domains/ui-system/components/skeleton/skeleton";
import { Divider } from "@mui/material";
import styled from "@mui/material/styles/styled";

import Typography from "@mui/material/Typography/Typography";
import { Stack } from "@mui/system";
import dayjs from "dayjs";
import { useState } from "react";
import { IMatch } from "../../typing";
import { defineMatchTimebox } from "../../utils";
import { GuessDisplay } from "./guess-display";
import { GuessStatus } from "./guess-status";
import { Button, Card, CTA, Header, Team, Teams } from "./match-card.styles";
import { ScoreDisplay } from "./score-display";
import { ScoreInput } from "./score-input";
import { TeamDisplay } from "./team-display";

const SHOW_TIMEBOX_WHEN_GUESS_STATUS = new Set<GUESS_STATUS>([
	GUESS_STATUSES.NOT_STARTED,
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
}

const MatchCard = ({ guess, match }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const guessInputs = useGuessInputs(guess, match);

	// Match
	const timebox = defineMatchTimebox(match.date);

	const showTimeBox = SHOW_TIMEBOX_WHEN_GUESS_STATUS.has(guess.status);
	const showCTAButton =
		SHOW_CTA_BUTTON_WHEN_GUESS_STATUS.has(guess.status) &&
		!guess.hasLostTimewindowToGuess;
	const showSaveButton =
		SHOW_SAVE_BUTTON_WHEN_GUESS_STATUS.has(guess.status) && isOpen;

	return (
		<Card
			data-card-open={isOpen}
			data-ui="card"
			data-match-status={match.status}
			data-guess-status={guess.status}
		>
			<Header>
				<Stack direction="row" gap={1} alignItems="center">
					<Typography textTransform="uppercase" variant="tag" color="teal.500">
						date
					</Typography>

					<Typography
						textTransform="uppercase"
						variant="tag"
						color="neutral.100"
					>
						{match.date === null
							? "-"
							: dayjs(match.date).format("HH:mm MMM DD - YY")}
					</Typography>

					<Divider
						orientation="vertical"
						sx={{ bgcolor: "black.300", width: "1px", height: "15px" }}
					/>

					<GuessStatus guess={guess} />

					{showTimeBox ? (
						<Typography
							variant="tag"
							fontWeight={400}
							textTransform="uppercase"
						>
							{timebox}
						</Typography>
					) : null}
				</Stack>

				{showCTAButton ? (
					<CTA>
						{showSaveButton ? (
							<Button
								onClick={async () => {
									await guessInputs.handleSave();
									setIsOpen(false);
								}}
								disabled={!guessInputs.allowNewGuess}
							>
								<AppIcon name="Save" size="extra-small" />
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
					<ScoreDisplay guess={guess} score={match.home.score} />
					<ScoreInput
						guessStatus={guess.status}
						cardExpanded={isOpen}
						value={guessInputs.homeGuess}
						handleInputChange={guessInputs.handleHomeGuess}
					/>
				</Team>

				<Team data-venue="away" data-ui="team">
					<ScoreDisplay guess={guess} score={match.away.score} />
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
	height: "84px",
	...shimmerEffectNew,
}));

export default {
	Component: MatchCard,
	Skeleton,
};
