import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import {
	Surface,
	SurfaceProps,
} from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { Link } from "@tanstack/react-router";
import { ITournament } from "../typing";
import { TournamentLogo } from "./tournament-logo";

interface Props extends SurfaceProps {
	tournament: ITournament;
}

export const TournamentCard = ({ tournament }: Props) => {
	const { label, id } = tournament;

	return (
		<Link
			to="/tournaments/$tournamentId/matches"
			params={{ tournamentId: id }}
			search={{ round: 1 }}
			as="li"
		>
			<Surface
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					gap: 2,
					backgroundColor: "black.800",
					borderRadius: 2,
					p: 2,
					height: 120,
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
					}}
				>
					<TournamentLogo src={tournament.logo} />

					<Button
						sx={{
							color: "teal.500",
							p: 1,
							borderRadius: "50%",
							width: 32,
							height: 32,
							display: "grid",
							placeItems: "center",
						}}
					>
						<AppIcon name="ChevronRight" size="extra-small" />
					</Button>
				</Box>

				<Typography
					variant="label"
					color="neutral.100"
					textTransform="uppercase"
					sx={{
						textOverflow: "ellipsis",
						overflow: "hidden",
						maxHeight: "50px",
						wordBreak: "break-word",
					}}
				>
					{label}
				</Typography>
			</Surface>
		</Link>
	);
};
