import { IGuess } from "@/domains/guess/typing";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";

interface Props {
	data: IGuess["away"] | IGuess["away"] | null;
}

export const GuessDisplay = ({ data }: Props) => {
	const content = data?.value || "-";
	const { color, bgColor } = getStylesByOutcome(data?.guessOutcome || null);

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				gap: 1,
			}}
		>
			<Typography variant="tag" color={color}>
				guess
			</Typography>
			<Pill bgcolor={bgColor} minWidth={30} height={20}>
				<Typography variant="tag">{content}</Typography>
			</Pill>
		</Box>
	);
};

const getStylesByOutcome = (outcome: string | null) => {
	if (outcome === "incorrect_guess") {
		return {
			color: "red.400",
			bgColor: "red.400",
		};
	}

	if (outcome === "correct_guess")
		return {
			color: "green.200",
			bgColor: "green.200",
		};

	return {
		color: "neutral.100",
		bgColor: "black.500",
	};
};
