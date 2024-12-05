import { APP_MODE } from "@/domains/global/utils";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { IMatch } from "../../typing";

export const TeamDisplay = ({
	team,
	expanded,
}: {
	team: IMatch["home"] | IMatch["away"];
	expanded: boolean;
}) => {
	const logo = APP_MODE === "local-dev" ? "" : team.badge;

	return (
		<Display>
			{expanded ? (
				<Box>
					<Typography variant="caption">pos</Typography>
					{0}
				</Box>
			) : null}

			<Surface
				sx={{
					p: 1,
					borderRadius: 1,
					bgcolor: "black.500",
					display: "grid",
					placeItems: "center",
				}}
			>
				<TeamLogo src={logo} />
			</Surface>

			<Typography variant="caption">{team.shortName}</Typography>
		</Display>
	);
};

export const TeamLogo = styled("img")(() => ({
	display: "inline-flex",
	width: 16,
	height: 16,
}));

export const Display = styled(Box)(
	({ theme }) => `
		display: flex;	
		align-items: center;
		gap: ${theme.spacing(0.5)};

		[data-venue="away"] &{
			flex-direction: row-reverse;
		}
	`,
);
