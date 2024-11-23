import { IGuess } from "@/domains/guess/typing";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { IMatch } from "../../typing";
import { MatchAnalysis } from "../../utils";
import { GuessDisplay } from "./guess-display";
import { ScoreDisplay } from "./score-display";
import { TeamDisplay } from "./team-display";
interface Props {
	logoUrl: string;
	match: IMatch;
	guess: IGuess;
}

export const MatchCard = (props: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { logoUrl, match, guess } = props;

	const analysis = MatchAnalysis(guess, match);
	console.log("[ANALYSIS]", analysis.score, analysis.guess);

	return (
		<Surface
			sx={{
				display: "flex",
				alignItems: "center",
				bgcolor: "black.800",
				position: "relative",
				borderRadius: 2,
				px: 1,
				py: 1.5,
				gap: 1,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					gap: 1,
					flex: 1,
				}}
			>
				<>
					<Box
						sx={{
							display: "flex",
							gap: 2,
							justifyContent: "space-between",
							flexDirection: isOpen ? "column" : "row",
							// position: isOpen ? "absolute" : "relative",
							// bottom: isOpen ? 0 : "initial",
							// left: isOpen ? 0 : "initial",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<ScoreDisplay value={analysis.score.home} />
							<GuessDisplay data={analysis?.guess?.home} />
						</Box>
						<TeamDisplay
							expanded={isOpen}
							logoUrl={logoUrl}
							label={match.homeTeam}
						/>
					</Box>

					<Box
						sx={{
							display: "flex",
							justifyContent: "space-between",
							gap: 2,
							flexDirection: isOpen ? "column" : "row",
						}}
					>
						<TeamDisplay
							expanded={isOpen}
							logoUrl={logoUrl}
							label={match.homeTeam}
						/>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								gap: 1,
							}}
						>
							<ScoreDisplay value={analysis.score.away} />
							<GuessDisplay data={analysis?.guess?.away} />
						</Box>
					</Box>
				</>
			</Box>

			{isOpen ? (
				<Stack>
					<Typography textTransform="uppercase" variant="tag" color="teal.500">
						date
					</Typography>
					<Typography
						textTransform="uppercase"
						variant="tag"
						color="neutral.100"
					>
						{new Date(match.date).toLocaleDateString()}
					</Typography>
				</Stack>
			) : null}

			<Divider
				sx={{ bgcolor: "black.500", height: 40 }}
				orientation="vertical"
			/>

			<Box ml="auto">
				<Button
					sx={{
						borderRadius: "50%",
						color: "neutral.100",
						backgroundColor: "teal.500",
						width: 16,
						height: 16,
					}}
					onClick={() => setIsOpen((prev) => !prev)}
				>
					<AppIcon name="ChevronRight" size="tiny" />
				</Button>
			</Box>
		</Surface>
	);
};
