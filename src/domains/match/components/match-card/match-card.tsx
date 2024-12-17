import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { styled } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import { useState } from "react";
import { IMatch } from "../../typing";
import { defineMatchTimebox } from "../../utils";
import { GuessDisplay } from "./guess-display";
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
import { ScoreInput } from "./score-input";
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
					{/* {isOpen ? getStatusPill(guess) : null} */}
					{getStatusPill(guess)}

					{showTimeBox ? (
						// <AppPill.Component
						// 	color="neutral.100"
						// 	height={20}
						// 	border="1px solid"
						// 	borderColor="neutral.100"
						// 	px={2}
						// >
						<Typography
							variant="tag"
							fontWeight={400}
							textTransform="uppercase"
						>
							{timebox}
						</Typography>
					) : // </AppPill.Component>
					null}
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

			{/* <Divider
				sx={{
					bgcolor: "black.300",
					height: "1px",
				}}
				orientation="horizontal"
			/> */}

			<Teams>
				<Team data-venue="home">
					{/* <ScoreAndGuess> */}
					{showInputs ? (
						<ScoreInput
							value={guessInputs.homeGuess}
							handleInputChange={guessInputs.handleHomeGuess}
						/>
					) : null}

					<GuessDisplay data={guess.home} />
					{/* </ScoreAndGuess> */}
					<TeamDisplay expanded={isOpen} team={match.home} />
					<ScoreDisplay value={match.home.score} expanded={isOpen} />
				</Team>

				<Team data-venue="away">
					{/* <ScoreAndGuess> */}
					{showInputs ? (
						<ScoreInput
							value={guessInputs.awayGuess}
							handleInputChange={guessInputs.handleAwayGuess}
						/>
					) : null}
					{/* </ScoreAndGuess> */}
					<ScoreDisplay value={match.away.score} expanded={isOpen} />
					<TeamDisplay expanded={isOpen} team={match.away} />
					<GuessDisplay data={guess.away} />
				</Team>
			</Teams>
		</Card>
	);
};

const getStatusPill = (guess: IGuess) => {
	if (guess.status === "paused")
		return (
			<AppPill.Component bgcolor="pink.700" width={80} height={20}>
				<Typography variant="tag">postponed</Typography>
			</AppPill.Component>
		);

	if (guess.status === "expired")
		return (
			<AppPill.Component
				border="1px solid"
				borderColor="red.400"
				width={60}
				height={20}
			>
				<Typography color="red.400" variant="tag">
					expired
				</Typography>
			</AppPill.Component>
		);

	if (guess.status === "waiting_for_game")
		return (
			<AppPill.Component
				border="1px solid"
				borderColor="teal.500"
				color="neutral.100"
				width={110}
				height={20}
			>
				<Typography variant="tag">waiting for result</Typography>
			</AppPill.Component>
		);

	if (guess.status === "not-started")
		return (
			<AppPill.Component
				border="1px solid"
				borderColor="neutral.100"
				width={65}
				height={20}
			>
				<Typography variant="tag">deadline</Typography>
			</AppPill.Component>
		);

	return null;
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
