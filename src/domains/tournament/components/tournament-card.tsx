import { Box, styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "@tanstack/react-router";
import type { ITournament } from "@/domains/tournament/schemas";
import { AppCard } from "@/domains/ui-system/components/app-card/AppCard";
import type { SurfaceProps } from "@/domains/ui-system/components/surface/surface";

interface Props extends SurfaceProps {
	tournament: ITournament;
}

export const TournamentCard = ({ tournament }: Props) => {
	const { label, id, season } = tournament;

	return (
		<Link
			to="/tournaments/$tournamentId"
			params={{ tournamentId: id }}
			replace={false}
			resetScroll={false}
		>
			<Card data-ui="tournament-card" as="li">
				<Box
					display="flex"
					flexDirection="column"
					gap={2}
					sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
				>
					<Typography
						variant="h6"
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

					<Typography variant="caption" color="neutral.100">
						{season}
					</Typography>
				</Box>

				<CardTournamentLogo src={tournament.logo} />
			</Card>
		</Link>
	);
};

export const Card = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",
	gap: theme.spacing(4),
	backgroundColor: theme.palette.black[200],
	borderRadius: theme.borderRadius.medium,
	padding: theme.spacing(2),
}));

export const CardTournamentLogo = styled("img")(() => ({
	display: "inline-flex",
	width: 52,
	height: 52,
}));

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
