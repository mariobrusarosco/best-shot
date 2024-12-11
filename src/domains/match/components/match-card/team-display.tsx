import { APP_MODE } from "@/domains/global/utils";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, Stack, styled } from "@mui/system";
import { IMatch } from "../../typing";

export const TeamDisplay = ({
	team,
	expanded,
}: {
	team: IMatch["home"] | IMatch["away"];
	expanded: boolean;
}) => {
	const logo = APP_MODE === "staging" ? "" : team.badge;

	return (
		<Display>
			{expanded ? (
				<Stack alignItems="center">
					<Typography textTransform="uppercase" variant="tag" color="teal.500">
						pos
					</Typography>
					<Typography variant="tag" color="neutral.100">
						{0}
					</Typography>
				</Stack>
			) : null}

			<Surface
				sx={{
					p: 0.5,
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
		gap: ${theme.spacing(1)};

		[data-venue="away"] &{
			flex-direction: row-reverse;
		}
	`,
);
