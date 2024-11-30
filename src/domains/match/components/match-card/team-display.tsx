import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { ITeam } from "../../typing";

export const TeamDisplay = ({
	team,
	expanded,
}: {
	team: ITeam;
	expanded: boolean;
}) => {
	return (
		<Display>
			{expanded ? (
				<Box>
					<span>pos</span>
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
				<TeamLogo src={team?.badge} />
			</Surface>

			<Typography variant="caption">{team?.shortName}</Typography>
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
