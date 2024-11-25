import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";

export const TeamDisplay = ({
	logoUrl,
	label,
	standing,
	expanded,
}: {
	logoUrl: string;
	label: string;
	standing?: string;
	expanded: boolean;
}) => {
	return (
		<Display>
			{expanded ? (
				<Box>
					<span>pos</span>
					{standing}
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
				<TeamLogo src={logoUrl} />
			</Surface>

			<Typography variant="caption">{label}</Typography>
		</Display>
	);
};

export const TeamLogo = styled("img")(() => ({
	display: "inline-flex",
	width: 14,
	height: 14,
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
