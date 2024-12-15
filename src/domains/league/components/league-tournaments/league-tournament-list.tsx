import { useLeague } from "@/domains/league/hooks/use-league";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { getRouteApi } from "@tanstack/react-router";
import { lazy } from "react";
import { TournamentLeagueCard } from "../league-tournament-customization/league-tournament-customization";
const LeagueTournamentCustomization = lazy(() =>
	import(
		"../league-tournament-customization/league-tournament-customization"
	).then((module) => ({ default: module.LeagueTournamentCustomization })),
);

const route = getRouteApi("/_auth/leagues/$leagueId/");

export const LeagueTournaments = ({
	league,
}: {
	league: ReturnType<typeof useLeague>["league"];
}) => {
	const { editMode } = route.useSearch() as { editMode: boolean };
	const navigate = route.useNavigate();
	const { data: allAppAvailableTournamens } = useTournaments();
	const toggleEditMode = () => {
		navigate({
			search: (prev: { editMode: boolean }) => ({
				...prev,
				editMode: !prev.editMode,
			}),
			replace: true,
			resetScroll: false,
		});
	};

	const isEmptyState =
		league?.isSuccess && league.data?.tournaments.length === 0;
	const hasPermissionToEdit = league?.data?.permissions.edit;

	return (
		<Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<AppPill.Component
					bgcolor="teal.500"
					color="neutral.100"
					width={100}
					height={25}
				>
					<Typography variant="tag">Tournaments</Typography>
				</AppPill.Component>

				{hasPermissionToEdit ? (
					<EmptyStartButton onClick={toggleEditMode} sx={{ p: 1 }}>
						<AppIcon name="Settings" size="extra-small" />
					</EmptyStartButton>
				) : null}
			</Box>

			{isEmptyState && !editMode && (
				<EmptyState>
					<Typography variant="caption">
						It seems you don't have selected any tournament to be used on this
						league scout
					</Typography>
				</EmptyState>
			)}

			{editMode && allAppAvailableTournamens && league.data && (
				<LeagueTournamentCustomization
					currentTournaments={league?.data?.tournaments}
					allTournaments={allAppAvailableTournamens}
					league={league.data}
				/>
			)}

			{!editMode && allAppAvailableTournamens && league.data && (
				<ListGrid component="ul" data-ui="league-tournament-list">
					{league?.data?.tournaments.map((tournament) => (
						<TournamentLeagueCard tournament={tournament} />
					))}
				</ListGrid>
			)}
		</Box>
	);
};

const EmptyState = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		flexDirection: "column",
		backgroundColor: "black.800",
		borderRadius: 2,
		gap: 4,
		px: 2,
		py: 4,
		mt: 4,
		color: "neutral.100",
	}),
);

const EmptyStartButton = styled(AppButton)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "teal.500",
		color: "neutral.100",
		p: 1,
		borderRadius: 2,
		maxWidth: "180px",
	}),
);

const ListGrid = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		gap: 1,
		flexWrap: "wrap",
	}),
);
