import { GUESS_STATUS, IGuess } from "@/domains/guess/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

interface Props {
	data: IGuess["away"] | IGuess["away"];
}

export const GuessDisplay = ({ data }: Props) => {
	const value = getValueByStatus(data.value, data.status);
	const { color } = getStylesByStatus(data?.status || null);

	// if (data.status === "expired") return null;

	return (
		<Wrapper color={color}>
			<Typography textTransform="uppercase" variant="tag" color={color}>
				guess
			</Typography>

			{value}
		</Wrapper>
	);
};

export const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 0.5,

		"[data-open='true'] &": {
			order: 3,
			flexDirection: "row",
			justifyContent: "space-between",
		},
		"[data-open='true'] [data-venue='away'] &": {
			flexDirection: "row-reverse",
		},
	}),
);

const getStylesByStatus = (status: GUESS_STATUS) => {
	if (status === "expired") {
		return {
			color: "red.400",
			bgColor: "transparent",
			// opacity: 0.2,
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

const getValueByStatus = (value: number | null, status: GUESS_STATUS) => {
	if (status === "expired" || status === "not-started") {
		return <AppIcon name="Minus" size="tiny" />;
	}

	return (
		<AppPill.Component
			minWidth={30}
			height={20}
			padding={0}
			sx={{ backgroundColor: "black.500" }}
		>
			<Typography variant="tag">{value}</Typography>
		</AppPill.Component>
	);
};
