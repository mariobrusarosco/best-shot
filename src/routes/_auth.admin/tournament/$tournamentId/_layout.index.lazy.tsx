import { Box, CircularProgress, IconButton, styled, Tooltip, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
	useAdminCreateMatches,
	useAdminCreateRounds,
	useAdminCreateStandings,
	useAdminCreateTeams,
	useAdminTournament,
	useAdminUpdateMatches,
	useAdminUpdateRounds,
	useAdminUpdateStandings,
	useAdminUpdateTeams,
} from "@/domains/admin/hooks";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";

export const Route = createLazyFileRoute("/_auth/admin/tournament/$tournamentId/_layout/")({
	component: TournamentDetailPage,
});

const ActionButton = styled(IconButton)(({ theme }) => ({
	padding: theme.spacing(0.5),
	color: theme.palette.neutral[300],
	"&:hover": {
		backgroundColor: theme.palette.teal[500],
		color: theme.palette.neutral[100],
		borderColor: theme.palette.teal[500],
	},
	"&:disabled": {
		backgroundColor: theme.palette.black[700],
		color: theme.palette.neutral[500],
		cursor: "not-allowed",
	},
}));

const ActionsCard = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	border: "1px solid",
	borderColor: theme.palette.neutral[700],
	borderRadius: theme.spacing(2),
	padding: theme.spacing(3),
	marginBottom: theme.spacing(4),
	gap: theme.spacing(2),
	display: "grid",
	width: "180px",
}));


interface ActionButtonWithLoadingProps {
	title: string;
	onClick: () => void;
	isPending: boolean;
	tournamentId: string;
	variables?: string;
	icon: keyof typeof import("@/domains/ui-system/components/icon/mapper").ICONS;
}

const ActionButtonWithLoading = ({
	title,
	onClick,
	isPending,
	tournamentId,
	variables,
	icon,
}: ActionButtonWithLoadingProps) => (
	<Tooltip title={title} arrow>
		<ActionButton onClick={onClick} disabled={isPending}>
			{isPending && variables === tournamentId ? (
				<CircularProgress size={10} sx={{ color: "teal.500" }} />
			) : (
				<AppIcon name={icon} size="extra-small" />
			)}
		</ActionButton>
	</Tooltip>
);

function TournamentDetailPage() {
	const { tournamentId } = Route.useParams();

	const { data: tournamentData, isLoading, error } = useAdminTournament(tournamentId);

	// Tournament action hooks
	const createStandings = useAdminCreateStandings();
	const updateStandings = useAdminUpdateStandings();
	const createRounds = useAdminCreateRounds();
	const updateRounds = useAdminUpdateRounds();
	const createTeams = useAdminCreateTeams();
	const updateTeams = useAdminUpdateTeams();
	const createMatches = useAdminCreateMatches();
	const updateMatches = useAdminUpdateMatches();

	if (isLoading) {
		return <ScreenHeadingSkeleton />;
	}

	if (error) {
		throw error;
	}

	return (
		<Box
			sx={{
				p: 3,
				backgroundColor: "black.900",
				minHeight: "100vh",
			}}
		>
			<Box
				sx={{
					backgroundColor: "black.800",
					border: "1px solid",
					borderColor: "neutral.700",
					borderRadius: 2,
					p: 3,
					mb: 4,
				}}
			>
				{tournamentData && (
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<AppTypography variant="body2" color="neutral.300">
								Provider
							</AppTypography>
							<AppPill.Component bgcolor={"teal.500"}>
								<Typography
									variant="tag"
									textTransform="uppercase"
									color="neutral.100"
									fontWeight={500}
								>
									{tournamentData.provider}
								</Typography>
							</AppPill.Component>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<AppTypography variant="body2" color="neutral.300">
								Mode
							</AppTypography>
							<AppPill.Component bgcolor={"teal.500"}>
								<Typography
									variant="tag"
									textTransform="uppercase"
									color="neutral.100"
									fontWeight={500}
								>
									{tournamentData.mode}
								</Typography>
							</AppPill.Component>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<AppTypography variant="body2" color="neutral.300">
								Standings
							</AppTypography>
							<AppPill.Component bgcolor={"teal.500"}>
								<Typography
									variant="tag"
									textTransform="uppercase"
									color="neutral.100"
									fontWeight={500}
								>
									{tournamentData.standingsMode}
								</Typography>
							</AppPill.Component>
						</Box>
					</Box>
				)}
			</Box>

			<Box display="flex" gap={2}>
				<ActionsCard>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Standings
					</Typography>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Standings"
								onClick={() => createStandings.mutate(tournamentId)}
								isPending={createStandings.isPending}
								tournamentId={tournamentId}
								variables={createStandings.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Update Standings"
								onClick={() => updateStandings.mutate(tournamentId)}
								isPending={updateStandings.isPending}
								tournamentId={tournamentId}
								variables={updateStandings.variables}
								icon="Trophy"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard
					
				>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Rounds
					</Typography>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Rounds"
								onClick={() => createRounds.mutate(tournamentId)}
								isPending={createRounds.isPending}
								tournamentId={tournamentId}
								variables={createRounds.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
						<ActionButtonWithLoading
							title="Update Rounds"
							onClick={() => updateRounds.mutate(tournamentId)}
							isPending={updateRounds.isPending}
							tournamentId={tournamentId}
							variables={updateRounds.variables}
							icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard
					
				>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Teams
					</Typography>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Teams"
								onClick={() => createTeams.mutate(tournamentId)}
								isPending={createTeams.isPending}
								tournamentId={tournamentId}
								variables={createTeams.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
						<ActionButtonWithLoading
								title="Update Teams"
							onClick={() => updateTeams.mutate(tournamentId)}
							isPending={updateTeams.isPending}
							tournamentId={tournamentId}
							variables={updateTeams.variables}
							icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard
				>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Matches
					</Typography>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Matches"
								onClick={() => createMatches.mutate(tournamentId)}
								isPending={createMatches.isPending}
								tournamentId={tournamentId}
								variables={createMatches.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
						<ActionButtonWithLoading
								title="Update Matches"
							onClick={() => updateMatches.mutate(tournamentId)}
							isPending={updateMatches.isPending}
							tournamentId={tournamentId}
							variables={updateMatches.variables}
							icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>
			</Box>
		</Box>
	);
}
