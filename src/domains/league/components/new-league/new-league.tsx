import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { TypographyProps } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { useLeagues } from "../../hooks/use-leagues";

const NewLeague = () => {
	const { inputs, handleNewLeague } = useLeagues();

	return (
		<Wrapper>
			<Typography
				sx={{
					mb: 1,
				}}
				textTransform="uppercase"
				variant="paragraph"
				color="neutral.100"
			>
				create a new league
			</Typography>

			<Card
				sx={{
					mt: 2,
					py: 2,
					gap: 1,
					backgroundColor: "black.800",
				}}
				className="league-creation"
			>
				<Label htmlFor="league-label">Name</Label>

				<AppInput
					type="text"
					id="league-label"
					name="league-label"
					value={inputs.labelInput}
					onChange={inputs.handleLabelChange}
				/>

				<SubmitButton type="submit" onClick={handleNewLeague}>
					create
				</SubmitButton>
			</Card>
		</Wrapper>
	);
};

const Wrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",
	gap: theme.spacing(2),
}));

const SubmitButton = styled(AppButton)(({ theme }) => ({
	my: 2,
	width: 150,
	marginTop: theme.spacing(2),
	padding: theme.spacing(1.5),
	borderRadius: 2,
	backgroundColor: theme.palette.teal[500],
	color: theme.palette.neutral[100],

	"&:hover": {
		backgroundColor: theme.palette.black[500],
	},
}));

const Card = styled(Surface)(({ theme }) =>
	theme.unstable_sx({
		backgroundColor: "black.800",
		px: 2,
		py: 2,
		borderRadius: 2,
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		gap: 1,
	}),
);

interface MyCustomTypographyProps extends TypographyProps {
	htmlFor?: string;
}

const Label = styled((props: MyCustomTypographyProps) => (
	<Typography
		variant="label"
		component={props.component || "label"}
		{...props}
	/>
))(({ theme }) =>
	theme.unstable_sx({
		textTransform: "uppercase",
		color: "neutral.100",
	}),
);

const NewLeagueSkeleton = () => {
	return (
		<Wrapper>
			<Skeleton height={22} />
			<Skeleton height={154} />
		</Wrapper>
	);
};

const Skeleton = styled(Box)(() => ({
	position: "relative",
	...shimmerEffect(),
}));

export default {
	Component: NewLeague,
	Skeleton: NewLeagueSkeleton,
};
