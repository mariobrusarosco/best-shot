import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppInput } from "@/domains/ui-system/components/input/input";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { TypographyProps } from "@mui/material";
import Typography from "@mui/material/Typography/Typography";
import { Box, styled } from "@mui/system";
import { useLeagues } from "../../hooks/use-leagues";

export const NewLeague = () => {
	const { inputs, handleNewLeague } = useLeagues();

	return (
		<Box
			sx={{
				mt: 4,
			}}
		>
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
		</Box>
	);
};

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
