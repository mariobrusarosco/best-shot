import { GUESS_STATUS, IGuess } from "@/domains/guess/typing";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

interface Props {
	data: IGuess["away"] | IGuess["away"];
}

export const GuessDisplay = ({ data }: Props) => {
	const content = data?.value ?? "-";
	const { color, bgColor, opacity } = getStylesByStatus(data?.status || null);

	if (data.status === "expired") return null;

	return (
		<Wrapper
			sx={{
				opacity,
			}}
		>
			<Typography variant="tag" color={color}>
				guess
			</Typography>
			<Pill bgcolor={bgColor} minWidth={30} height={20}>
				<Typography variant="tag">{content}</Typography>
			</Pill>
		</Wrapper>
	);
};

const Wrapper = styled(Box)({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	gap: 1,
});

const getStylesByStatus = (status: GUESS_STATUS) => {
	if (status === "expired") {
		return {
			color: "neutral.100",
			bgColor: "black.500",
			opacity: 0.5,
		};
	}

	if (status === "incorrect") {
		return {
			color: "red.400",
			bgColor: "red.400",
		};
	}

	if (status === "correct")
		return {
			color: "green.200",
			bgColor: "green.200",
		};

	return {
		color: "neutral.100",
		bgColor: "black.500",
	};
};
