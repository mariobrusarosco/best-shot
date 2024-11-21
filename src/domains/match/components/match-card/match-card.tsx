import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Pill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Box, styled } from "@mui/system";

interface Props {
	logoUrl: string;
}

export const MatchCard = (props: Props) => {
	const { logoUrl } = props;

	return (
		<Surface
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				bgcolor: "black.800",
				borderRadius: 2,
				px: 1,
				py: 1.5,
				gap: 1.5,
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					gap: 1,
				}}
			>
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

						<Typography variant="tag">COR</Typography>
					</Box>

					<Pill bgcolor="black.500" minWidth={40} height={20}>
						<Typography variant="tag">-</Typography>
					</Pill>
				</Box>

				<Box
					sx={{
						display: "flex",
						gap: 1,
						alignItems: "center",
					}}
				>
					<Pill bgcolor="black.500" minWidth={40} height={20}>
						<Typography variant="tag">-</Typography>
					</Pill>

					<Box
						sx={{
							gap: 0.5,
							display: "flex",
							alignItems: "center",
						}}
					>
						<Typography variant="tag">COR</Typography>

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
					</Box>
				</Box>
			</Box>

			<Divider
				sx={{ bgcolor: "black.500", height: 40 }}
				orientation="vertical"
			/>

			<Box ml="auto">
				<Button
					sx={{
						borderRadius: "50%",
						color: "neutral.100",
						backgroundColor: "teal.500",
						width: 24,
						height: 24,
					}}
				>
					<AppIcon name="ChevronRight" size="tiny" />
				</Button>
			</Box>
		</Surface>
	);
};

export const TeamLogo = styled("img")(() => ({
	display: "inline-flex",
	width: 14,
	height: 14,
}));
