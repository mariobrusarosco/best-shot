import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { LeagueHeading } from "@/domains/league/components/league-heading/league-heading";
import { ParticipantsList } from "@/domains/league/components/participants/participants-list";
import { ParticipantsListSkeleton } from "@/domains/league/components/participants/participants-list-skeleton";
import { useLeague } from "@/domains/league/hooks/use-league";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import Typography from "@mui/material/Typography/Typography";
import { Box } from "@mui/system";
import { createLazyFileRoute } from "@tanstack/react-router";

// const detailedRanking = (scoreboard: any) => {
// 	Object.entries(scoreboard).forEach(([member, points]) => {
// 		console.log(member, points);
// 	});
// };

const LeaguePage = () => {
	const { data: league, isLoading } = useLeague();

	// const scoreboard = data && (Object.entries(data) as [string, number][]);

	// const groupedByTournamentSlug = (data: any) => {
	// 	let TOTAL_POINTS = 0;

	// 	const grouped = data?.reduce((acc: any, item: any) => {
	// 		const key = item.member.id;
	// 		if (!acc[key]) {
	// 			acc[key] = {
	// 				tournaments: {},
	// 			};
	// 		}

	// 		acc[key]["t"];
	// 		// acc[key].push(item);
	// 		return acc;
	// 	}, {});
	// 	return grouped;
	// };

	// const groupyByMember =
	// 	data &&
	// 	Object.groupBy(data, (item) => {
	// 		debugger;
	// 		item = { slug: item.tournament.slug, name: "mario" };
	// 		return item.slug;
	// 	});

	console.log("league", league);
	// console.log("scoreboard", data);

	return (
		<Box data-ui="leagues-screen screen">
			<ScreenHeading title="league" withBackButton tagText={league?.label} />

			<Box pt={[6, 10]} pb={14} px={[2, 6]}>
				<LeagueHeading league={league} />

				<AppPill
					bgcolor="teal.500"
					color="neutral.100"
					width={100}
					height={25}
					mb={2}
				>
					<Typography variant="tag">Participants</Typography>
				</AppPill>

				<div data-ui="participants">
					{isLoading ? (
						<ParticipantsListSkeleton />
					) : (
						<ParticipantsList league={league} />
					)}
					{/* {data &&
							Object.entries(data).map(([member, points]) => (
								<Box key={member}>
									<Card>
										<Typography variant="h6">{member}</Typography>
									</Card>

									{points?.map((point) => (
										<Box
											sx={{
												color: "neutral.100",
												display: "flex",
												gap: 2,
												flexWrap: "wrap",
											}}
										>
											<Card key={point} sx={{ display: "flex", gap: 2 }}>
												<Typography variant="topic">home</Typography>
												<Typography variant="topic">{point.home}</Typography>
											</Card>
											<Card key={point} sx={{ display: "flex", gap: 2 }}>
												<Typography variant="topic">away</Typography>
												<Typography variant="topic">{point.away}</Typography>
											</Card>
											<Card key={point} sx={{ display: "flex", gap: 2 }}>
												<Typography variant="topic">outcome</Typography>
												<Typography variant="topic">{point.outcome}</Typography>
											</Card>
										</Box>
									))}
								</Box> */}
					{/* ))} */}
					{/* </ParticipantsList> */}
				</div>
			</Box>
		</Box>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId")({
	component: LeaguePage,
});
