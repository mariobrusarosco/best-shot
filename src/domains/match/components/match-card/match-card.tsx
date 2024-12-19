import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Divider, styled } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import { useState } from "react";
import { IMatch } from "../../typing";
import { defineMatchTimebox } from "../../utils";
import { GuessDisplay } from "./guess-display";
import { GuessStatus } from "./guess-status";
import {
	Card,
	CTA,
	Header,
	SaveButton,
	Team,
	Teams,
	ToggleButton,
} from "./match-card.styles";
import { ScoreDisplay } from "./score-display";
import { TeamDisplay } from "./team-display";

const ALLOW_INPUT_WHEN_GUESS_STATUS = new Set([
	"waiting_for_game",
	"not-started",
]);

const SHOW_TIMEBOX_WHEN_GUESS_STATUS = new Set(["not-started"]);

interface Props {
	match: IMatch;
	guess: IGuess;
}

const MatchCard = ({ guess, match }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const guessInputs = useGuessInputs(guess, match);

	// Match
	const timebox = defineMatchTimebox(match.date);

	const showInputs = ALLOW_INPUT_WHEN_GUESS_STATUS.has(guess.status) && isOpen;

	console.log(showInputs);
	const showTimeBox = SHOW_TIMEBOX_WHEN_GUESS_STATUS.has(guess.status);

	return (
		<Card
			data-open={isOpen}
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
							: format(new Date(match.date), "dd MMM - k:mm")}
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

				<CTA>
					{isOpen ? (
						<SaveButton
							onClick={async () => {
								await guessInputs.handleSave();
								setIsOpen(false);
							}}
							disabled={!guessInputs.allowNewGuess}
						>
							<AppIcon name="Save" size="extra-small" />
						</SaveButton>
					) : null}

					<ToggleButton onClick={() => setIsOpen((prev) => !prev)}>
						<AppIcon name={isOpen ? "Minus" : "Plus"} size="tiny" />
					</ToggleButton>
				</CTA>
			</Header>

			<Teams>
				<Team data-venue="home">
					{/* {showInputs ? (
						<ScoreInput
							value={guessInputs.homeGuess}
							handleInputChange={guessInputs.handleHomeGuess}
						/>
					) : null} */}

					<GuessDisplay data={guess.home} />
					<TeamDisplay expanded={isOpen} team={match.home} />
					<ScoreDisplay
						guess={guess}
						score={match.home.score}
						expanded={isOpen}
					/>
				</Team>

				<Team data-venue="away">
					{/* {showInputs ? (
						<ScoreInput
							value={guessInputs.awayGuess}
							handleInputChange={guessInputs.handleAwayGuess}
						/>
					) : null} */}
					<ScoreDisplay
						guess={guess}
						score={match.away.score}
						expanded={isOpen}
					/>
					<TeamDisplay expanded={isOpen} team={match.away} />
					<GuessDisplay data={guess.away} />
				</Team>
			</Teams>
		</Card>
	);
};

const Skeleton = styled(Card)(({ theme }) =>
	theme.unstable_sx({
		height: "84px",
		...shimmerEffect(),
	}),
);

export default {
	Component: MatchCard,
	Skeleton,
};
