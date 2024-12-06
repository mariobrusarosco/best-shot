import { ScreenHeading } from "@/domains/global/components/screen-heading";
import { useLeageScore } from "@/domains/league/hooks/use-leagues-score";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import Typography from "@mui/material/Typography/Typography";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { ILeague } from "../../domains/league/typing";

const route = getRouteApi("/_auth/leagues/$leagueId");

// const detailedRanking = (scoreboard: any) => {
// 	Object.entries(scoreboard).forEach(([member, points]) => {
// 		console.log(member, points);
// 	});
// };

const LeaguePage = () => {
	const leagues = useQuery({
		queryKey: ["leagues"],
		enabled: false,
	}) as { data: ILeague[] };
	const leagueId = route.useParams().leagueId;
	const leagueName = leagues.data?.find(
		(league: ILeague) => league.id === leagueId,
	)?.label;

	const { data } = useLeageScore(leagueId);
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

	console.log("scoreboard", data);

	return (
		<Box data-ui="leagues-screen screen">
			<ScreenHeading title="league" withBackButton tagText={leagueName} />

			<Box pt={[6, 10]} pb={14} px={[2, 6]}>
				<Box
					sx={{
						display: "grid",
						py: 2,
						gap: 1,
					}}
				>
					<Typography
						sx={{
							mb: 3,
						}}
						textTransform="lowercase"
						variant="h3"
						color="neutral.100"
					>
						{leagueName}
					</Typography>
				</Box>

				<div className="ranking">
					<Typography variant="h6" color="neutral.100">
						Ranking
					</Typography>

					<GridOfCards className="list">
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
					</GridOfCards>
				</div>
			</Box>
		</Box>
	);
};

export const Route = createLazyFileRoute("/_auth/leagues/$leagueId")({
	component: LeaguePage,
});
