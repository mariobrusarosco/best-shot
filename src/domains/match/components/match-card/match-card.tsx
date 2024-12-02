import { useGuessInputs } from "@/domains/guess/hooks/use-guess-inputs";
import { IGuess } from "@/domains/guess/typing";
import { buildGuessInputs } from "@/domains/guess/utils";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Box, Stack, styled } from "@mui/system";
import { useState } from "react";
import { IMatch } from "../../typing";
import { GuessDisplay } from "./guess-display";
import { ScoreDisplay } from "./score-display";
import { ScoreInput } from "./score-input";
import { TeamDisplay } from "./team-display";
interface Props {
	match: IMatch;
	guess: IGuess | undefined;
}

export const MatchCard = (props: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const guess = props.guess || buildGuessInputs();
	// const analysis = MatchAnalysis(guess, match);
	const guessInputs = useGuessInputs(guess, props.match);

	return (
		<Card data-open={isOpen} data-ui="card">
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					flex: 1,
					gridArea: "teams",
				}}
				data-ui
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
					{isOpen ? null : (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<ScoreDisplay value={props.match.home.score} />
							<GuessDisplay data={guess} />
						</Box>
					)}

					<TeamDisplay expanded={isOpen} team={props.match.home} />

					{isOpen ? (
						<ScoreInput
							value={null}
							handleInputChange={guessInputs.handleHomeGuess}
						/>
					) : null}
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
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							gap: 1,
						}}
					>
						{isOpen ? (
							<ScoreInput
								value={guessInputs.awayGuess}
								handleInputChange={guessInputs.handleAwayGuess}
							/>
						) : (
							<>
								<ScoreDisplay value={props.match.away.score} />
								<GuessDisplay data={guess} />
							</>
						)}
					</Box>
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
					{/* {isOpen ? (
						<SaveButton
							onClick={async () => {
								await guessInputs.handleSave();
								setIsOpen(false);
							}}
							disabled={!guessInputs.allowNewGuess}
						>
							<AppIcon name="Save" size="extra-small" />
						</SaveButton>
					) : null} */}

					{/* {analysis.props.match.PENDING_MATCH ?( */}
					<Button
						sx={{
							borderRadius: "50%",
							color: "neutral.100",
							backgroundColor: "teal.500",
							width: 24,
							height: 24,
						}}
						onClick={() => setIsOpen((prev) => !prev)}
					>
						<AppIcon
							name={isOpen ? "ChevronUp" : "ChevronDown"}
							size="extra-small"
						/>
					</Button>
					{/* ) : null} */}
				</Box>
			</Header>
		</Card>
	);
};

export const Card = styled(Surface)(
	({ theme }) => `
		display: grid;	
		border-radius: ${theme.shape.borderRadius}px;
		background-color: ${theme.palette.black[800]};
		padding: ${theme.spacing(2)};
		gap: ${theme.spacing(1)};	
		
		&[data-open=true]{
			grid-template-areas: "header" "teams";
			grid-template-columns: 1fr;
		}
			
		&[data-open=false]{
			grid-template-columns: 1fr auto;
			grid-template-areas: "teams header";
		}
	`,
);

export const Header = styled(Box)(
	({ theme }) => `
		display: flex;
		justify-content: space-between;
		align-items: center;
		grid-area: header;		
		gap: ${theme.spacing(1)};
	`,
);

export const SaveButton = styled(Button)(
	({ theme }) => `
		border-radius: 50%;
		color: ${theme.palette.neutral[100]};
		background-color: ${theme.palette.teal[500]};
		width: 24px;
		height: 24px;

		&[disabled] {
    	filter: grayscale(1);
			opacity: 0.5;
  	} 
	`,
);
