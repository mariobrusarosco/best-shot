import { Button } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import fakeLogo from "@/domains/ui-system/components/icon/system-icons/copa-do-brasil.svg";
import {
	Surface,
	SurfaceProps,
} from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";
import { ITournament } from "../typing";
import { TournamentLogo } from "./tournament-logo";

interface Props extends SurfaceProps {
	id: ITournament["id"];
	label: ITournament["label"];
	logo?: ITournament["logo"];
}

export const TournamentCard = forwardRef<HTMLDivElement, Props>((props) => {
	const { id, label, logo, ...rest } = props;

	return (
		<Link to="/tournaments/$tournamentId" params={{ tournamentId: id }} as="li">
			<Surface
				{...rest}
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
					<TournamentLogo src={fakeLogo} />
					{logo}
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
});

TournamentCard.displayName = "TournamentCard";
