import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { AppCard } from "@/domains/ui-system/components/app-card/AppCard";
import { AppLinkCard } from "@/domains/ui-system/components/app-link-card";
import type { AppSurfaceProps } from "@/domains/ui-system/components/app-surface";
import type { ITournament } from "../schema";
import { TournamentLogo } from "./tournament-logo";

interface Props extends AppSurfaceProps {
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
