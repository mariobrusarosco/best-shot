import { useMemberPerformance } from "@/domains/member/hooks/use-member-performance";
import { GridOfCards } from "@/domains/ui-system/components/grid-of-cards/grid-of-cards";
import { AppPill } from "@/domains/ui-system/components/pill/pill";
import { Stack, Typography } from "@mui/material";
import { DashCard } from "../dash-card/dash-card";

const MainLeague = ({
	performance,
}: {
	performance: ReturnType<typeof useMemberPerformance>;
}) => {
	const mainLeague = performance?.data?.mainLeague;

	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill.Component
				bgcolor="teal.500"
				color="neutral.100"
				height={30}
				width="150px"
			>
				<Typography textTransform="uppercase" variant="label">
					main league
				</Typography>
			</AppPill.Component>

			<GridOfCards>
				<DashCard.Component>
					<Typography variant="label" textTransform="uppercase">
						leader
					</Typography>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							{mainLeague?.leader?.name}
						</Typography>
					</Stack>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							points
						</Typography>
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
						>
							{mainLeague?.leader?.points}
						</Typography>
					</Stack>
				</DashCard.Component>

				<DashCard.Component>
					<Typography variant="label" textTransform="uppercase">
						you
					</Typography>

					<Stack direction="row" gap={1.5} alignItems="center">
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="teal.500"
						>
							points
						</Typography>
						<Typography
							textTransform="uppercase"
							variant="tag"
							color="neutral.100"
						>
							{mainLeague?.you?.points}
						</Typography>
					</Stack>
				</DashCard.Component>
			</GridOfCards>
		</Stack>
	);
};

const MainLeagueSkeleton = () => {
	return (
		<Stack color="neutral.100" gap={3}>
			<AppPill.Skeleton height={30} width="150px" />

			<GridOfCards>
				<DashCard.Skeleton />
				<DashCard.Skeleton />
			</GridOfCards>
		</Stack>
	);
};

export default {
	Component: MainLeague,
	Skeleton: MainLeagueSkeleton,
};
