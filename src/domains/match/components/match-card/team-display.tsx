import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled, useMediaQuery } from "@mui/system";
import { IMatch } from "../../typing";

export const TeamDisplay = ({
	team,
	expanded,
}: {
	team: IMatch["home"] | IMatch["away"];
	expanded: boolean;
}) => {
	const isDesktopScreen = useMediaQuery(UIHelper.startsOn("desktop"));
	const displayFullname = expanded || isDesktopScreen;

	return (
		<Display>
			{expanded ? (
				<Position>
					<Typography textTransform="uppercase" variant="tag" color="teal.500">
						pos
					</Typography>
					<Typography variant="tag" color="neutral.100">
						{0}
					</Typography>
				</Position>
			) : null}

			<TeamBox>
				<TeamLogoBox>
					<TeamLogo src={team.badge} />
				</TeamLogoBox>

				<Typography variant="caption">
					{displayFullname ? team.name : team.shortName}
				</Typography>
			</TeamBox>
		</Display>
	);
};

export const Display = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		alignItems: "center",
		gap: 1,

		"[data-open='true'] &": {
			order: 1,
			flexDirection: "column",
			alignItems: "flex-start",
		},

		// "[data-open='true'] [data-venue='away'] &": {
		// 	alignItems: "flex-end",
		// },
	}),
);

export const TeamBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		placeItems: "center",
		gap: 0.5,
	}),
);

export const TeamLogoBox = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		p: 0.5,
		borderRadius: 1,
		bgcolor: "black.500",
		display: "grid",
		placeItems: "center",
	}),
);

export const TeamLogo = styled("img")(({ theme }) =>
	theme?.unstable_sx({
		display: "inline-flex",
		width: 16,
		height: 16,
	}),
);

export const Position = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		alignItems: "center",
		gap: 1,
	}),
);
