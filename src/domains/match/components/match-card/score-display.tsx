import { Box, styled, Typography } from "@mui/material";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import type { IMatch } from "../../typing";

export const ScoreDisplay = ({
	matchVenueData,
}: {
	matchVenueData: IMatch["home"] | IMatch["away"];
}) => {
	if (!matchVenueData.score) return null;

	return (
		<Wrapper data-ui="score-display">
			<Typography textTransform="uppercase" variant="tag" fontWeight={500} color="teal.400">
				score
			</Typography>
			<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
				<Typography variant="tag">{matchVenueData.score ?? "-"}</Typography>
			</AppPill.Component>
			{matchVenueData.penaltiesScore !== null ? (
				<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
					<Typography variant="tag">{matchVenueData.penaltiesScore ?? "-"}</Typography>
				</AppPill.Component>
			) : null}
		</Wrapper>
	);
};

export const Wrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: theme.spacing(0.5),
	//   width: "30px",

	"[data-card-open='true'] &": {
		display: "none",
	},
}));
