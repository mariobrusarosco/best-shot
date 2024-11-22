import { MatchAnalyzer } from "@/domains/demo/utils";
import { IGuess } from "@/domains/guess/typing";
import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Box, styled } from "@mui/system";
import { IMatch } from "../../typing";
interface Props {
	logoUrl: string;
	match: IMatch;
	guess: IGuess;
}

export const MatchCard = (props: Props) => {
	const { logoUrl, match, guess } = props;
	const analysis = MatchAnalyzer(guess, match);
	console.log("[Match]", { match, guess }, analysis);

	// debugger;

	return (
		<Surface
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				bgcolor: "black.800",
				borderRadius: 2,
				px: 1,
				py: 1.5,
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					gap: 1,
				}}
			>
				<Team
					logoUrl={logoUrl}
					label={match.homeTeam}
					guessValue={analysis?.GUESSED_HOME_SCORE}
					scorevalue={match.homeScore}
				/>
				<Team
					logoUrl={logoUrl}
					label={match.awayTeam}
					guessValue={analysis?.GUESSED_AWAY_SCORE}
					scorevalue={match.awayScore}
				/>
			</Box>

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
						width: 24,
						height: 24,
					}}
				>
					<AppIcon name="ChevronRight" size="tiny" />
				</Button>
			</Box>
		</Surface>
	);
};

export const TeamLogo = styled("img")(() => ({
	display: "inline-flex",
	width: 14,
	height: 14,
}));

const Team = ({
	logoUrl,
	label,
	guessValue,
	scorevalue,
}: {
	logoUrl: string;
	label: string;
	guessValue: boolean | null | undefined;
	scorevalue: string;
}) => {
	return (
		<Box
			sx={{
				display: "flex",
				gap: 1,
				alignItems: "center",
			}}
		>
			<Box
				sx={{
					gap: 0.5,
					display: "flex",
					alignItems: "center",
				}}
			>
				<Surface
					sx={{
						p: 1,
						borderRadius: 1,
						bgcolor: "black.500",
						display: "grid",
						placeItems: "center",
					}}
				>
					<TeamLogo src={logoUrl} />
				</Surface>

				<Typography variant="tag">{label}</Typography>
			</Box>

			<ScoreDisplay guessValue={guessValue} scoreValue={scorevalue} />
		</Box>
	);
};

const getStatusStyles = (guessValue: boolean | null | undefined) => {
	if (guessValue)
		return {
			backgroundColor: "green.200",
		};

	if (guessValue === null || guessValue === undefined)
		return {
			backgroundColor: "black.500",
		};

	return {
		backgroundColor: "red.400",
	};
};

const ScoreDisplay = (props: {
	guessValue: boolean | null | undefined;
	scoreValue: string;
}) => {
	const { guessValue, scoreValue } = props;
	const { backgroundColor } = getStatusStyles(guessValue);

	return (
		<Pill bgcolor={backgroundColor} minWidth={40} height={20}>
			<Typography variant="tag">{scoreValue}</Typography>
		</Pill>
	);
};

const ScoreInput = () => {};
