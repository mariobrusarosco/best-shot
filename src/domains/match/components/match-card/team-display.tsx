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
		<Box
			sx={{
				display: "flex",
				gap: 1,
				alignItems: "center",
			}}
		>
			<Box
				sx={{
					gap: 0.5,
					display: "flex",
					alignItems: "center",
				}}
			>
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

				<Typography variant="tag">{label}</Typography>
			</Box>
		</Box>
	);
};

export const TeamLogo = styled("img")(() => ({
	display: "inline-flex",
	width: 14,
	height: 14,
}));
