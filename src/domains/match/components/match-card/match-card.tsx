import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Divider from "@mui/material/Divider/Divider";
import Typography from "@mui/material/Typography/Typography";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import { useState } from "react";
import { IMatch } from "../../typing";
import { GuessDisplay } from "./guess-display";
import {
	Card,
	CTA,
	Header,
	SaveButton,
	ScoreAndGuess,
	Team,
	Teams,
	ToggleButton,
} from "./match-card.styles";
import { ScoreDisplay } from "./score-display";
import { ScoreInput } from "./score-input";
import { TeamDisplay } from "./team-display";

interface Props {
	match: IMatch;
	guess: IGuess;
}

export const MatchCard = ({ guess, match }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const guessInputs = useGuessInputs(guess, match);

	console.log({ guessInputs });

	const avaialbleActions =
		guess.status !== "paused" && guess.status !== "expired";

	return (
		<Card data-open={isOpen} data-ui="card" data-guess-status={guess.status}>
			<Header>
				<Stack direction="row" gap={1.5} alignItems="center">
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
					<ScoreDisplay value={match.home.score} />
					{avaialbleActions ? (
						<ScoreAndGuess>
							{isOpen ? (
								<ScoreInput
									value={guessInputs.homeGuess}
									handleInputChange={guessInputs.handleHomeGuess}
								/>
							) : (
								<GuessDisplay data={guess.home} />
							)}
						</ScoreAndGuess>
					) : null}
					<TeamDisplay expanded={isOpen} team={match.home} />
				</Team>

				<Divider
					sx={{
						bgcolor: "black.500",
						height: "100%",
					}}
					orientation="vertical"
				/>

				<Team data-venue="away">
					<ScoreDisplay value={match.away.score} />
					{avaialbleActions ? (
						<ScoreAndGuess>
							{isOpen ? (
								<ScoreInput
									value={guessInputs.awayGuess}
									handleInputChange={guessInputs.handleAwayGuess}
								/>
							) : (
								<GuessDisplay data={guess.away} />
							)}
						</ScoreAndGuess>
					) : null}
					<TeamDisplay expanded={isOpen} team={match.away} />
				</Team>
			</Teams>
		</Card>
	);
};

const getStatusPill = (guess: IGuess) => {
	if (guess.status === "paused")
		return (
			<AppPill bgcolor="pink.700" width={80} height={20}>
				<Typography variant="tag">postponed</Typography>
			</AppPill>
		);

	if (guess.status === "expired")
		return (
			<AppPill border="1px solid" borderColor="red.400" width={60} height={20}>
				<Typography color="red.400" variant="tag">
					expired
				</Typography>
			</AppPill>
		);

	if (guess.status === "waiting_for_game")
		return (
			<AppPill bgcolor="teal.500" width={120} height={20}>
				<Typography variant="tag">waiting for match</Typography>
			</AppPill>
		);

	if (guess.status === "not-started")
		return (
			<AppPill
				border="1px solid"
				borderColor="neutral.100"
				width={75}
				height={20}
			>
				<Typography variant="tag">give a shot!</Typography>
			</AppPill>
		);

	return null;
};
