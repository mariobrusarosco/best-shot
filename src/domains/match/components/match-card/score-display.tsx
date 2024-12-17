import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Box, styled, Typography } from "@mui/material";

export const ScoreDisplay = ({
	value,
	expanded,
}: {
	value: number | null;
	expanded: boolean;
}) => {
	return (
		<Wrapper>
			{expanded ? (
				<Typography textTransform="uppercase" variant="tag">
					score
				</Typography>
			) : null}
			<AppPill.Component bgcolor={"black.500"} minWidth={30} height={20}>
				<Typography variant="tag">{value ?? "-"}</Typography>
			</AppPill.Component>
		</Wrapper>
	);
};

export const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		gap: 1,

		"[data-open='true'] &": {
			order: 2,
		},
		"[data-open='true'] [data-venue='away'] &": {
			flexDirection: "row-reverse",
		},

		"[data-open='true'][data-guess-status='waiting_for_game'] &": {
			display: "none",
		},
	}),
);
