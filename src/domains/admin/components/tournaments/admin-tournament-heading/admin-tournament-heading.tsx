import { TournamentLogo } from "@/domains/tournament/components/tournament-heading";
import { AppTypography } from "@/domains/ui-system/components";
import { Box } from "@mui/material";
import { ITournament } from "@/domains/tournament/schemas";

export const AdminTournamentHeading = ({ tournament }: { tournament: ITournament }) => {
	return (
		<Box
			data-ui="admin-tournament-page"
			sx={{
				p: 3,
				backgroundColor: "black.900",
				minHeight: "100vh",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
				<TournamentLogo src={tournament.logo} />
				<Box>
					<AppTypography variant="h4" color="neutral.100" fontWeight="bold">
						{tournament.label}
					</AppTypography>
					<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
						season {tournament.season}
					</AppTypography>
				</Box>
			</Box>
		</Box>
	);
};
