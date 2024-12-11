import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { format } from "date-fns";
import { useState } from "react";
import { IMatch } from "../../typing";
import { Card, Header, SaveButton, ToggleButton } from "./match-card.styles";

interface Props {
	match: IMatch;
	guess: IGuess;
}

export const MatchCard = ({ guess, match }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const guessInputs = useGuessInputs(guess, match);

	return (
		<Card data-open={isOpen} data-ui="card" data-guess-status={guess.status}>
			{/* <Box
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
					<TeamDisplay expanded={isOpen} team={match.home} />

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
							{guess.status === "not-started" ||
							guess.status === "waiting_for_game" ? null : (
								<ScoreDisplay value={match.home.score} />
							)}
							<GuessDisplay data={guess?.home || null} />
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
					<TeamDisplay expanded={isOpen} team={match.away} />

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
							{guess.status === "not-started" ||
							guess.status === "waiting_for_game" ? null : (
								<ScoreDisplay value={match.away.score} />
							)}
							<GuessDisplay data={guess?.away || null} />
						</Box>
					)}
				</Box>
			</Box> */}

			<Header>
				<Stack direction="row" gap={1}>
					<Typography textTransform="uppercase" variant="tag" color="teal.500">
						date
					</Typography>
					<Typography
						// textTransform="uppercase"
						variant="tag"
						color="neutral.100"
					>
						{match.date === null
							? "-"
							: format(new Date(match.date), "dd MMM - k:mm")}
					</Typography>
					{/* {new Date(match.date).toLocaleDateString()} */}
					{/* {new Intl.DateTimeFormat("en-US", {
							month: "short",
							year: "2-digit",
							day: "2-digit",
						}).format(new Date(match.date))}
					</Typography> */}
				</Stack>

				{getStatusPill(guess)}
			</Header>

			<Stack gridArea="cta">
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
			</Stack>
		</Card>
	);
};

const getStatusPill = (guess: IGuess) => {
	if (guess.status === "paused")
		return (
			<AppPill bgcolor="pink.700" width={80} height={18}>
				<Typography variant="tag">postponed</Typography>
			</AppPill>
		);

	if (guess.status === "expired")
		return (
			<AppPill bgcolor="red.400" width={70} height={18}>
				<Typography variant="tag">expired</Typography>
			</AppPill>
		);

	if (guess.status === "waiting_for_game")
		return (
			<AppPill bgcolor="teal.500" width={90} height={18}>
				<Typography variant="tag">waiting for game</Typography>
			</AppPill>
		);

	if (guess.status === "not-started")
		return (
			<AppPill bgcolor="teal.500" width={80} height={18}>
				<Typography variant="tag">not started</Typography>
			</AppPill>
		);

	return null;
};
