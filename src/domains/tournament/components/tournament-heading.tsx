import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { UIHelper } from "@/domains/ui-system/theme";

interface Props {
	isLoading: boolean;
}

export const TournamentHeading = ({ isLoading }: Props) => {
	if (isLoading) return <Skeleton />;

	return (
		<Container data-ui="tournament-heading">
			<Typography variant="h4">PREMIER LEAGUE 26</Typography>
		</Container>
	);
};

const Container = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.neutral[200],
	padding: theme.spacing(2.5, 2),
	borderRadius: theme.borderRadius.medium,

	[UIHelper.whileIs("mobile")]: {
		// TODO
	},
	[UIHelper.startsOn("tablet")]: {
		display: "flex",
		justifyContent: "space-between",
		gap: theme.spacing(2),
	},
}));

export const TournamentLogo = styled("img")(() => ({}));

export const Skeleton = () => {
	return <Container data-ui="tournament-heading-skeleton"></Container>;
};
