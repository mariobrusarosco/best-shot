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
	id: ITournament["id"];
	label: ITournament["label"];
	logo?: ITournament["logo"];
}

export const TournamentCard = (props: Props) => {
	const { id, label } = props;

	return (
		<Link
			to="/tournaments/$tournamentId/matches"
			params={{ tournamentId: id }}
			as="li"
		>
			<Surface
				sx={{
					display: "flex",
					backgroundColor: "black.800",
					borderRadius: 2,
					p: 2,
				}}
			>
				<Box
					sx={{
						display: "grid",
						gap: 2,
						flex: 1,
					}}
				>
					<TournamentLogo
						src={`https://api.sofascore.app/api/v1/unique-tournament/17/image/dark`}
					/>

					<Typography
						variant="label"
						color="neutral.100"
						textTransform="uppercase"
					>
						{label}
					</Typography>
				</Box>

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
			</Surface>
		</Link>
	);
};
