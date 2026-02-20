import { Box, CircularProgress, IconButton, styled, Tooltip, Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import {
	useAdminCreateMatches,
	useAdminCreateRounds,
	useAdminCreateStandings,
	useAdminCreateTeams,
	useAdminTournament,
	useAdminUpdateKnockoutRounds,
	useAdminUpdateMatches,
	useAdminUpdateRoundMatches,
	useAdminUpdateRounds,
	useAdminUpdateStandings,
	useAdminUpdateTeams,
} from "@/domains/admin/hooks";
import { ScreenHeadingSkeleton } from "@/domains/global/components/screen-heading";
import { AppIcon, AppTypography } from "@/domains/ui-system/components";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { useNotification } from "@/domains/ui-system/components/notification/notification-context";
import { AppPill } from "@/domains/ui-system/components/pill/pill";

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

	const [roundIdInput, setRoundIdInput] = useState<string | null>(null);
	const handleRoundIdInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoundIdInput(event.target.value);
	};
	const { data: tournamentData, isLoading, error } = useAdminTournament(tournamentId);
	const { showNotification } = useNotification();

	// Tournament action hooks
	const createStandings = useAdminCreateStandings();
	const updateStandings = useAdminUpdateStandings();
	const createRounds = useAdminCreateRounds();
	const updateRounds = useAdminUpdateRounds();
	const createTeams = useAdminCreateTeams();
	const updateTeams = useAdminUpdateTeams();
	const createMatches = useAdminCreateMatches();
	const updateMatches = useAdminUpdateMatches();
	const updateKnockoutRounds = useAdminUpdateKnockoutRounds();
	const updateRoundMatches = useAdminUpdateRoundMatches();

	const mutateWithFeedback = useCallback(
		<TVariables,>(mutation: { mutate: (variables: TVariables, options?: { onSuccess?: () => void; onError?: (error: Error) => void }) => void }, variables: TVariables, label: string) => {
			mutation.mutate(variables, {
				onSuccess: () => showNotification(`${label} completed successfully`, "success"),
				onError: (err) => showNotification(`Failed to ${label.toLowerCase()}: ${err.message}`, "error"),
			});
		},
		[showNotification]
	);

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
						Teams
					</Typography>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Teams"
								onClick={() => mutateWithFeedback(createTeams, tournamentId, "Create Teams")}
								isPending={createTeams.isPending}
								tournamentId={tournamentId}
								variables={createTeams.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Update Teams"
								onClick={() => mutateWithFeedback(updateTeams, tournamentId, "Update Teams")}
								isPending={updateTeams.isPending}
								tournamentId={tournamentId}
								variables={updateTeams.variables}
								icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard
					sx={{
						cursor: tournamentData?.mode === "knockout-only" ? "not-allowed" : "auto",
						opacity: tournamentData?.mode === "knockout-only" ? 0.7 : 1,
					}}
				>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Standings
					</Typography>

					{tournamentData?.mode === "knockout-only" && (
						<AppTypography variant="label" color="neutral.100">
							Knockout tournaments do not have standings
						</AppTypography>
					)}

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Standings"
								onClick={() => mutateWithFeedback(createStandings, tournamentId, "Create Standings")}
								isPending={createStandings.isPending}
								tournamentId={tournamentId}
								variables={createStandings.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Update Standings"
								onClick={() => mutateWithFeedback(updateStandings, tournamentId, "Update Standings")}
								isPending={updateStandings.isPending}
								tournamentId={tournamentId}
								variables={updateStandings.variables}
								icon="Trophy"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Rounds
					</Typography>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Rounds"
								onClick={() => mutateWithFeedback(createRounds, tournamentId, "Create Rounds")}
								isPending={createRounds.isPending}
								tournamentId={tournamentId}
								variables={createRounds.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Update Rounds"
								onClick={() => mutateWithFeedback(updateRounds, tournamentId, "Update Rounds")}
								isPending={updateRounds.isPending}
								tournamentId={tournamentId}
								variables={updateRounds.variables}
								icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Matches
					</Typography>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Create
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Create Matches"
								onClick={() => mutateWithFeedback(createMatches, tournamentId, "Create Matches")}
								isPending={createMatches.isPending}
								tournamentId={tournamentId}
								variables={createMatches.variables}
								icon="Plus"
							/>
						</AppPill.Component>
					</Box>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Update all
						</AppTypography>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Update Matches"
								onClick={() => mutateWithFeedback(updateMatches, tournamentId, "Update Matches")}
								isPending={updateMatches.isPending}
								tournamentId={tournamentId}
								variables={updateMatches.variables}
								icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>

						<AppInput
							type="text"
							id="round-id"
							name="round-id"
							value={roundIdInput}
							onChange={handleRoundIdInput}
						/>
						<AppPill.Component bgcolor={"teal.500"}>
							<ActionButtonWithLoading
								title="Update Round Matches"
								onClick={() =>
									mutateWithFeedback(updateRoundMatches, { tournamentId, roundId: roundIdInput || "" }, "Update Round Matches")
								}
								isPending={updateRoundMatches.isPending}
								tournamentId={tournamentId}
								icon="ClockFilled"
							/>
						</AppPill.Component>
					</Box>
				</ActionsCard>

				<ActionsCard>
					<Typography variant="h6" color="neutral.100" fontWeight="medium">
						Knockout Rounds
					</Typography>

					<Box
						sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "space-between" }}
					>
						<AppTypography variant="body2" color="neutral.300">
							Update
						</AppTypography>
					</Box>

					<AppPill.Component bgcolor={"teal.500"}>
						<ActionButtonWithLoading
							title="Update Knockout Rounds"
							onClick={() => mutateWithFeedback(updateKnockoutRounds, tournamentId, "Update Knockout Rounds")}
							isPending={updateKnockoutRounds.isPending}
							tournamentId={tournamentId}
							variables={updateKnockoutRounds.variables}
							icon="ClockFilled"
						/>
					</AppPill.Component>
				</ActionsCard>
			</Box>
		</Box>
	);
}
