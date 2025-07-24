import { Box, Typography, useMediaQuery } from "@mui/material";
import { UIHelper } from "@/theming/theme";
import type { useLeagues } from "../../hooks/use-leagues";

const { startsOn } = UIHelper;

interface Props {
	league: ReturnType<typeof useLeagues>["leagues"]["data"][number];
}

export const LeagueHeading = ({ league }: Props) => {
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h3";

	return (
		<Box
			data-ui="league-heading"
			sx={{
				marginTop: 1,
				display: "flex",
				alignItems: "center",
				gap: 2,
				color: "teal.500",
				mb: 6,
			}}
		>
			{/* <AppIcon name="Users" size="medium" /> */}
			<Typography
				color="neutral.100"
				variant={titleVariant}
				textTransform="lowercase"
				sx={{
					textOverflow: "ellipsis",
					overflow: "hidden",
					wordBreak: "break-word",
				}}
			>
				{league?.label}
			</Typography>
		</Box>
	);
};
