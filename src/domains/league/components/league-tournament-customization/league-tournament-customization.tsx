import { Box, Divider, Stack, styled, Tooltip, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { ITournament } from "@/domains/tournament/schema";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { updateLeagueTournaments } from "../../server-side/mutations";
import type { ILeague } from "../../typing";

export const LeagueTournamentCustomization = ({
	currentTournaments,
	allTournaments,
	league,
	onUpdate,
}: {
	currentTournaments: ITournament[];
	allTournaments: ITournament[];
	league: ILeague;
	onUpdate?: () => void;
}) => {
	const [tracked, setTracked] = useState(currentTournaments);
	const [untracked, setUntracked] = useState(
		allTournaments.filter((t) => !tracked.find((ct) => ct.id === t.id))
	);
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: () =>
			updateLeagueTournaments(league.id, [
				...untracked.map((tournament) => ({
					tournamentId: tournament.id,
					leagueId: league.id,
					status: "untracked",
				})),
				...tracked.map((tournament) => ({
					tournamentId: tournament.id,
					leagueId: league.id,
					status: "tracked",
				})),
			]),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["leagues", { leagueId: league.id }],
			});
			onUpdate?.();
		},
	});

	// TODO Consider using a Set/Map + using tournament's ID and Logo only
	const addTournament = (tournament: ITournament) => {
		setTracked((prev) => {
			if (prev.find((t) => t.id === tournament.id)) return prev;
			return [...prev, tournament];
		});
		setUntracked((prev) => prev?.filter((t) => t.id !== tournament.id));
	};
	// TODO Consider using a Set/Map + using tournament's ID and Logo only
	const removeTournament = (tournament: ITournament) => {
		setUntracked((prev) => {
			if (prev.find((t) => t.id === tournament.id)) return prev;
			return [...prev, tournament];
		});
		setTracked((prev) => prev?.filter((t) => t.id !== tournament.id));
	};
	const noTournamentIncluded = tracked?.length === 0;

	return (
		<Stack mt={4} gap={2}>
			<Stack gap={1}>
				<Box
					color="neutral.100"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					pt={2}
				>
					<Box display="flex" gap={1}>
						<Typography textTransform="uppercase" variant="label" color="teal.500" fontWeight={600}>
							tracked
						</Typography>

						<Tooltip
							enterTouchDelay={0}
							leaveTouchDelay={1000}
							slotProps={{
								tooltip: {
									sx: {
										bgcolor: "teal.500",
										py: 2,
									},
								},
							}}
							title="These are the tournaments this league is taken into
									consideration when calculating the leaderboard."
						>
							<Box color="teal.500">
								<AppIcon name="Info" size="extra-small" />
							</Box>
						</Tooltip>
					</Box>

					<Box gap={0.5} display="flex" alignItems="center" justifyContent="space-between">
						<Typography
							variant="tag"
							color="neutral.100"
							fontWeight={700}
							textTransform="uppercase"
						>
							save
						</Typography>
						<SaveButton
							onClick={mutation.mutate}
							sx={{ p: 1 }}
							disabled={noTournamentIncluded || mutation.isPending}
							aria-disabled={noTournamentIncluded || mutation.isPending}
						>
							<AppIcon name="Save" size="extra-small" />
						</SaveButton>
					</Box>
				</Box>

				<ListGrid>
					{noTournamentIncluded && (
						<Typography variant="label" color="neutral.100" fontWeight={400}>
							you haven't selected a tournament
						</Typography>
					)}

					{tracked?.map((tournament) => (
						<TournamentLeagueCard
							tournament={tournament}
							onRemove={() => removeTournament(tournament)}
							status="tracked"
						/>
					))}
				</ListGrid>
			</Stack>

			<Divider sx={{ bgcolor: "black.300" }} />

			<Stack gap={1} mt={2}>
				<Box display="flex" gap={1}>
					<Typography textTransform="uppercase" variant="label" color="red.400" fontWeight={600}>
						untracked
					</Typography>

					<Tooltip
						enterTouchDelay={0}
						leaveTouchDelay={1000}
						slotProps={{
							tooltip: {
								sx: {
									bgcolor: "red.400",
									py: 2,
								},
							},
						}}
						title="These are the tournaments this league DOES NOT taken into
									consideration when calculating the leaderboard."
					>
						<Box color="red.400">
							<AppIcon name="Info" size="extra-small" />
						</Box>
					</Tooltip>
				</Box>

				<ListGrid>
					{untracked?.length === 0 ? (
						<Typography variant="label" color="neutral.100">
							This league is tracking all available tournaments
						</Typography>
					) : (
						untracked?.map((tournament) => (
							<TournamentLeagueCard
								tournament={tournament}
								onAdd={() => addTournament(tournament)}
								status="untracked"
							/>
						))
					)}
				</ListGrid>
			</Stack>

			<Divider sx={{ bgcolor: "black.300" }} />
		</Stack>
	);
};

export const TournamentLeagueCard = ({
	tournament,
	onAdd,
	onRemove,
	status = "read-only",
}: {
	tournament: ITournament;
	onAdd?: () => void;
	onRemove?: () => void;
	status?: "tracked" | "untracked" | "read-only";
}) => {
	return (
		<Card onClick={status === "tracked" ? onRemove : onAdd}>
			<CardHeading>
				<Typography variant="tag" textAlign="center" color="neutral.100">
					{tournament.label}
				</Typography>

				<LogoBox>
					<img src={tournament.logo} />
				</LogoBox>
			</CardHeading>

			{status === "tracked" ? (
				<IconBox bgcolor="red.400">
					<AppIcon name="Minus" size="tiny" />
				</IconBox>
			) : null}

			{status === "untracked" ? (
				<IconBox bgcolor="green.200">
					<AppIcon name="Plus" size="tiny" />
				</IconBox>
			) : null}
		</Card>
	);
};

const ListGrid = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		gap: 1,
		flexWrap: "wrap",
	})
);

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "black.800",
		minHeight: "40px",
		width: "48%",
		py: 1,
		px: 1,
		borderRadius: 2,
		gap: 1,
	})
);

const CardHeading = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		// flexDirection: "column",
		alignItems: "center",
		gap: 1,
		backgroundColor: "black.800",
		borderRadius: 3,
		flex: 1,
	})
);

const LogoBox = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		width: 14,
		height: 14,
		display: "grid",
		placeContent: "center",
	})
);

const IconBox = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		borderRadius: "8px",
		padding: 0.5,
		display: "grid",
		placeContent: "center",
	})
);

const SaveButton = styled(AppButton)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "teal.500",
		color: "neutral.100",
		p: 1,
		borderRadius: 2,

		"[aria-disabled='true']&": {
			opacity: 0.6,
		},
	})
);
