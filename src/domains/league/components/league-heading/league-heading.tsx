import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, useMediaQuery } from "@mui/system";
import { useLeagues } from "../../hooks/use-leagues";

const { startsOn } = UIHelper.media;

interface Props {
	league: ReturnType<typeof useLeagues>["leagues"]["data"][number];
}

export const LeagueHeading = ({ league }: Props) => {
	const isDesktopScreen = useMediaQuery(startsOn("desktop"));

	const titleVariant = isDesktopScreen ? "h1" : "h6";

	return (
		<Box
			data-ui="tournament-heading"
			sx={{
				marginTop: 1,
				display: "flex",
				alignItems: "center",
				gap: 2,
				color: "teal.500",
				mb: 6,
			}}
		>
			<AppIcon name="Users" size="medium" />
			<Typography
				color="neutral.100"
				variant={titleVariant}
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

// export const TournamentLogo = styled("img")(() => ({
// 	display: "inline-flex",
// }));
