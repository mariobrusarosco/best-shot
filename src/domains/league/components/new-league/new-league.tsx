import { zodResolver } from "@hookform/resolvers/zod";
import { Box, styled, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Card, SubmitButton, Wrapper } from "@/domains/league/components/new-league/styles";
import { AppFormInput } from "@/domains/ui-system/components/form";
import { shimmerEffect } from "@/domains/ui-system/components/skeleton/skeleton";
import { useLeagues } from "../../hooks/use-leagues";
import { type CreateLeagueFormData, createLeagueSchema } from "../../schemas";

export const NewLeague = () => {
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
		<Wrapper data-ui="new-league">
			<Typography textTransform="uppercase" variant="paragraph" color="neutral.100">
				create a new league
			</Typography>

			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
				<Card data-ui="league-creation">
					<AppFormInput
						name="label"
						control={control}
						label="League Name"
						placeholder="Enter league namae..."
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

export const NewLeagueSkeleton = () => {
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
