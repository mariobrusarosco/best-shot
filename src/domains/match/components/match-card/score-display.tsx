import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, styled, Typography } from "@mui/material";
import { IMatch } from "../../typing";

export const ScoreDisplay = ({
	matchVenueData,
}: {
	matchVenueData: IMatch["home"] | IMatch["away"];
}) => {
	return (
		<Wrapper data-ui="score-display">
			<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
				<Typography variant="tag">{matchVenueData.score ?? "-"}</Typography>
			</AppPill.Component>
			{matchVenueData.penaltiesScore !== null ? (
				<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
					<Typography variant="tag">
						{matchVenueData.penaltiesScore ?? "-"}
					</Typography>
				</AppPill.Component>
			) : null}
		</Wrapper>
	);
};

export const Wrapper = styled(Box)(() => ({
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	alignItems: "center",
	gap: 1,
	width: "30px",

	"[data-card-open='true'] &": {
		display: "none",
	},
}));
