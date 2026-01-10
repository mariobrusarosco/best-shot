import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppCard } from "@/domains/ui-system/components/app-card/AppCard";
import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import type { SurfaceProps } from "@/domains/ui-system/components/surface/surface";
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
				adornment={<TournamentLogo src={tournament.logo} />}
				replace={false}
				resetScroll={false}
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
			<AppCard loading />
		</Box>
	);
};
