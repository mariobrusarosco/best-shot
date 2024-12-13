import { ITournament } from "@/domains/tournament/typing";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import Divider from "@mui/material/Divider/Divider";
import Typography from "@mui/material/Typography/Typography";
import { Box, Stack, styled } from "@mui/system";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { updateLeagueTournaments } from "../../server-side/mutations";
import { ILeague } from "../../typing";

export const LeagueTournamentCustomization = ({
	currentTournaments,
	allTournaments,
	league,
}: {
	currentTournaments: ITournament[];
	allTournaments: ITournament[];
	league: ILeague;
}) => {
	const [tracked, setTracked] = useState(currentTournaments);
	const [untracked, setUntracked] = useState(
		allTournaments.filter((t) => !tracked.find((ct) => ct.id === t.id)),
	);
	const navigate = useNavigate();
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
			navigate({
				search: {
					editMode: false,
				} as any,
			});
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
			<Divider sx={{ bgcolor: "black.300" }} />

			<Stack gap={1}>
				<Box
					color="neutral.100"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
					mb={1}
				>
					<Typography
						textTransform="uppercase"
						variant="label"
						color="teal.500"
						fontWeight={600}
					>
						tracked
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

				<ListGrid>
					{noTournamentIncluded && (
						<Typography variant="label" color="neutral.100" fontWeight={400}>
							you haven't selected a tournament
						</Typography>
					)}

					{tracked?.map((tournament) => (
						<Card>
							<CardHeading>
								<Typography
									variant="tag"
									textAlign="center"
									color="neutral.100"
								>
									{tournament.label}
								</Typography>

								{/* TODO Standard Logo usage */}
								<LogoBox>
									<img src={tournament.logo} />
								</LogoBox>
							</CardHeading>

							<CTABox>
								<AppIcon
									name="Plus"
									size="extra-small"
									onClick={() => addTournament(tournament)}
								/>
								<AppIcon
									name="Minus"
									size="extra-small"
									onClick={() => removeTournament(tournament)}
								/>
							</CTABox>
						</Card>
					))}
				</ListGrid>
			</Stack>

			<Divider sx={{ bgcolor: "black.300" }} />

			<Stack gap={1}>
				<Typography
					textTransform="uppercase"
					variant="label"
					color="red.400"
					fontWeight={600}
				>
					not tracked
				</Typography>

				<ListGrid>
					{untracked?.map((tournament) => (
						<Card>
							<CardHeading>
								<Typography
									variant="tag"
									textAlign="center"
									color="neutral.100"
								>
									{tournament.label}
								</Typography>

								<LogoBox>
									<img src={tournament.logo} />
								</LogoBox>
							</CardHeading>

							<CTABox>
								<AppIcon
									name="Plus"
									size="extra-small"
									onClick={() => addTournament(tournament)}
								/>
								<AppIcon
									name="Minus"
									size="extra-small"
									onClick={() => removeTournament(tournament)}
								/>
							</CTABox>
						</Card>
					))}
				</ListGrid>
			</Stack>
		</Stack>
	);
};

const ListGrid = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		gap: 1,
		flexWrap: "wrap",
	}),
);

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "black.800",
		height: "100px",
		width: "105px",
		py: 1,
		px: 1,
		borderRadius: 2,
		gap: 2,
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
		flex: 1,
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

const CTABox = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "25px",
		gap: 3,
	}),
);

const SaveButton = styled(AppButton)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "teal.500",
		color: "neutral.100",
		p: 1,
		borderRadius: 2,
		maxWidth: "180px",

		"[aria-disabled='true']&": {
			opacity: 0.6,
		},
	}),
);
