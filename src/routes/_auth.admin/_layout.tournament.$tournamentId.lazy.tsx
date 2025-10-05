import { Box, CircularProgress, IconButton, styled, Tooltip } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
	useAdminCreateMatches,
	useAdminCreateRounds,
	useAdminCreateStandings,
	useAdminCreateTeams,
	useAdminUpdateMatches,
	useAdminUpdateRounds,
	useAdminUpdateStandings,
	useAdminUpdateTeams,
} from "@/domains/admin/hooks";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";

export const Route = createLazyFileRoute("/_auth/admin/_layout/tournament/$tournamentId")({
	component: TournamentDetailPage,
});

const ActionButton = styled(IconButton)(({ theme }) => ({
	width: "48px",
	height: "48px",
	backgroundColor: theme.palette.black[700],
	border: `1px solid ${theme.palette.neutral[700]}`,
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

const ActionSection = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
	gap: theme.spacing(3),
	marginBottom: theme.spacing(4),
}));

const ActionGroup = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.black[800],
	border: `1px solid ${theme.palette.neutral[700]}`,
	borderRadius: theme.shape.borderRadius,
}));

const ActionGrid = styled(Box)(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: theme.spacing(2),
	marginTop: theme.spacing(2),
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
				<CircularProgress size={20} sx={{ color: "teal.500" }} />
			) : (
				<AppIcon name={icon} size="medium" />
			)}
		</ActionButton>
	</Tooltip>
);

function TournamentDetailPage() {
	const { tournamentId } = Route.useParams();

	// Tournament action hooks
	const createStandings = useAdminCreateStandings();
	const updateStandings = useAdminUpdateStandings();
	const createRounds = useAdminCreateRounds();
	const updateRounds = useAdminUpdateRounds();
	const createTeams = useAdminCreateTeams();
	const updateTeams = useAdminUpdateTeams();
	const createMatches = useAdminCreateMatches();
	const updateMatches = useAdminUpdateMatches();

	return (
		<Box
			sx={{
				p: 3,
				backgroundColor: "black.900",
				minHeight: "100vh",
			}}
		>
			{/* Header */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						width: 48,
						height: 48,
						borderRadius: 2,
						backgroundColor: "teal.500",
						color: "neutral.100",
					}}
				>
					<AppIcon name="Trophy" size="medium" />
				</Box>
				<Box>
					<AppTypography variant="h4" color="neutral.100" fontWeight="bold">
						Tournament Management
					</AppTypography>
					<AppTypography variant="body2" color="neutral.400" sx={{ mt: 0.5 }}>
						Manage all aspects of tournament: {tournamentId}
					</AppTypography>
				</Box>
			</Box>

			{/* Action Sections */}
			<ActionSection>
				{/* Standings Actions */}
				<ActionGroup>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<AppIcon name="Trophy" size="small" color="teal.500" />
						<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
							Standings Management
						</AppTypography>
					</Box>
					<AppTypography variant="body2" color="neutral.400" sx={{ mb: 3 }}>
						Create and update tournament standings from data provider
					</AppTypography>
					<ActionGrid>
						<ActionButtonWithLoading
							title="Create Standings"
							onClick={() => createStandings.mutate(tournamentId)}
							isPending={createStandings.isPending}
							tournamentId={tournamentId}
							variables={createStandings.variables}
							icon="Plus"
						/>
						<ActionButtonWithLoading
							title="Update Standings"
							onClick={() => updateStandings.mutate(tournamentId)}
							isPending={updateStandings.isPending}
							tournamentId={tournamentId}
							variables={updateStandings.variables}
							icon="Trophy"
						/>
					</ActionGrid>
				</ActionGroup>

				{/* Rounds Actions */}
				<ActionGroup>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<AppIcon name="ClockFilled" size="small" color="teal.500" />
						<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
							Rounds Management
						</AppTypography>
					</Box>
					<AppTypography variant="body2" color="neutral.400" sx={{ mb: 3 }}>
						Create and update tournament rounds structure
					</AppTypography>
					<ActionGrid>
						<ActionButtonWithLoading
							title="Create Rounds"
							onClick={() => createRounds.mutate(tournamentId)}
							isPending={createRounds.isPending}
							tournamentId={tournamentId}
							variables={createRounds.variables}
							icon="Plus"
						/>
						<ActionButtonWithLoading
							title="Update Rounds"
							onClick={() => updateRounds.mutate(tournamentId)}
							isPending={updateRounds.isPending}
							tournamentId={tournamentId}
							variables={updateRounds.variables}
							icon="ClockFilled"
						/>
					</ActionGrid>
				</ActionGroup>

				{/* Teams Actions */}
				<ActionGroup>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<AppIcon name="Users" size="small" color="teal.500" />
						<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
							Teams Management
						</AppTypography>
					</Box>
					<AppTypography variant="body2" color="neutral.400" sx={{ mb: 3 }}>
						Create and update tournament teams and participants
					</AppTypography>
					<ActionGrid>
						<ActionButtonWithLoading
							title="Create Teams"
							onClick={() => createTeams.mutate(tournamentId)}
							isPending={createTeams.isPending}
							tournamentId={tournamentId}
							variables={createTeams.variables}
							icon="Plus"
						/>
						<ActionButtonWithLoading
							title="Update Teams"
							onClick={() => updateTeams.mutate(tournamentId)}
							isPending={updateTeams.isPending}
							tournamentId={tournamentId}
							variables={updateTeams.variables}
							icon="Users"
						/>
					</ActionGrid>
				</ActionGroup>

				{/* Matches Actions */}
				<ActionGroup>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
						<AppIcon name="LayoutDashboard" size="small" color="teal.500" />
						<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
							Matches Management
						</AppTypography>
					</Box>
					<AppTypography variant="body2" color="neutral.400" sx={{ mb: 3 }}>
						Create and update tournament matches and fixtures
					</AppTypography>
					<ActionGrid>
						<ActionButtonWithLoading
							title="Create Matches"
							onClick={() => createMatches.mutate(tournamentId)}
							isPending={createMatches.isPending}
							tournamentId={tournamentId}
							variables={createMatches.variables}
							icon="Plus"
						/>
						<ActionButtonWithLoading
							title="Update Matches"
							onClick={() => updateMatches.mutate(tournamentId)}
							isPending={updateMatches.isPending}
							tournamentId={tournamentId}
							variables={updateMatches.variables}
							icon="LayoutDashboard"
						/>
					</ActionGrid>
				</ActionGroup>
			</ActionSection>

			{/* Info Section */}
			<Box
				sx={{
					backgroundColor: "black.800",
					border: "1px solid",
					borderColor: "neutral.700",
					borderRadius: 2,
					p: 3,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
					<AppIcon name="Info" size="small" color="teal.500" />
					<AppTypography variant="h6" color="neutral.100" fontWeight="medium">
						Tournament Information
					</AppTypography>
				</Box>

				<AppTypography variant="body2" color="neutral.300" sx={{ mb: 2 }}>
					Tournament ID:{" "}
					<Box component="span" sx={{ color: "teal.500", fontFamily: "monospace" }}>
						{tournamentId}
					</Box>
				</AppTypography>

				<AppTypography variant="body2" color="neutral.400">
					Use the action buttons above to manage different aspects of this tournament. Each action
					will fetch or update data from the configured data provider.
				</AppTypography>
			</Box>
		</Box>
	);
}
