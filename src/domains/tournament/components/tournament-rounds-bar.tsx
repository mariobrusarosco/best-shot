import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";

export const TournamentRoundsBar = () => {
	return (
		<Surface
			sx={{
				display: "flex",
				flexDirection: "column",
				backgroundColor: "black.800",
				borderRadius: 2,
				p: 2,
				pb: 1,
				gap: 2,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexGrow: 1,
					gap: 2,
				}}
			>
				<Typography
					variant="topic"
					color="neutral.100"
					textTransform="uppercase"
				>
					rounds
				</Typography>

				<Button
					sx={{
						color: "teal.500",
						display: "flex",
						placeItems: "center",
						p: 1,
						gap: 1,
					}}
				>
					<Typography
						variant="tag"
						color="neutral.100"
						textTransform="uppercase"
					>
						standings
					</Typography>
					<AppIcon name="ChevronRight" size="extra-small" />
				</Button>
			</Box>

			<Box
				sx={{
					display: "grid",
					gridAutoFlow: "column",
					overflow: "auto",
					gap: 1.5,
					pb: 2,
				}}
			>
				{Array.from({ length: 38 }).map((_, i) => (
					<Button
						sx={{
							color: "teal.500",
							p: 1,
							borderRadius: 1,
							width: 32,
							height: 32,
							display: "grid",
							borderColor: "teal.500",
							borderWidth: "1px",
							borderStyle: "solid",
						}}
					>
						<Typography variant="label" color="neutral.100">
							{i}
						</Typography>
					</Button>
				))}
			</Box>
		</Surface>
	);
};
