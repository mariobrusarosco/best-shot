import { ILeague } from "@/domains/league/typing";
import { AppIcon } from "@/domains/ui-system/components/icon/icon";
import { AppLinkCard } from "@/domains/ui-system/components/link-card/link-card";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";

export const LeaguesList = ({ leagues }: { leagues: ILeague[] }) => {
	return (
		<GridOfCards
			component="ul"
			data-ui="leagues-list"
			sx={{
				maxHeight: "260px",
				overflow: "auto",
				pb: 2,
			}}
		>
			{leagues?.map((league: ILeague) => (
				<li>
					<AppLinkCard
						to="/leagues/$leagueId"
						params={{ leagueId: league.id }}
						key={league.label}
						adornment={
							<Box color="teal.500">
								<AppIcon name="Users" size="small" />
							</Box>
						}
						replace={false}
						resetScroll={false}
					>
						<Typography variant="label" textTransform="uppercase">
							{league.label}
						</Typography>
					</AppLinkCard>
				</li>
			))}
		</GridOfCards>
	);
};

const GridOfCards = styled(Box)(({ theme }) =>
	theme.unstable_sx({
		borderRadius: 1,
		display: "grid",
		gap: {
			all: 2,
			tablet: 3,
		},
		gridAutoColumns: "47%",
		gridAutoRows: "110px",
		gridAutoFlow: "column",
		// gridTemplateRows: "auto auto",
		// gridTemplateColumns: "47% 47%",
	}),
);
