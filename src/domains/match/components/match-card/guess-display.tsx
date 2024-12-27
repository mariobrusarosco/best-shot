import { GUESS_STATUS, IGuess } from "@/domains/guess/typing";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

interface Props {
	data: IGuess["away"] | IGuess["away"];
	cardExpanded: boolean;
}

export const GuessDisplay = ({ data, cardExpanded }: Props) => {
	if (cardExpanded || data.status === "expired") return null;

	const value = data.value;
	const { color } = getStylesByStatus(data?.status || null);

	return (
		<Wrapper color={color} data-ui="guess-display">
			<Typography textTransform="uppercase" variant="tag" color={color}>
				guess
			</Typography>
			<AppPill.Component
				minWidth={30}
				height={20}
				padding={0}
				sx={{ backgroundColor: "black.500" }}
			>
				<Typography variant="tag">{value ?? "-"}</Typography>
			</AppPill.Component>
		</Wrapper>
	);
};

export const Wrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	gap: theme.spacing(0.5),
	width: "35px",
}));

const getStylesByStatus = (status: GUESS_STATUS) => {
	if (status === "expired") {
		return {
			color: "red.400",
			bgColor: "transparent",
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
