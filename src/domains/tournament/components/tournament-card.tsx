import { AppCard } from "@/domains/ui-system/components/card/card";
import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import { SurfaceProps } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { ITournament } from "../typing";
import { TournamentLogo } from "./tournament-logo";

interface Props extends SurfaceProps {
	tournament: ITournament;
}

export const TournamentCard = ({ tournament }: Props) => {
	const { label, id } = tournament;

	return (
		<Box
			component="li"
			sx={{
				"> *": {
					display: "grid",
					height: "100%",
				},
			}}
		>
			<AppLinkCard
				to="/tournaments/$tournamentId/matches"
				params={{ tournamentId: id }}
				search={{ round: 1 }}
				adornment={<TournamentLogo src={tournament.logo} />}
			>
				<Typography
					variant="label"
					color="neutral.100"
					textTransform="uppercase"
					sx={{
						display: "block",
						textOverflow: "ellipsis",
						overflow: "hidden",
						wordBreak: "break-word",
						whiteSpace: "nowrap",
					}}
				>
					{label}
				</Typography>
			</AppLinkCard>
		</Box>
	);
};

export const TournamentCardSkeleton = () => {
	return (
		<Box
			component="li"
			sx={{
				"> *": {
					display: "grid",
					height: "100%",
				},
			}}
		>
			<AppCard.Skeleton />
		</Box>
	);
};
