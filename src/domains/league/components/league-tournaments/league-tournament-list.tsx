import { useLeague } from "@/domains/league/hooks/use-league";
import { ILeague } from "@/domains/league/typing";
import { useTournaments } from "@/domains/tournament/hooks/use-tournaments";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { getRouteApi } from "@tanstack/react-router";
import { lazy } from "react";
import { ListGrid } from "../league-performance-stats/league-performance-stats";
const LeagueTournamentCustomization = lazy(() =>
	import(
		"../league-tournament-customization/league-tournament-customization"
	).then((module) => ({ default: module.LeagueTournamentCustomization })),
);

const route = getRouteApi("/_auth/leagues/$leagueId/");

const getTournaments = (tournaments?: ILeague["tournaments"]) => {
	if (!tournaments) return [];

	return tournaments?.map((tournament) => tournament);
};

export const LeagueTournaments = ({
	league,
}: {
	league: ReturnType<typeof useLeague>["league"];
}) => {
	const { editMode } = route.useSearch() as { editMode: boolean };
	const navigate = route.useNavigate();
	const { data } = useTournaments();
	const toggleEditMode = () => {
		navigate({
			search: (prev: { editMode: boolean }) => ({
				...prev,
				editMode: !prev.editMode,
			}),
		});
	};

	console.log({ editMode, navigate });

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
				}}
			>
				<AppPill bgcolor="teal.500" color="neutral.100" width={100} height={25}>
					<Typography variant="tag">Tournaments</Typography>
				</AppPill>

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

			{editMode && data && league.data && (
				<LeagueTournamentCustomization
					currentTournaments={getTournaments(league?.data?.tournaments)}
					allTournaments={data}
					league={league.data}
				/>
			)}

			<ListGrid component="ul" data-ui="league-tournament-list">
				{getTournaments(league?.data?.tournaments).map((tournament) => (
					<Card>
						<CardHeading>
							<Typography variant="tag" textAlign="center" color="neutral.100">
								{tournament.label}
							</Typography>

							<LogoBox>
								<img src={tournament.logo} />
							</LogoBox>
						</CardHeading>
					</Card>
				))}
			</ListGrid>
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

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "black.800",
		height: "80px",
		// py: 1,
		// px: 2,
		px: 0.5,
		borderRadius: 3,
	}),
);

const CardHeading = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 2,
		backgroundColor: "black.800",
		borderRadius: 3,
	}),
);

const LogoBox = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		width: 20,
		height: 20,
		display: "grid",
		placeContent: "center",
	}),
);
