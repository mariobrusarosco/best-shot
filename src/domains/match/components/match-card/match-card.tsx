import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { IMatch } from "../../typing";
import { GuessDisplay } from "./guess-display";
import { Card, Header, SaveButton, ToggleButton } from "./match-card.styles";
import { ScoreDisplay } from "./score-display";
import { ScoreInput } from "./score-input";
import { TeamDisplay } from "./team-display";
interface Props {
	match: IMatch;
	guess: IGuess | undefined;
}

export const MatchCard = (props: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const guessInputs = useGuessInputs(props.guess, props.match);

	return (
		<Card data-open={isOpen} data-ui="card">
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flex: 1,
					gridArea: "teams",
				}}
			>
				<Box
					data-venue="home"
					sx={{
						display: "flex",
						columnGap: 1,
						rowGap: 2,
						justifyContent: "space-between",
						flexDirection: isOpen ? "column" : "row",
					}}
				>
					<TeamDisplay expanded={isOpen} team={props.match.home} />

					{isOpen ? (
						<>
							<ScoreInput
								value={guessInputs.homeGuess}
								handleInputChange={guessInputs.handleHomeGuess}
							/>
						</>
					) : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<ScoreDisplay value={props.match.home.score} />
							<GuessDisplay data={props.guess?.home || null} />
						</Box>
					)}
				</Box>

				<Divider
					sx={{ bgcolor: "black.500", width: "1px" }}
					orientation="vertical"
				/>

				<Box
					data-venue="away"
					sx={{
						display: "flex",
						justifyContent: "space-between",
						gap: 1,
						flexDirection: isOpen ? "column" : "row",
					}}
				>
					<TeamDisplay expanded={isOpen} team={props.match.away} />

					{isOpen ? (
						<ScoreInput
							value={guessInputs.awayGuess}
							handleInputChange={guessInputs.handleAwayGuess}
						/>
					) : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<ScoreDisplay value={props.match.away.score} />
							<GuessDisplay data={props.guess?.away || null} />
						</Box>
					)}
				</Box>
			</Box>

			<Header>
				{isOpen ? (
					<Stack>
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							date
						</Typography>
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
						>
							{new Date(props.match.date).toLocaleDateString()}
						</Typography>
					</Stack>
				) : null}

				<Box display="flex" gap={1}>
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
				</Box>
			</Header>
		</Card>
	);
};
