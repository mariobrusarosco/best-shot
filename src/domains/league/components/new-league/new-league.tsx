import { zodResolver } from "@hookform/resolvers/zod";
import { Box, styled, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { AppButton } from "@/domains/ui-system/components/app-button/app-button";
import { AppFormInput } from "@/domains/ui-system/components/app-form/form-input";
import { appShimmerEffect } from "@/domains/ui-system/components/app-skeleton/app-skeleton";
import { AppSurface } from "@/domains/ui-system/components/app-surface/app-surface";
import { useLeagues } from "../../hooks/use-leagues";
import { type CreateLeagueFormData, createLeagueSchema } from "../../schemas";

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

			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
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
	marginY: theme.spacing(2),
	width: 150,
	marginTop: theme.spacing(2),
	padding: theme.spacing(1.5),
	borderRadius: theme.spacing(0.5),
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.neutral[100],

	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
	},
}));

const Card = styled(AppSurface)(({ theme }) => ({
	backgroundColor: theme.palette.black[800],
	paddingX: theme.spacing(2),
	paddingY: theme.spacing(2),
	borderRadius: theme.spacing(0.5),
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	gap: theme.spacing(1),
}));

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
	...appShimmerEffect(),
}));

export default {
	Component: NewLeague,
	Skeleton: NewLeagueSkeleton,
};
