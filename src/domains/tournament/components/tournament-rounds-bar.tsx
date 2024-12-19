import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { UIHelper } from "@/theming/theme";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import { useTournamentRounds } from "../hooks/use-tournament-rounds";
import { ITournament } from "../typing";

const TournamentRoundsBar = ({ tournament }: { tournament: ITournament }) => {
	const { activeRound, goToRound } = useTournamentRounds();

	useEffect(() => {
		if (activeRound) {
			const el = document.querySelector("[data-active='true']");

			el?.scrollIntoView({
				inline: "center",
				block: "center",
			});
		}
	}, [activeRound]);

	return (
		<Wrapper data-ui="tournament-rounds-bar">
			<Bar data-ui="bar">
				{Array.from({
					length: Number(tournament.rounds),
				}).map((_, i) => (
					<RoundButton
						onClick={() => goToRound(i + 1)}
						data-active={activeRound === i + 1}
					>
						<Typography variant="label" color="currentcolor">
							{i + 1}
						</Typography>
					</RoundButton>
				))}
			</Bar>
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flexDirection: "column",
		boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",

		[UIHelper.whileIs("mobile")]: {
			alignItems: "flex-start",
			overflow: "hidden",
			position: "fixed",
			bottom: "55px",
			left: 0,
			pt: 2,
			pb: 4,
			// pl: 1.5,
			gap: 2,
			width: "100vw",
			backdropFilter: "blur(10px)",
		},
	}),
);

const PillAndStandingLink = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		gap: 2,
		pb: 2,
	}),
);

const Bar = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",

		[UIHelper.whileIs("mobile")]: {
			pb: 1,
			px: 2,
		},

		[UIHelper.startsOn("tablet")]: {
			flexDirection: "column",
			alignItems: "center",
			pr: 2,
			overflowY: "auto",
			overflowX: "hidden",
			gap: 2,
		},
	}),
);

const RoundButton = styled(Box)(({ theme }) => ({
	color: theme.palette.neutral[100],
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: theme.spacing(1),
	scrollSnapSlign: "center",

	'&[data-active="true"]': {
		backgroundColor: theme.palette.teal[500],
		color: theme.palette.neutral[100],
	},

	[UIHelper.whileIs("mobile")]: {
		width: "40px",
		height: "40px",
	},

	[UIHelper.startsOn("tablet")]: {
		backgroundColor: theme.palette.black[800],
		width: "40px",
		height: "40px",
		padding: theme.spacing(1.5, 1.5),
	},
}));

const Skeleton = () => {
	return (
		<Wrapper data-ui="tournament-rounds-bar-skeleton">
			<PillAndStandingLink>
				<AppPill.Skeleton
					bgcolor="black.800"
					color="neutral.100"
					height={25}
					width={100}
					maxWidth="70px"
				></AppPill.Skeleton>

				<AppPill.Skeleton
					bgcolor="black.800"
					color="neutral.100"
					height={25}
					width={10}
					maxWidth="70px"
				></AppPill.Skeleton>
			</PillAndStandingLink>

			<Bar data-ui="bar"></Bar>
		</Wrapper>
	);
};

export default {
	Component: TournamentRoundsBar,
	Skeleton,
};
