import { styled } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { useEffect } from "react";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { OverflowOnHover } from "@/domains/ui-system/utils";
import { UIHelper } from "@/theming/theme";
import { useTournament } from "../hooks/use-tournament";
import { useTournamentRounds } from "../hooks/use-tournament-rounds";

const TournamentRoundsBar = () => {
	const { activeRound, goToRound } = useTournamentRounds();
	const { data: tournament } = useTournament();

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
			<BarHeading data-ui="bar-heading">
				<AppPill.Component border="1px solid" borderColor="teal.500" width={70} height={25}>
					<Typography variant="tag" textTransform="uppercase" color="neutral.100" fontWeight={500}>
						rounds
					</Typography>
				</AppPill.Component>
			</BarHeading>

			<Bar data-ui="bar">
				{tournament?.rounds.map(({ label, slug }) => (
					<RoundButton
						key={label}
						onClick={() => goToRound(slug)}
						data-active={activeRound === slug}
					>
						<Typography component="p" variant="label" color="currentcolor">
							{label}
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

		[UIHelper.whileIs("mobile")]: {
			alignItems: "flex-start",
			overflow: "hidden",
			position: "fixed",
			bottom: "80px",
			left: 0,
			pt: 2,
			pb: 4,
			gap: 2,
			width: "100vw",
			backdropFilter: "blur(10px)",
		},

		[UIHelper.startsOn("tablet")]: {
			gap: theme.spacing(3),
		},
	})
);

const PillAndStandingLink = styled(Box)(({ theme }) =>
	theme?.unstable_sx({
		display: "flex",
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		gap: 2,
		pb: 2,
	})
);

const BarHeading = styled(Box)(() => ({
	display: "flex",
}));

const Bar = styled(Box)(({ theme }) => ({
	display: "flex",
	justifyContent: "space-between",

	[UIHelper.whileIs("mobile")]: {
		width: "100%",
	},

	[UIHelper.startsOn("tablet")]: {
		flexDirection: "column",
		gap: theme.spacing(2),
		position: "relative",
		alignItems: "flex-start",
		paddingRight: theme.spacing(1),
	},

	[UIHelper.startsOn("desktop")]: {},
	...OverflowOnHover(),
}));

const RoundButton = styled(Box)(({ theme }) => ({
	color: theme.palette.neutral[100],
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: theme.spacing(1),
	cursor: "pointer",
	flex: "0 0 auto",
	padding: theme.spacing(2),
	minWidth: "40px",

	'&[data-active="true"]': {
		backgroundColor: theme.palette.teal[500],
		color: theme.palette.neutral[100],
	},

	[UIHelper.startsOn("tablet")]: {
		backgroundColor: theme.palette.black[800],
		padding: theme.spacing(1.5),
		width: "100%",
	},

	[UIHelper.startsOn("desktop")]: {},
}));

const Skeleton = () => {
	return (
		<Wrapper data-ui="tournament-rounds-bar-skeleton">
			<PillAndStandingLink>
				<AppPill.Skeleton
					color="neutral.100"
					height={25}
					width={100}
					maxWidth="70px"
				></AppPill.Skeleton>

				<AppPill.Skeleton
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
