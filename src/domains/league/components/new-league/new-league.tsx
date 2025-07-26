import { Box, styled, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppButton } from "@/domains/ui-system/components/button/button";
import { AppFormInput } from "@/domains/ui-system/components/form";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { Surface } from "@/domains/ui-system/components/surface/surface";
import { useLeagues } from "../../hooks/use-leagues";
import { createLeagueSchema, type CreateLeagueFormData } from "../../schemas";

const NewLeague = () => {
	const { createLeagueMutation } = useLeagues();
	
	const { control, handleSubmit, reset, formState } = useForm<CreateLeagueFormData>({
		resolver: zodResolver(createLeagueSchema),
		defaultValues: {
			label: "",
			description: "",
		},
	});

	const onSubmit = (data: CreateLeagueFormData) => {
		createLeagueMutation.mutate(data, {
			onSuccess: () => {
				reset();
			},
		});
	};

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

			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Card
					sx={{
						mt: 2,
						py: 2,
						gap: 1,
						backgroundColor: "black.800",
					}}
					className="league-creation"
				>
				<AppFormInput
					name="label"
					control={control}
					label="League Name"
					placeholder="Enter league name..."
					required
				/>

				<AppFormInput
					name="description"
					control={control}
					label="Description"
					placeholder="Enter league description (optional)..."
					multiline
					rows={3}
				/>

				<SubmitButton 
					type="submit" 
					disabled={createLeagueMutation.isPending || !formState.isValid}
				>
					{createLeagueMutation.isPending ? "Creating..." : "Create League"}
				</SubmitButton>
				</Card>
			</Box>
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
	})
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
